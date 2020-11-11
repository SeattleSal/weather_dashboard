// script for weather_dashboard

// variables
var currentTime = moment();
var cityEl = $("#city");
var searchButton = $("#searchBtn");

// functions
function init() {
    console.log("starting the page!");
    // check local storage
    // if local storage is stored display in a list

    requestWeather();

}



// display current weather, humidity, UV 
// display 5 day 
function requestWeather(){
    var apiKey = '44e826bcde4531a09656dda9bd53cee5';
    var city = "seattle";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // run ajax query
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          displayWeather(response);
    });

}

// displayWeather 
// use response from the AJAX query to separate data and append to HTML
function displayWeather(response) {
    console.log(response);
    var currentDate = currentTime.format('L');
    var tempInfo = response.main;
    // var iconURL = "http://openweathermap.org/img/wn/10d@2x.png";
    console.log(typeof icon);

    // get image to display, put into a function?
    var icon = response.weather[0].icon;
    var iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
    var iconEl = $("<img>");
    iconEl.attr("src", iconURL);

    console.log(tempInfo);

    // append the weather info to html elements by ID
    $("#currentCity").append(`Seattle (${currentDate})`);
    $("#currentCity").append(iconEl);
    $("#temperature").append(`Temperature: ${kelvinToFarenheight(tempInfo.temp)}&deg;F`);
    $("#humidity").append(`Humidity: ${tempInfo.humidity}&#37;`);
    $("#windSpeed").append(`Wind Speed: ${response.wind.speed} MPH`);
    $("#UVIndex").append(`UV Index:`);

}

// kelvinToFarenheint
// convert temperature in kelvin to Farenheight and return with only 2 decimals showing
function kelvinToFarenheight(k) {
    return ((k * (9 / 5)) - 459.67).toFixed(2);
}

// init page
init();

// // add listeners for buttons
// $(document).on("submit", "#searchBtn", searchCity);

// function searchCity (event) {
//     event.preventDefault();
//     console.log("Search for ...");
// }
