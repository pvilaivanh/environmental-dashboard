import { useEffect, useState } from "react";
import "./Pages.css";

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Get API key from environment variable

// Forecast component displays detailed weather forecast for a city with search functionality
function Forecast() {
  const [weather, setWeather] = useState(null); // Weather data from OpenWeatherMap
  const storedUser = JSON.parse(localStorage.getItem("user") || "null"); // Get user data from localStorage to determine preferred city and starting location
  const preferredCity = localStorage.getItem("selectedCity"); // Get preferred city from localStorage, which may have been set during login or registration
  const startingLocation = storedUser?.startingLocation?.trim(); // Get starting location from user data, trim whitespace to ensure clean city name
  const initialCity = preferredCity || startingLocation || "Elizabethton"; // Determine initial city for weather data, prioritizing preferred city, then starting location, and defaulting to "Elizabethton" if neither is available
  const [city, setCity] = useState(initialCity); // City for weather data, initialized to the determined initial city
  const [inputCity, setInputCity] = useState(initialCity); // Controlled input for city search, initialized to the same initial city for consistency

  // Fetch weather data when city changes, ensuring the displayed forecast is always up to date with the selected city
  useEffect(() => {
    fetchWeatherByCity(city);
  }, [city]);

  // If there is no preferred city in localStorage but there is a starting location in the user data, set the starting location as the preferred city in localStorage. This ensures that the app will use the user's starting location for weather data if they haven't explicitly set a preferred city.
  useEffect(() => {
    if (!preferredCity && startingLocation) {
      localStorage.setItem("selectedCity", startingLocation);
    }
  }, [preferredCity, startingLocation]);

  // Function to fetch weather data from OpenWeatherMap API based on the provided city name, updates the weather state with the fetched data
  const fetchWeatherByCity = (cityName) => {
    if (!WEATHER_API_KEY || !cityName) {
      console.error("Missing VITE_OPENWEATHER_API_KEY environment variable.");
      return;
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${WEATHER_API_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("Weather fetch error:", err));
  };

  // Handle city search form submission, updates the city state and localStorage with the new city, which triggers a re-fetch of weather data for the new city
  const handleCityChange = (e) => {
    e.preventDefault();
    const nextCity = inputCity.trim();
    if (!nextCity) return;

    setCity(nextCity);
    setInputCity(nextCity);
    localStorage.setItem("selectedCity", nextCity);
  };

  // Function to provide clothing and activity suggestions based on the current temperature, returns a string suggestion that can be displayed in the UI
  function getSuggestion(temp) {
    if (temp < 32) return "Freezing! Wear heavy winter coat, gloves, and hat.";
    if (temp < 50) return "Cold. Consider wearing a jacket and long sleeves.";
    if (temp < 60) return "Chilly. A hoodie or light jacket recommended.";
    if (temp < 70) return "Cool. Long sleeves or a light layer suggested.";
    if (temp < 80) return "Pleasant! T-shirt weather.";
    if (temp < 85) return "Warm. Light, breathable clothing recommended.";
    if (temp < 95) return "Hot! Stay hydrated and wear light clothing.";
    return "Very hot! Seek shade and drink plenty of water.";
  }

  // If weather data is not yet available (e.g., still loading), display a loading message to the user
  if (!weather) {
    return (
      <div className="page-content forecast-page">
        <div className="forecast-loading">Loading forecast...</div>
      </div>
    );
  }

  return (
    <div className="page-content forecast-page">
      <div className="forecast-search-wrap">
        <form onSubmit={handleCityChange} className="forecast-search-form">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter city name"
            className="forecast-search-input"
          />
          <button type="submit" className="forecast-search-btn">
            Search
          </button>
        </form>
      </div>

      <div className="forecast-container">
        <div className="forecast-top-row">
          <div>
            <p className="forecast-kicker">Current Conditions</p>
            <h1 className="forecast-heading">Today's Forecast</h1>
            <h2 className="forecast-location">{weather.name}</h2>
          </div>

          <div className="weather-icon">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          </div>
        </div>

        <div className="forecast-summary-row">
          <h1 className="forecast-main-temp">
            {Math.round(weather.main.temp)}°F
          </h1>
          <p className="description">{weather.weather[0].description}</p>
        </div>

        <div className="forecast-chips">
          <div className="forecast-chip">
            <span>High</span>
            <strong>{Math.round(weather.main.temp_max)}°F</strong>
          </div>
          <div className="forecast-chip">
            <span>Low</span>
            <strong>{Math.round(weather.main.temp_min)}°F</strong>
          </div>
          <div className="forecast-chip">
            <span>Feels Like</span>
            <strong>{Math.round(weather.main.feels_like)}°F</strong>
          </div>
          <div className="forecast-chip">
            <span>Humidity</span>
            <strong>{weather.main.humidity}%</strong>
          </div>
        </div>

        <div className="forecast-info">
          <div className="forecast-chip forecast-panel">
            <h2>Suggestion</h2>
            <p>{getSuggestion(weather.main.temp)}</p>
          </div>

          <div className="forecast-chip forecast-panel">
            <h2>Wind Speed</h2>
            <p className="value">{Math.round(weather.wind.speed)} mph</p>
          </div>

          <div className="forecast-chip forecast-panel">
            <h2>Sunrise</h2>
            <p>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>

            <h2>Sunset</h2>
            <p>{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>

          <div className="forecast-chip forecast-panel">
            <h2>Precipitation</h2>
            <p>
              {weather.rain
                ? `Rain volume in last 1 hour: ${weather.rain["1h"]} mm`
                : "No precipitation in the last hour."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forecast;
