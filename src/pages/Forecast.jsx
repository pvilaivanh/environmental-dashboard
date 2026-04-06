import { useEffect, useState } from "react";

function Forecast() {
  const [weather, setWeather] = useState(null);

  const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
  const CITY = "CITY_NAME";

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=imperial&appid=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error(err));
  }, []);

  if (!weather) {
    return <p style={{ padding: "20px" }}>Loading forecast...</p>;
  }

  return (
    <div className="page-content">
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

      <div className="forecast-info">
          <div className="info-box">
          <h2>Suggestion</h2>
          <p>
            {weather.main.temp < 60
              ? "It's a bit chilly outside. Consider wearing a jacket!"
              : weather.main.temp > 85
              ? "It's quite hot outside. Stay hydrated and consider wearing light clothing!"
              : "The weather looks pleasant. Enjoy your day!"}
          </p>
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
            The sunrise is at {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}.
          </p>

          <h2>Sunset</h2>
          <p>
            The sunset is at {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}.
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