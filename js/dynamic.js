//function to get current position of user
navigator.geolocation.getCurrentPosition(displayLocationInfo);
var longitude;
var latitude;

function displayLocationInfo(position) {
    longitude = position.coords.longitude.toFixed();
    latitude = position.coords.latitude.toFixed();

    var endpointByGeoCordnt = `lat=${latitude}&lon=${longitude}`;
    //pass geo coordinates
    getForecastDataFromAPI(endpointByGeoCordnt);
}

//Retrieve Forecast data from locastorage
var localStorageForecastHistory = JSON.parse(localStorage.getItem("forecastHistory"));

//create HTML contents
//page setup - 
//create top navbar
//create a row 
//create two columns under the above row
//under the 1st column - create 2 rows 1st-for(search contents) 2nd-for(city list)
//under the 2nd column - create 2 rows  1st-for(current weather display) 2nd-for(5day forecast)
//under 2nd-for(5day forecast) - create 5 columns

//capture content container
var $container = $(".data_container");

//create a row
var $row = $("<div>");
$row.addClass("row ");
$container.append($row);

//create div containers needed for enclosing the HTML elements
var $col_1 = $("<div>");
$col_1.addClass("col-sm-3 searchBoxContainer mt-3 mb-2 border border-dark pt-3");
$row.append($col_1);

// div row to enclose search label and input box
var $col_1_row_1 = $("<div>");
$col_1.append($col_1_row_1);

//adds search label to the search box
var $searchLabel = $("<h5>");
$searchLabel.text("Search for a City:");
$col_1_row_1.append($searchLabel);

//search box HTML contnet build
var $divSearchContainer = $("<div>");
var $inputBox = $("<input>");
$inputBox.attr("id", "inputBoxId");
$divSearchContainer.append($inputBox);

// create a search button
var $searchButton = $("<div>");
$searchButton.addClass("fas fa-search btn btn-primary  startSearching");
$divSearchContainer.append($searchButton);
//append contents
$col_1_row_1.append($divSearchContainer);


//city list goes here
var $col_1_row_2 = $("<div>");
$col_1_row_2.addClass(" mt-3 bg-light  cityList");
$col_1.append($col_1_row_2);

var $searchLabel = $("<p>");
$searchLabel.text("Search History");
$searchLabel.addClass("text-center text-strong pt-3");
$col_1_row_2.append($searchLabel)
//first element in the list should be pulled from current Ajax request made by using Geolocation coordinates
//the rest of records should come from local storage



//under the 2nd column - create 2 rows  1st-for(current weather display) 2nd-for(5day forecast)
//create containers needed
var $col_2 = $("<div>");
$col_2.addClass("col-sm-9   borderColor");
$row.append($col_2);

// 1st column-for(current weather display)
var $col_2_row_1 = $("<div>");
$col_2_row_1.addClass("row border border border-dark  bg-light p-3 m-3  font-weight-bold shadow-lg");
$col_2.append($col_2_row_1);

var $col_2_row_1_col_1 = $("<div>");
$col_2_row_1_col_1.addClass("col-sm-7 ");
//create elements needed for holding text 
var $header = $("<h3>");
var $currentTemperature = $("<p>");
var $currentHumidity = $("<p>");
var $currentWindspeed = $("<p>");
var $currentUvindex = $("<p>");
var $currentUvindexSpan = $("<span>");

//attach/append new elements to the HTML body
$col_2_row_1_col_1.append($header);
$col_2_row_1_col_1.append($currentTemperature);
$col_2_row_1_col_1.append($currentHumidity);
$col_2_row_1_col_1.append($currentWindspeed);
$col_2_row_1_col_1.append($currentUvindex);

$currentUvindex.append($currentUvindexSpan);
$col_2_row_1.append($col_2_row_1_col_1);

//create elements needed for holding icon on current temp 
var $col_2_row_1_col_2 = $("<div>");
$col_2_row_1_col_2.addClass("col-sm-5 circle");
var $imageIconHead = $("<img>");
$col_2_row_1_col_2.append($imageIconHead);
var $imageDecription = $("<h2>");
$col_2_row_1_col_2.append($imageDecription);
$col_2_row_1.append($col_2_row_1_col_2);

//add labels to the elements
$header.text('');
$header.addClass("border-bottom pb-2")
$currentTemperature.text(`Temprature: `);
$currentHumidity.text(`Humidity:`);
$currentWindspeed.text(`Wind Speed:`);
$currentUvindexSpan.text('');

//  2nd-for(5day forecast)
var $col_2_row_2 = $("<div>");
$col_2.append($col_2_row_2);

//Forecast label
var $foreCastLabel = $("<h5>");
$foreCastLabel.addClass("mt-4")
$foreCastLabel.text("5-Day Forecast:");
$col_2_row_2.append($foreCastLabel);
$col_2_row_2.addClass("bg-light border border-dark pl-3 ml-3");

//forecast data container div boxes
var $foreCastBoxs = $("<div>");
$foreCastBoxs.addClass("row pl-2 foreCastDivCont");
$col_2_row_2.append($foreCastBoxs);

//add event listner to the search box
$(".startSearching").click(function (event) {
    var searchParam = $("#inputBoxId").val().trim();
    var endpointByCity = `q=${searchParam}`;
    $(".foreCastBoxes").remove();
    getForecastDataFromAPI(endpointByCity);
})

//add event listner to the click on history list box
$(".cityList").click(function (event) {
    var myValue = event.target.id;
    var recent10History = localStorageForecastHistory[myValue];
    var currentTemp = (recent10History.currentTemperature).toFixed();

    //add texts to the HTML Elements 
    $header.text(`${recent10History.city}, ${recent10History.country} (${(recent10History.date).slice(0,10)})`);
    $currentTemperature.text(`Temprature: ${currentTemp}°F`);
    var icon = `http://openweathermap.org/img/wn/${recent10History.currentWeatherIcon}@2x.png`;
    $imageIconHead.attr('src', icon)
    $imageDecription.text(`${recent10History.imageDescription}`)
    $currentHumidity.text(`Humidity: ${recent10History.currentHumidity}%`);
    $currentWindspeed.text(`Wind Speed: ${recent10History.currentWindspeed}MPH`);


    create5DayForecastElements([recent10History]);
})


function getForecastDataFromAPI(searchParam1) {
    // API for retrieving weather data from
    var endpoint = "https://api.openweathermap.org/data/2.5/forecast?";
    var weatherMapAPIKey = "f9671ca41d5667371da2cc4e58a42211";

    //event listner to get data for user by using city
    var weatherAPIUrl = `${endpoint}${searchParam1}&APPID=${weatherMapAPIKey}`;

    //API call to send as an action when user clicks on the search button
    $.ajax({
        url: weatherAPIUrl,
        method: "GET",
    }).then(function (response) {
        //capture weather record and location records
        var climateRecord = response.list;
        var locationRecord = response.city;

        //add texts to the HTML Elements 
        var icon = `http://openweathermap.org/img/wn/${climateRecord[0].weather[0].icon}@2x.png`;
        $imageIconHead.attr('src', icon)
        $imageDecription.text(`${climateRecord[0].weather[0].description}`)
        $header.text(`${locationRecord.name}, ${locationRecord.country} (${climateRecord[0].dt_txt.slice(0,10)})`);
        $currentTemperature.text('Temprature: ' + convertKelvinToFahrenheit(climateRecord[0].main.temp).toFixed() + '°F');
        $currentHumidity.text(`Humidity: ${climateRecord[0].main.humidity}%`);
        $currentWindspeed.text(`Wind Speed: ${climateRecord[0].wind.speed}MPH`);
     

        // array to save the average forecast temprature for 5days - API returns 5day forecast for every 3hr - calculation is performed to calculate the average for the day
        var forecastHistory = [];

        var dailyForecast = {};
        var count = 0;
        var temperature = 0;
        var humidity = 0;
        var windspeed = 0;
        var uvindec = 0;
        var index = 1;

        //calculate average weather for each day from the 8 data points divided in 3hr interval
        for (let i = 0; i < climateRecord.length; i++) {

            if (count < 7) {
                temperature += convertKelvinToFahrenheit(climateRecord[i].main.temp);
                humidity += climateRecord[i].main.humidity;
                windspeed += climateRecord[i].wind.speed;
                uvindec = 9.99;
                count++;
            } else
            if (count === 7) {
                //add the data to dailyForecast array at the last forecast for the day
                dailyForecast.city = locationRecord.name,
                dailyForecast.country = locationRecord.country,
                dailyForecast.date = (climateRecord[0].dt_txt).slice(0, 10),
                dailyForecast.currentTemperature = convertKelvinToFahrenheit(climateRecord[i].main.temp);
                dailyForecast.currentHumidity = climateRecord[i].main.humidity;
                dailyForecast.currentWindspeed = climateRecord[i].wind.speed;
                dailyForecast.currentUvindex = 9.99;
                dailyForecast.currentWeatherIcon = climateRecord[0].weather[0].icon
                dailyForecast.imageDescription = climateRecord[0].weather[0].description

                //add daily forecast data with key day1, day2, ......
                dailyForecast[`day${index}`] = {
                    "averageTemperature": (temperature / count).toFixed(),
                    "averageHumidity": (humidity / count).toFixed(2),
                    "averageWindspeed": (windspeed / count).toFixed(2),
                    "uvindec": uvindec,
                    "dailyWeatherIcon": climateRecord[i - 3].weather[0].icon,
                    "currentDate": (climateRecord[i - 3].dt_txt).slice(0, 10),
                };
                // data reset to start calculating new average for next day
                temperature = 0;
                humidity = 0;
                windspeed = 0;
                uvindec = 0;
                count = 0;
                i--;
                index++;
            }
        }
        //save data to local storage based on a condition - we only save data from search by user input. no search for weather forecast data from geolocation
        if (searchParam1.includes("q=")) {
            localStorageForecastHistory = JSON.parse(localStorage.getItem("forecastHistory"));
            if (localStorageForecastHistory === null) {
                forecastHistory.push(dailyForecast);
                localStorage.setItem("forecastHistory", JSON.stringify(forecastHistory));
            } else
            if (localStorageForecastHistory.length > 0) {
                localStorageForecastHistory.push(dailyForecast);
                localStorage.setItem("forecastHistory", JSON.stringify(localStorageForecastHistory));
            }
            localStorageForecastHistory = JSON.parse(localStorage.getItem("forecastHistory"));

            create5DayForecastElements(localStorageForecastHistory);
        } else
        if (searchParam1.includes("lat=")) {
            forecastHistory.push(dailyForecast);

            create5DayForecastElements(forecastHistory);
        }
    })
}

// update UI with Existing data is data is available on local storage
//localStorage after update
createCitySearchHistoryList(localStorageForecastHistory)

//create City Search History List
function createCitySearchHistoryList(localStorageForecastHistory) {
    if (localStorageForecastHistory !== null) {
        var localStorageForecastHistoryLength = localStorageForecastHistory.length;
        for (var i = localStorageForecastHistoryLength - 1; i > (localStorageForecastHistoryLength - 11); i--) {
            // add text to page - left City List  
            var cityList = $("<button>");
            cityList.addClass("border borderColor p-2 text-center  btn-block  bg-light cityListContainer ");
            cityList.attr("id", `${i}`);
            cityList.text(localStorageForecastHistory[i].city);
            $col_1_row_2.append(cityList)
        }
    }
}

// create 5Day Forecast Elements
function create5DayForecastElements(localStorageForecastHistory) {
    // remove existing elements under the container
    $(".foreCastBoxes").remove();
    //5day  
    for (let j = 1; j <= 5; j++) {
        var day = `day${j}`;
        var numbRec = localStorageForecastHistory.length - 1;
        var forecastForDay = localStorageForecastHistory[numbRec][day];

        var $foreCastSingleBox = $("<div>");
        $foreCastSingleBox.addClass("col-sm-2 foreCastBoxes m-2 shadow-lg");
        $foreCastBoxs.append($foreCastSingleBox);

        //create elements to hold text content within the div boxes
        var $foreCastDate = $("<h5>");
        var $forecastTemperature = $("<p>");
        var $imageIcon = $("<img>");
        var $forecastHumidity = $("<p>");

        //forecast date
        $foreCastSingleBox.append($foreCastDate);
        $foreCastDate.text(forecastForDay.currentDate);
        $foreCastSingleBox.append($foreCastDate);

        //forecast temprature
        $foreCastSingleBox.append($forecastTemperature);
        $forecastTemperature.text(`Temprature: ${forecastForDay.averageTemperature}°F`);

        //add icon
        var iconURL = `http://openweathermap.org/img/wn/${forecastForDay.dailyWeatherIcon}@2x.png`;
        $imageIcon.attr("src", iconURL)
        $foreCastSingleBox.append($imageIcon);

        //forecast temprature
        $foreCastSingleBox.append($forecastHumidity);
        $forecastHumidity.text(`Humidity: ${forecastForDay.averageHumidity}%`);

        //add classes to foreCastSingleBox 
        $foreCastSingleBox.addClass("pt-3")
    }
}

// convert temprature  
function convertKelvinToFahrenheit(kelvinTemp) {
    var fahrenheitTemp = ((kelvinTemp - 273.15) * 1.8) + 32;
    return fahrenheitTemp;
}