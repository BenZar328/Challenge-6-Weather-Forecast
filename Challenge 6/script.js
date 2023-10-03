const apiKey = e2ebae6e449f1c4b0f835ffbf3a3456f
const apiUrl = "https://api.openweathermap.org/data/2.5/";

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const dateElement = document.getElementById("date");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const forecastContainer = document.getElementById("forecast-container");
const historyList = document.getElementById("history-list");

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        cityInput.value = "";
    }
});

function getWeatherData(city) {
    const currentWeatherUrl = `${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `${apiUrl}forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date(data.dt * 1000);
            cityName.textContent = data.name;
            dateElement.textContent = currentDate.toLocaleDateString();
            weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            temperature.textContent = data.main.temp;
            humidity.textContent = data.main.humidity;
            windSpeed.textContent = data.wind.speed;
            saveToSearchHistory(data.name);
        })
        .catch(error => {
            console.error("Error fetching current weather data:", error);
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            forecastContainer.innerHTML = "";

            dailyForecasts.forEach(forecast => {
                const forecastDate = new Date(forecast.dt * 1000);
                const card = document.createElement("div");
                card.classList.add("forecast-card");
                card.innerHTML = `
                    <p>${forecastDate.toLocaleDateString()}</p>
                    <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
                    <p>Temp: ${forecast.main.temp}&#8451;</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind: ${forecast.wind.speed} m/s</p>
                `;
                forecastContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
        });
}

function saveToSearchHistory(city) {
    const historyItem = document.createElement("li");
    historyItem.textContent = city;
    historyList.appendChild(historyItem);
    historyItem.addEventListener("click", function () {
        getWeatherData(city);
    });
}
