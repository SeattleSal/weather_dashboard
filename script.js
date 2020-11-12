// script for weather_dashboard

// variables
var currentTime = moment();
var cityEl = $("#city");
var searchButton = $("#searchBtn");
var pastCitiesList = $("#citiesPast");
var apiKey = '44e826bcde4531a09656dda9bd53cee5';
var currentCity;
var storedCities; 

// functions
function init() {
    // check local storage
    // if local storage is stored display in a list
    currentCity = "Seattle";
    requestWeather(currentCity);
    displayCities();
};

// function to display searched for citites
function displayCities() {
    pastCitiesList.empty();
    // get stored cities to display
    storedCities = localStorage.getItem("cities");
    // currently storing as a string, how do i store as an array or separate by ','
    if (storedCities) {
        var x = [];
        x = storedCities.split(','); // becomes array of cities
        for (var i = 0; i < x.length; i++) {
            pastCitiesList.prepend(`<li class="list-group-item" id=${x[i]}>${x[i]}</li>`);
        }
    }
};


// display current weather, humidity, UV 
// display 5 day 
function requestWeather(city){

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    // run ajax query
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          displayWeather(response);
          var lat = response.coord.lat;
          var lon = response.coord.lon;
          console.log(typeof lat, typeof lon);
          requestForecast(lat, lon);
    });

}

// displayWeather 
// use response from the AJAX query to separate data and append to HTML
function displayWeather(response) {

    // create function to clear elements
    $("#currentCity").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#windSpeed").empty();
    $("#UVIndex").empty();

    console.log(response);
    var currentDate = currentTime.format('L');
    var tempInfo = response.main;
    // var iconURL = "http://openweathermap.org/img/wn/10d@2x.png";

    // get image to display, put into a function?
    var icon = response.weather[0].icon;
    var iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
    var iconEl = $("<img>");
    iconEl.attr("src", iconURL);

    // console.log(tempInfo);

    // append the weather info to html elements by ID
    $("#currentCity").append(`${currentCity} (${currentDate})`);
    $("#currentCity").append(iconEl);
    $("#temperature").append(`Temperature: ${tempInfo.temp}&deg;F`);
    $("#humidity").append(`Humidity: ${tempInfo.humidity}&#37;`);
    $("#windSpeed").append(`Wind Speed: ${response.wind.speed} MPH`);
    $("#UVIndex").append(`UV Index:`);

}

// use onecall api to get 5 day forecast and uv
function requestForecast(lat, lon) {
    // get 5 days of forecast for lat/long in units imperial (farenheight)
    // TO DO - this is getting 5 timestamps NOT 5 days
    var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    console.log(forecastURL);

    // run ajax query to openweather
    $.ajax({
        url: forecastURL,
        method: "GET"
        }).then(function(response) {
           displayForecast(response);
           // will display date, icon, temp and humidity for five days
    });
}

// displayForecast - display 5 cards of forecasted weather
function displayForecast(response) {
    console.log("display forecast...");
    // $("#day1").empty();
    console.log(response.daily);
    var forecastArr = response.daily;
    for (var i = 0; i < 5; i++) {
        var dateString = moment.unix(forecastArr[i].dt).format("MM/DD/YYYY");
        $(`#day${i +1}`).text(`Date: ${dateString} 
            ICON:  ${forecastArr[i].weather[0].icon}  
            Temp: ${forecastArr[i].temp.max} ${String.fromCharCode(176)}F
            Humidity: ${forecastArr[i].humidity}%`);
    }
}

// init page - shows current weather for seattle automatically and any stored cities
init();

// when search is initiated
$(document).on("click", "#searchBtn", function (e) {
    e.preventDefault();
    currentCity = cityEl.val();
    requestWeather(currentCity);

    // save city to local storage, make a function?, will need to check what else is stored
    storedCities = localStorage.getItem("cities") || "";
    if (storedCities == "") {
        localStorage.setItem('cities', currentCity);
    } else if (typeof storedCities === "string") {
        console.log("one city stored");
        var x = [];
        x.push(storedCities, currentCity);
        localStorage.setItem('cities', x);
        console.log(localStorage.getItem("cities"));
    } 
    displayCities();
});

//  listen for clicked past city in list
$("#citiesPast").on("click", ".list-group-item", function(){

    currentCity = $(this).attr("id");
    console.log("City has been clicked!" + currentCity);
    requestWeather(currentCity);
});
