//function to get current position of user
navigator.geolocation.getCurrentPosition(displayLocationInfo);
  function displayLocationInfo(position) {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;
    console.log(`longitude: ${ lng } | latitude: ${ lat }`);
  }

  



var $container = $(".container");

var $row = $("<div>");
$row.addClass("row ");
$container.append($row);

var $col_1 = $("<div>"); 
$col_1.addClass("col-sm-3 searchBoxContainer pt-3");
$row.append($col_1);


var $col_1_row_1 = $("<div>");
$col_1.append($col_1_row_1);

var $searchLabel = $("<h5>");
$searchLabel.text("Search for a City:");
$col_1_row_1.append($searchLabel);

var $divSearchContainer = $("<div>");
var $inputBox = $("<input>");
$inputBox.attr("id","inputBoxId");
$divSearchContainer.append($inputBox);

var $searchButton = $("<div>");
$searchButton.addClass("fas fa-search btn-lg btn-primary startSearching");
$divSearchContainer.append($searchButton);

$col_1_row_1.append($divSearchContainer);


//city list goes here
var $col_1_row_2 = $("<div>");
$col_1_row_2.addClass("border borderColor mt-3 bg-white");
$col_1.append($col_1_row_2);





var $col_2 = $("<div>"); 
$col_2.addClass("col-sm-9  border borderColor");
$row.append($col_2);

 var $col_2_row_1 = $("<div>");
 $col_2_row_1.addClass("border borderColor p-3 mt-3  shadow-lg");
 $col_2.append($col_2_row_1);
 var $header = $("<h5>");
 var $temperature1 = $("<p>");
 var $humidity1 = $("<p>");
 var $windspeed = $("<p>");
 var $uvindex = $("<p>");



 $col_2_row_1.append($header);

 $col_2_row_1.append($temperature1);


 $col_2_row_1.append($humidity1);


 $col_2_row_1.append($windspeed);


 $col_2_row_1.append($uvindex);
 var $uvindexSpan = $("<span>");
 $uvindex.text(`UV Index:`);
 $header.text('');
 $temperature1.text(`Temprature: `);
 $humidity1.text(`Humidity:`);
 $windspeed.text(`Wind Speed:`);
 $uvindexSpan.text('');

 $uvindexSpan.addClass("bg-danger p-1 ml-2 rounded text-white text-strong");
 $uvindex.append($uvindexSpan);


 var $col_2_row_2 = $("<div>");
 $col_2.append($col_2_row_2);













 var $foreCastLabel = $("<h5>");
 $foreCastLabel.addClass("mt-4")
$foreCastLabel.text("5-Day Forecast:");
$col_2_row_2.append($foreCastLabel);

var $foreCastBoxs = $("<div>");
$foreCastBoxs.addClass("row pl-2");
$col_2_row_2.append($foreCastBoxs);

var localStorageForecast = JSON.parse(localStorage.getItem("dailyForecast"));

for(let i = 0; i < 5; i++){
    var $foreCastSingleBox = $("<div>");
    $foreCastBoxs.append($foreCastSingleBox);
    $foreCastSingleBox.addClass("col-sm-2 foreCastBoxes m-2");
    var $date = $("<p>");
    var $temperature = $("<p>");
    var $humidity = $("<p>");
 
   
    humidity = localStorageForecast[0].humidity;
    console.log("localStorageForecast top = "+localStorageForecast[0].temp);
    $foreCastSingleBox.append($date);
    $date.text("8/15/2022");
    $foreCastSingleBox.append($temperature);
    $temperature.text(`Temprature: ${temp}`);

    $foreCastSingleBox.append($humidity);
    $humidity.text(`Humidity: ${humidity}%`);
}

var apikey = "f9671ca41d5667371da2cc4e58a42211";
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=f9671ca41d5667371da2cc4e58a42211
 //var endpoint = "https://api.openweathermap.org/data/2.5/weather?q=";
var endpoint = "https://api.openweathermap.org/data/2.5/forecast?q=";

//add event listner to the search box
$(".startSearching").click(function(event){
var searchParam = $("#inputBoxId").val().trim();
console.log("I am clicked "+ searchParam);

//event listner to get data for user
var weatherAPIUrl =`${endpoint}${searchParam}&APPID=${apikey}`;

$.ajax({
    url: weatherAPIUrl,
    method: "GET",
}).then(function(response){
console.log("current weather = "+response);
var climateRecord = response.list;
var locationRecord = response.city;
console.log(`Temprature: ${climateRecord[0].main.temp}`);
$header.text(`${locationRecord.name}, ${locationRecord.country}`);
$temperature1.text(`Temprature: ${climateRecord[0].main.temp}°F`);
$humidity1.text(`Humidity: ${climateRecord[0].main.humidity}%`);
$windspeed.text(`Wind Speed: ${climateRecord[0].wind.speed}MPH`);
$uvindexSpan.text('9.49');
var dailyForecast =[];
var count = 0;
var temperature=0;
var humidity=0;
var windspeed=0;
var uvindec=0;
//calculate average weather for each day from the 8 data points divided in 3hr interval
for(let i = 0; i < climateRecord.length; i++){
if(count < 8){
    temperature += climateRecord[i].main.temp;
    humidity += climateRecord[i].main.humidity;
    windspeed += climateRecord[i].wind.speed;
    uvindec = 9.99;
    count++;
    console.log("count= "+count);
}else
if(count===8){
    dailyForecast.push({
        "temp" :(temperature/count).toFixed(2),
        "humidity" : (humidity/count).toFixed(2),
        "windspeed" : (windspeed/count).toFixed(2),
        "uvindec" : uvindec,
        "city": locationRecord.name,
        "country": locationRecord.country,
    });

 temperature=0;
 humidity=0;
 windspeed=0;
 uvindec=0;
 count = 0;
 i--;
}

}
console.log("forecast = "+JSON.stringify(dailyForecast));
localStorage.setItem("dailyForecast", JSON.stringify(dailyForecast));
for(var i=0; i<dailyForecast.length; i++){
    var cityList = $("<h5>");
    cityList.addClass("border borderColor p-2 m-0 text-center")
    cityList.text(dailyForecast[i].city);
    $col_1_row_2.append(cityList)
}
})

})


// //geolocation
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(displayLocationInfo);
//   }
  
//   function displayLocationInfo(position) {
//     const lng = position.coords.longitude;
//     const lat = position.coords.latitude;
  
//     console.log(`longitude: ${ lng } | latitude: ${ lat }`);
//   }