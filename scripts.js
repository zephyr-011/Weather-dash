const apiKey = 'API';

// Main event listener
document.getElementById('getWeatherBtn').addEventListener('click', fetchWeather);
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') fetchWeather();
});

// Fetch Weather
async function fetchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert('Please enter a city name!');
        return;
    }

    try {
        const [currentData, forecastData] = await Promise.all([
            fetchCurrentWeather(city),
            fetchWeatherForecast(city)
        ]);

        updateCurrentWeather(currentData);
        updateForecast(forecastData);

    } catch (error) {
        console.error(error);
        alert('City not found or network error!');
    }
}

// Fetch Current Weather
async function fetchCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch current weather');
    return response.json();
}

// Fetch 5 Days Forecast
async function fetchWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch forecast');
    return response.json();
}

// Update Current Weather in UI
function updateCurrentWeather(data) {
    document.getElementById('cityName').innerText = data.name;
    document.getElementById('currentDate').innerText = new Date().toISOString().split('T')[0];
    document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weatherDescription').innerText = capitalizeFirstLetter(data.weather[0].description);
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById('pressure').innerText = `${data.main.pressure} M/B`;
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('windSpeed').innerText = `${data.wind.speed} M/S`;
}

// Update Forecast in UI
function updateForecast(data) {
    const forecastEl = document.getElementById('forecast');
    forecastEl.innerHTML = '';

    const dailyForecast = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = item;
        }
    });

    const upcomingDays = Object.keys(dailyForecast).slice(1, 6);

    upcomingDays.forEach(date => {
        const weather = dailyForecast[date];
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h4>${date}</h4>
            <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="Weather Icon" width="50">
            <p>${Math.round(weather.main.temp)}°C</p>
        `;
        forecastEl.appendChild(card);
    });
}

// Utility - Capitalize First Letter
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

