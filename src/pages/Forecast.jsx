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
      <h1>Today's Forecast</h1>

      <h2>{weather.name}</h2>
      <p>{weather.weather[0].description}</p>

      <h1>{Math.round(weather.main.temp)}°F</h1>

      <p>Feels like: {Math.round(weather.main.feels_like)}°F</p>
      <p>Humidity: {weather.main.humidity}%</p>
    </div>
  );
}

export default Forecast;