// Create constants
const searchButtonEl = document.getElementById("search-button");
const cityNameEl = document.getElementById("city-name");
const cityEntryEl = document.getElementById("city-entry");
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const historyEl = document.getElementById("history");
const currentWindEl = document.getElementById("wind-speed");
const currentUVEl = document.getElementById("UV-index");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// API Info 
const APIKey = "b842b435591c968a7fcf07de7e4f3de5";


// Button Click, read form
function getWeather(cityName) {
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    fetch(weatherURL, {method: "GET"})
    .then(response => response.json())
        
        .then(function(response) {

            // current date
            let currentDate = new Date(response.dt*1000);
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            cityNameEl.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherImg = response.weather[0].icon;
            //currentImgEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherImg + "@2x.png");
            //currentImgEl.setAttribute("alt",response.weather[0].description);
            currentTempEl.innerHTML = "Temperature: " + k2f(response.main.temp) + " &#176F";
            currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";

            let lat = response.coord.lat;
            let lon = response.coord.lon;

            let UVWeatherURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            fetch(UVWeatherURL, {method: "GET"})
            .then(response => response.json())
                .then(function(response) {
                let UVIndex = document.createElement("span");
                UVIndex.setAttribute("class","badge badge-danger");
                UVIndex.innerHTML = response[0].value;
                currentUVEl.innerHTML = "UV Index: ";
                currentUVEl.append(UVIndex);
                });
        

// Locate City Name, API -> use it to request from open weather api
let cityID = response.id;
let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
fetch(forecastURL, {method: "GET"})
.then(response => response.json())
    .then(function(response) {

    //  display forecast for next 5 days underneath current conditions
    let forecastEl = document.querySelectorAll(".forecast");
    for (i=0; i<forecastEl.length; i++) {
        forecastEl[i].innerHTML = "";
        let forecastIndex = i*8 + 4;
        let forecastDate = new Date(response.list[forecastIndex].dt * 1000);
        let forecastDay = forecastDate.getDate();
        let forecastMonth = forecastDate.getMonth() + 1;
        let forecastYear = forecastDate.getFullYear();
        let forecastDateEl = document.createElement("p");
        forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastEl[i].append(forecastDateEl);
        let imageEl = document.createElement("img");
        imageEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png");
        imageEl.setAttribute("alt",response.list[0].weather[0].description);
        forecastEl[i].append(imageEl);
        let forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = "Temp: " + k2f(response.list[i].main.temp) + " &#176F";
        forecastEl[i].append(forecastTempEl);
        let forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + response.list[i].main.humidity + "%";
        forecastEl[i].append(forecastHumidityEl);
    }
})
})
}

// Local Storage, save city


// Event Listeners/Search History under nav

searchButtonEl.addEventListener("click",function() {
    let searchTerm = cityEntryEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search",JSON.stringify(searchHistory));
    checkStorage();
    getSearchHistory();
})

// create function here for math floor
function k2f(K) {
    return Math.floor((K - 273.15) *1.8 +32);
}

// Create Search History, button?

function getSearchHistory() {
    historyEl.innerHTML = "";
    for (let i=0; i<searchHistory.length; i++) {
        let historyItem = document.createElement("input");
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click",function() {
            getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }
}



// conditions

getSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}


// Local Storage section

function checkStorage() {
    if(localStorage.getItem('search') === null) {
        document.querySelector('.col-8').style.display = "none";
    } else {
        document.querySelector('.col-8').style.display = 'block';
    }
}

// check storage
checkStorage();