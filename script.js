//

function init() {
    console.log("starting the page!");

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

function displayWeather(response) {
    console.log(response);
    console.log(response.main);
    console.log("Temp" + response.main.temp);
    $("#temperature").append(`Temperature: ${kelvinToFarenheight(response.main.temp)}&deg;F`);
    $("#humidity").append(`Humidity: ${response.main.humidity}&#37;`);
    $("#windSpeed").append(`Wind Speed: ${response.wind.speed} MPH`);
    $("#UVIndex").append(`UV Index:`);


}

function kelvinToFarenheight(k) {
    return (k * (9 / 5)) - 459.67;
}

// init page
init();

// add listeners for buttons