import { useEffect, useState } from "react";

function Forecast() {
  const [weather, setWeather] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const preferredCity = localStorage.getItem("selectedCity");
  const startingLocation = storedUser?.startingLocation?.trim();
  const initialCity = preferredCity || startingLocation || "Elizabethton";
  const [city, setCity] = useState(initialCity);
  const [inputCity, setInputCity] = useState(initialCity);

  const API_KEY = "f7624dc4094ebbb713cf0d427bb80089";

  useEffect(() => {
    fetchWeatherByCity(city);
  }, [city]);

  useEffect(() => {
    if (!preferredCity && startingLocation) {
      localStorage.setItem("selectedCity", startingLocation);
    }
  }, [preferredCity, startingLocation]);

  const fetchWeatherByCity = (cityName) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("Weather fetch error:", err));
  };

  const handleCityChange = (e) => {
    e.preventDefault();
    const nextCity = inputCity.trim();
    if (!nextCity) return;

    setCity(nextCity);
    setInputCity(nextCity);
    localStorage.setItem("selectedCity", nextCity);
  };

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

  if (!weather) {
    return <p style={{ padding: "20px" }}>Loading forecast...</p>;
  }

  return (
    <div className="page-content">
      <div style={{ padding: "15px", marginBottom: "15px" }}>
        <form
          onSubmit={handleCityChange}
          style={{ display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter city name"
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "2px solid #667eea",
              fontSize: "14px",
              flex: 1,
              maxWidth: "300px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Search
          </button>
        </form>
      </div>

      <div className="forecast-container">
        <h1>Today's Forecast</h1>

        <h2>{weather.name}</h2>

        <h1 className="temp">{Math.round(weather.main.temp)}°F</h1>

        <div className="weather-icon">
          {/* weather icon */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
          <p className="description">{weather.weather[0].description}</p>
        </div>

        <div className="min-max">
          <p>H: {Math.round(weather.main.temp_max)}°F</p>
          <p>L: {Math.round(weather.main.temp_min)}°F</p>
        </div>

        <div className="details">
          <p>Feels like: {Math.round(weather.main.feels_like)}°F</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      </div>

      {/* Suggestions based on weather */}
      <div className="forecast-info">
        <div className="info-box">
          <h2>Suggestion</h2>
          <p>{getSuggestion(weather.main.temp)}</p>
        </div>

        {/* Wind Speed */}
        <div className="info-box">
          <h2>Wind Speed</h2>
          <p className="value">
            {/* Placeholder for wind speed suggestion */}
            {Math.round(weather.wind.speed)} mph.
          </p>
        </div>

        {/* Sunrise/Sunset */}
        <div className="info-box">
          <h2>Sunrise</h2>
          <p>
            The sunrise is at{" "}
            {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}.
          </p>

          <h2>Sunset</h2>
          <p>
            The sunset is at{" "}
            {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}.
          </p>
        </div>

        {/* Precipitation in inches */}
        <div className="info-box">
          <h2>Precipitation</h2>
          <p>
            {weather.rain
              ? `Rain volume in last 1 hour: ${weather.rain["1h"]} mm`
              : "No precipitation in the last hour."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Forecast;
