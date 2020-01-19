//function to get current position of user
navigator.geolocation.getCurrentPosition(displayLocationInfo);
var longitude;
var latitude;

function displayLocationInfo(position) {
    longitude = position.coords.longitude.toFixed();
    latitude = position.coords.latitude.toFixed();

    var endpointByGeoCordnt = `lat=${latitude}&lon=${longitude}`
    console.log(endpointByGeoCordnt)
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

var $container = $(".container");

var $row = $("<div>");
$row.addClass("row ");
$container.append($row);

//create div containers needed for enclosing the HTML elements
var $col_1 = $("<div>");
$col_1.addClass("col-sm-3 searchBoxContainer pt-3");
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
$searchButton.addClass("fas fa-search btn-lg btn-primary startSearching");
$divSearchContainer.append($searchButton);
//append contenets
$col_1_row_1.append($divSearchContainer);


//city list goes here
var $col_1_row_2 = $("<div>");
$col_1_row_2.addClass(" mt-3 bg-white cityList");
$col_1.append($col_1_row_2);
//first element in the list should be pulled from current Ajax request made by using Geolocation coordinates
//the rest of records should come from local storage



//under the 2nd column - create 2 rows  1st-for(current weather display) 2nd-for(5day forecast)
//create containers needed
var $col_2 = $("<div>");
$col_2.addClass("col-sm-9  border borderColor");
$row.append($col_2);

// 1st column-for(current weather display)
var $col_2_row_1 = $("<div>");
$col_2_row_1.addClass("border borderColor p-3 mt-3  shadow-lg");
$col_2.append($col_2_row_1);

//create elements needed for holding text 
var $header = $("<h5>");
var $currentTemperature = $("<p>");
var $currentHumidity = $("<p>");
var $currentWindspeed = $("<p>");
var $currentUvindex = $("<p>");
var $currentUvindexSpan = $("<span>");

//attach/append new elements to the HTML body
$col_2_row_1.append($header);
$col_2_row_1.append($currentTemperature);
$col_2_row_1.append($currentHumidity);
$col_2_row_1.append($currentWindspeed);
$col_2_row_1.append($currentUvindex);
$currentUvindexSpan.addClass("bg-danger p-1 ml-2 rounded text-white text-strong");
$currentUvindex.append($currentUvindexSpan);

//add labels to the elements
$header.text('');
$currentTemperature.text(`Temprature: `);
$currentHumidity.text(`Humidity:`);
$currentWindspeed.text(`Wind Speed:`);
$currentUvindex.text(`UV Index:`);
$currentUvindexSpan.text('');

//  2nd-for(5day forecast)
var $col_2_row_2 = $("<div>");
$col_2.append($col_2_row_2);

//Forecast label
var $foreCastLabel = $("<h5>");
$foreCastLabel.addClass("mt-4")
$foreCastLabel.text("5-Day Forecast:");
$col_2_row_2.append($foreCastLabel);

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

$(".cityList").click(function (event) {
    var myValue = event.target.id;
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
        $header.text(`${locationRecord.name}, ${locationRecord.country}`);
        $currentTemperature.text(`Temprature: ${climateRecord[0].main.temp}°F`);
        $currentHumidity.text(`Humidity: ${climateRecord[0].main.humidity}%`);
        $currentWindspeed.text(`Wind Speed: ${climateRecord[0].wind.speed}MPH`);
        $currentUvindexSpan.text('9.49');

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
            if (count < 8) {
                temperature += climateRecord[i].main.temp;
                humidity += climateRecord[i].main.humidity;
                windspeed += climateRecord[i].wind.speed;
                uvindec = 9.99;
                count++;
            } else
            if (count === 8) {
                //add the data to dailyForecast array at the last forecast for the day
                dailyForecast.city = locationRecord.name,
                    dailyForecast.country = locationRecord.country,
                    dailyForecast.date = climateRecord.dt_txt,
                    dailyForecast.dateNum = climateRecord.dt,
                    dailyForecast.currentTemperature = climateRecord[i].main.temp;
                dailyForecast.currentHumidity = climateRecord[i].main.humidity;
                dailyForecast.currentWindspeed = climateRecord[i].wind.speed;
                dailyForecast.currentUvindex = 9.99;
                //add daily forecast data with key day1, day2, ......
                dailyForecast[`day${index}`] = {
                    "averageTemperature": (temperature / count).toFixed(2),
                    "averageHumidity": (humidity / count).toFixed(2),
                    "averageWindspeed": (windspeed / count).toFixed(2),
                    "uvindec": uvindec,
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
        }

        //5day  
        for (let j = 1; j < 5; j++) {
            var day = `day${j}`;

            var forecastForDay = localStorageForecastHistory[localStorageForecastHistory.length - 1][day];

            var $foreCastSingleBox = $("<div>");
            $foreCastSingleBox.addClass("col-sm-2 foreCastBoxes m-2");
            $foreCastBoxs.append($foreCastSingleBox);

            //create elements to hold text content within the div boxes
            var $foreCastDate = $("<p>");
            var $forecastTemperature = $("<p>");
            var $forecastHumidity = $("<p>");

            //forecast date
            $foreCastSingleBox.append($foreCastDate);
            $foreCastDate.text(forecastForDay.dt_txt);
            //forecast temprature
            $foreCastSingleBox.append($forecastTemperature);
            $forecastTemperature.text(`Temprature: ${forecastForDay.averageTemperature}`);
            //forecast temprature
            $foreCastSingleBox.append($forecastHumidity);
            $forecastHumidity.text(`Humidity: ${forecastForDay.averageHumidity}%`);
        }

    })
}

// update UI with Existing data is data is available on local storage
//localStorage after update
localStorageForecastHistory = JSON.parse(localStorage.getItem("forecastHistory"));
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
