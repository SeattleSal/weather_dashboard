// java script for weather_dashboard
// VARIABLES
var currentTime = moment();
var cityEl = $("#city");
var searchButton = $("#searchBtn");
var pastCitiesList = $("#citiesPast");
var resultsEl = $("#results");
var apiKeyMap = '44e826bcde4531a09656dda9bd53cee5';
var apiKeyGM = 'AIzaSyDGwKSGmGvgOL9oxOeskf9m1tQa4ors3I4';
var currentCity;
var storedCities; 

// FUNCTIONS
// init - initialize page showing weather of last city searched or blank if no last city searched
function init() {
    currentCity = localStorage.getItem("lastCity") || "";
    if (currentCity == "") {
        resultsEl.addClass("invisible");
    } else {
        // if previous queries stored, display in a list and request current weather
        displayCities();
        requestWeather(currentCity);
    }
};

// displayCities - display stored searched for citites
function displayCities() {
    // show results elements and empty list element
    resultsEl.removeClass("invisible");
    pastCitiesList.empty();

    storedCities = localStorage.getItem("cities") || "";
    // console.log(storedCities);
    if (storedCities) {
        var x = [];
        x = storedCities.split(','); // becomes array of cities
        for (var i = 0; i < x.length; i++) {
            // names are stored with spaces replaced with "_" so revert back to spaces
            var cityFormatted = x[i].replace(/_/g, " ");
            pastCitiesList.prepend(`<li class="list-group-item city-name" id=${x[i]}>${cityFormatted}</li>`);
        }
        pastCitiesList.append(`<button id="clear" class="btn btn-primary">Clear Cities</button>`);
    }
};

// requestWeather - make call to weatherAPI for city
function requestWeather(city){
    // get coordinates from first query to maps
   var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKeyMap}`;
    //    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          var lat = response.coord.lat;
          var lon = response.coord.lon;
          requestForecast(lat, lon);
    });
}

// requestForecast - use openweather onecall api to get current forecast, 5 day forecast and uv
function requestForecast(lat, lon) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyMap}`;
    // console.log(forecastURL);
    // run ajax query to openweather onecall API
    $.ajax({
        url: forecastURL,
        method: "GET"
        }).then(function(response) {
            // console.log(response);
            displayWeather(response);
            displayForecast(response);
        }).fail(function (response) { // this isn't working...
            console.log("I got a 404!");
        });
}

// displayWeather - display current weather in top card
function displayWeather(response) {

    // clear display elements
    $("#currentCity").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#windSpeed").empty();
    $("#UVIndex").empty();
    $("#UVIndex").removeClass();

    var currentDate = currentTime.format('L');
    var tempInfo = response.current;

    // get image to display
    var icon = tempInfo.weather[0].icon;
    var iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
    var iconEl = $("<img>");
    iconEl.attr("src", iconURL);

    // get class info for uv to show color based on uv level
    var uvClass = getUVClass(tempInfo.uvi);

    // append the current weather info to html elements by ID
    $("#currentCity").append(`${currentCity} (${currentDate})`);
    $("#currentCity").append(iconEl);
    $("#temperature").append(`Temperature: ${tempInfo.temp}&deg;F`);
    $("#humidity").append(`Humidity: ${tempInfo.humidity}&#37;`);
    $("#windSpeed").append(`Wind Speed: ${tempInfo.wind_speed} MPH`);
    $("#UVIndex").append(`UV Index: ${tempInfo.uvi}`);
    $("#UVIndex").addClass(uvClass);
}

// getUVClass - determine color (class) for UV rating
function getUVClass (uv) {
    var colorClass;
    if (uv <=2 ) {
        colorClass = "badge badge-success"; // green
    } else if (uv > 2 && uv < 6) {
        colorClass = "badge badge-warning"; // yellow
    } else if (uv >= 6) {
        colorClass = "badge badge-danger"; // red
    }
    return colorClass;
}

// displayForecast - display 5 days of forecasted weather
function displayForecast(response) {
    // console.log(response.daily);
    var forecastArr = response.daily;
        
    for (var i = 1; i < 6; i++) {
        // empty html elements
        $(`#day${i}`).empty();

        // format date
        var dateString = moment.unix(forecastArr[i].dt).format("MM/DD/YYYY");

        // build img element for weather icon
        var icon = forecastArr[i].weather[0].icon;
        var iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
        var iconEl = $("<img>");
        iconEl.attr("src", iconURL);

        // set html elements to display
        $(`#day${i}-date`).text(`${dateString}`); 
        $(`#day${i}`).append(iconEl); 
        $(`#day${i}`).append(`<br>`); 
        $(`#day${i}`).append(`Temp: ${forecastArr[i].temp.max} ${String.fromCharCode(176)}F`); 
        $(`#day${i}`).append(`<br>`); 
        $(`#day${i}`).append(`Humidity: ${forecastArr[i].humidity}%`); 
    }
}

// searchRequested - when user searches for a city, request weather and store searched city
function searchRequested (e) {
    e.preventDefault();
    // if nothing is entered, exit function
    if(cityEl.val() == "") {
        return;
    }

    currentCity = cityEl.val();
    currentCity = capitalize(currentCity);
    requestWeather(currentCity);

    // replace spaces with underscores for storage
    var cityFormatted = currentCity.replace(/ /g, "_");

    // add cities to local storage, if already stored do not add
    storedCities = localStorage.getItem("cities") || "";
    // console.log(`not stored? ${!storedCities.includes(cityFormatted)}`);
    if (storedCities == "") {
        localStorage.setItem('cities', cityFormatted);
    } else if (typeof storedCities === "string" && !storedCities.includes(cityFormatted)) {
        var x = [];
        x.push(storedCities, cityFormatted);
        localStorage.setItem('cities', x);
        // console.log(localStorage.getItem('cities'));
    } 
    displayCities();
    cityEl.val("");
    localStorage.setItem("lastCity", currentCity);
}

// capitalize the string as String - do I need to keep this?
// source: https://stackoverflow.com/questions/5122402/uppercase-first-letter-of-variable
function capitalize(str) {
    var strVal = '';
    str = str.split(' ');
    for (var chr = 0; chr < str.length; chr++) {
      strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' '
    }
    return strVal
} 

// FUNCTION CALLS AND LISTENERS
// init page - shows current weather for last city searched or seattle if no last city
init();

// when search is initiated
$(document).on("click", "#searchBtn", searchRequested);

// when a past city searched is clicked on
$("#citiesPast").on("click", ".list-group-item", function(){
    // get city name clicked on and replace "_" with " " if needed
    currentCity = $(this).attr("id").replace(/_/g, " ");
    requestWeather(currentCity);
});

// when the clear button is clicked, removes cities from local storage
$(document).on("click", "#clear", function(){
    localStorage.removeItem("cities");
    displayCities();
});