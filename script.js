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

    // get stored cities to display
    storedCities = localStorage.getItem("cities");
    // currently storing as a string, how do i store as an array or separate by ','
    if (storedCities) {
        var x = [];
        x = storedCities.split(','); // becomes array of cities
        // console.log(typeof x);
        // console.log(x);
        // TO DO: add code to create a list of the cities stored
        for (var i = 0; i < x.length; i++) {
            // var listEl = $("<li>");
            // listEl.
            pastCitiesList.append(`<li class="list-group-item">${x[i]}</li>`);
        }
        
    }

}



// display current weather, humidity, UV 
// display 5 day 
function requestWeather(city){

    // var city = "seattle";
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

function requestForecast(lat, lon) {
    console.log("requesting 5 day forecast for " + lat + " , " + lon);
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    console.log(forecastURL);
        // run ajax query
    $.ajax({
        url: forecastURL,
        method: "GET"
        }).then(function(response) {
           console.log(response);
           // will display date, icon, temp and humidity for five days
    });
}

// NOT NEEDED - DELETE THIS!
// kelvinToFarenheint
// convert temperature in kelvin to Farenheight and return with only 2 decimals showing
// function kelvinToFarenheight(k) {
//     return ((k * (9 / 5)) - 459.67).toFixed(2);
// }

// init page - shows current weather for seattle automatically
init();

// // add listeners for buttons
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
    

 
});

