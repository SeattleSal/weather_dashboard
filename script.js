// script for weather_dashboard

// variables
var currentTime = moment();

// functions
function init() {
    console.log("starting the page!");
    console.log(currentTime);

    // check local storage
    // if local storage is stored display in a list

    // move the below to a function that listens for the user to enter a city
    // or click on existing city listed on left side
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
    var currentDate = currentTime.format('L');
    var tempInfo = response.main;
    var iconURL = "http://openweathermap.org/img/wn/10d@2x.png";
    // var iconURL = `http://openweathermap.org/img/wn/${tempInfo.weather.icon}.png`;
    var imgEl = $("<img>");
    imgEl.attr("src", iconURL);

    console.log(response);
    console.log(tempInfo);

    // append the weather info to html elements by ID
    $("#currentCity").append(`Seattle (${currentDate})`);
    $("#currentCity").append(imgEl);
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

// add listeners for buttons