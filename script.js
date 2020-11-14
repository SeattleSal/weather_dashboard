// script for weather_dashboard

// variables
var currentTime = moment();
var cityEl = $("#city");
var searchButton = $("#searchBtn");
var pastCitiesList = $("#citiesPast");
var apiKeyMap = '44e826bcde4531a09656dda9bd53cee5';
// to do - remove all google map references if i don't use them after all
var apiKeyGM = 'AIzaSyDGwKSGmGvgOL9oxOeskf9m1tQa4ors3I4';
var currentCity;
var storedCities; 

// functions
function init() {
    // default shows Seattle
    currentCity = localStorage.getItem("lastCity") || "Seattle";
    // if previous queries stored, display in a list
    displayCities();
    // make call to request then display weather    
    requestWeather(currentCity);
};

// function to display stored searched for citites
function displayCities() {
    pastCitiesList.empty();
    storedCities = localStorage.getItem("cities") || "";
    console.log(storedCities);
    // currently storing as a string, how do i store as an array or separate by ','
    // TO DO - fix so spaces are replaced with '_' or something
    if (storedCities) {
        var x = [];
        x = storedCities.split(','); // becomes array of cities
        for (var i = 0; i < x.length; i++) {
            var cityFormatted = x[i].replace(/_/g, " ");
            // console.log(cityFormatted);
            pastCitiesList.prepend(`<li class="list-group-item city-name" id=${x[i]}>${cityFormatted}</li>`);
        }
        pastCitiesList.append(`<button id="clear" class="btn btn-primary">Clear Cities</button>`);
    }
};

// click clear button - removes cities from local storage
$(document).on("click", "#clear", function(){
    localStorage.removeItem("cities");
    displayCities();
});

// requestWeather - make call to weatherAPI for city
function requestWeather(city){

    // TO DO - can I replace this with a call to google maps instead?

    // get coordinates from first query to maps
   var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKeyMap}`;
   console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          var lat = response.coord.lat;
          var lon = response.coord.lon;
          requestForecast(lat, lon);
    });

}

// TO DO - maybe delete this or replace it up in requestWeather function...
function getCoordinates(city){
    var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${apiKeyGM}`;
    // console.log(queryURL);
    
    // get lon and lat for city from google geocoding api
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          console.log(response.results[0].geometry.location);
          var lat = response.results[0].geometry.location.lat;
          var lon = response.results[0].geometry.location.lng;
          var coords = `${lat} ${lon}`;
          console.log(coords, typeof coords);
          return coords;
    });

}

// use openweather onecall api to get current forecast, 5 day forecast and uv
function requestForecast(lat, lon) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyMap}`;
    // console.log(forecastURL);

    // run ajax query to openweather onecall API
    $.ajax({
        url: forecastURL,
        method: "GET"
        }).then(function(response) {
            console.log(response);
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
        
    for (var i = 0; i < 5; i++) {
        // empty html elements
        $(`#day${i +1}`).empty();

        // format date
        var dateString = moment.unix(forecastArr[i].dt).format("MM/DD/YYYY");

        // build icon
        var icon = forecastArr[i].weather[0].icon;
        var iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
        var iconEl = $("<img>");
        iconEl.attr("src", iconURL);

        // set html elements to display
        $(`#day${i +1}`).append(`Date: ${dateString}`); 
        $(`#day${i +1}`).append(iconEl); 
        $(`#day${i +1}`).append(`<br>`); 
        $(`#day${i +1}`).append(`Temp: ${forecastArr[i].temp.max} ${String.fromCharCode(176)}F`); 
        $(`#day${i +1}`).append(`<br>`); 
        $(`#day${i +1}`).append(`Humidity: ${forecastArr[i].humidity}%`); 
    }
}

// searchRequested - when user searches for a city, request weather and store searched city
function searchRequested (e) {
    e.preventDefault();
    currentCity = cityEl.val();
    currentCity = capitalize(currentCity);
    // console.log(currentCity);
    requestWeather(currentCity);

    var cityFormatted = currentCity.replace(/ /g, "_");

    // save city to local storage, make a function?, will need to check what else is stored
    storedCities = localStorage.getItem("cities") || "";
    if (storedCities == "") {
        localStorage.setItem('cities', cityFormatted);
    } else if (typeof storedCities === "string") {
        var x = [];
        x.push(storedCities, cityFormatted);
        console.log(JSON.stringify(x));
        localStorage.setItem('cities', x);
        console.log(localStorage.getItem("cities"));
    } 
    displayCities();
    localStorage.setItem("lastCity", currentCity);
}

// capitalize the string as String - do I need to keep this?
function capitalize(str) {
    var strVal = '';
    str = str.split(' ');
    for (var chr = 0; chr < str.length; chr++) {
      strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' '
    }
    return strVal
} 

// init page - shows current weather for seattle automatically and any stored cities
init();

// when search is initiated
$(document).on("click", "#searchBtn", searchRequested);

//  listen for click on list of past city searches
$("#citiesPast").on("click", ".list-group-item", function(){

    // get city name clicked on and replace "_" with " " if needed
    currentCity = $(this).attr("id").replace(/_/g, " ");
    // console.log("City has been clicked!" + currentCity);
    requestWeather(currentCity);
});
