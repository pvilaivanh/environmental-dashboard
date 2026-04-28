import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Pages.css";
import Forecast from "./Forecast";

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Get API key from environment variable

// Home component displays latest indoor/outdoor temps, forecast, and navigation cards
function Home() {
  const navigate = useNavigate(); // For programmatic navigation
  const [data, setData] = useState([]); // Indoor/outdoor reports from backend
  const storedUser = JSON.parse(localStorage.getItem("user") || "null"); // Get user data from localStorage
  const preferredCity = localStorage.getItem("selectedCity"); // Get preferred city from localStorage
  const startingLocation = storedUser?.startingLocation?.trim(); // Get starting location from user data  
  const initialCity = preferredCity || startingLocation || "Elizabethton"; // Determine initial city for weather data

  // Fetch indoor/outdoor data every 5 seconds
  useEffect(() => {
    const fetchData = () => {
      fetch("https://localhost:7220/api/reports")
        .then((res) => {
          console.log("RESPONSE:", res);
          return res.json();
        })
        .then((data) => {
          console.log("DATA:", data);
          setData(data);
        })
        .catch((err) => console.log("ERROR:", err));
    };

    fetchData(); // run once immediately

    const interval = setInterval(fetchData, 5000); // 🔁 every 5 seconds

    return () => clearInterval(interval); // cleanup when leaving page
  }, []);

  // Get the latest report (last item in the array)
  const latest = data.length > 0 ? data[data.length - 1] : null;

  // Function to get clothing suggestion based on temperature
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

  const [weather, setWeather] = useState(null); // Weather data from OpenWeatherMap
  const [city, setCity] = useState(initialCity); // City for weather data
  const [inputCity, setInputCity] = useState(initialCity); // Controlled input for city search

  // Fetch weather data when city changes
  useEffect(() => {
    fetchWeatherByCity(city);
  }, [city]);

  // On initial load, if no preferred city but starting location exists, set it as preferred
  useEffect(() => {
    if (!preferredCity && startingLocation) {
      localStorage.setItem("selectedCity", startingLocation);
    }
  }, [preferredCity, startingLocation]);

  // Function to fetch weather data from OpenWeatherMap API
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

  // Handle city search form submission
  const handleCityChange = (e) => {
    e.preventDefault();
    const nextCity = inputCity.trim();
    if (!nextCity) return;

    setCity(nextCity);
    setInputCity(nextCity);
    localStorage.setItem("selectedCity", nextCity);
  };

  return (
    <>
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

      <div className="dashboard">
        {/* Indoor Temp */}
        <div className="display small indoor">
          <h3>Latest Indoor Temp</h3>
          <p className="home-temp">
            {latest && latest.Indoor
              ? `${Math.round(latest.Indoor.TemperatureF)}°F`
              : "Loading..."}
          </p>
        </div>

        {/* Outdoor Temp */}
        <div className="display small outdoor">
          <h3>Latest Outdoor Temp</h3>
          <p className="home-temp">
            {weather ? `${Math.round(weather.main.temp)}°F` : "Loading..."}
          </p>
        </div>

        {/* Forecast */}
        <div
          className="card large forecast"
          onClick={() => navigate("/forecast")}
        >
          <h2>Today's Forecast</h2>

          {weather && (
            <p style={{ fontSize: "25px", opacity: 0.8, margin: "5px 0" }}>
              📍 {weather.name || "Your Location"}
            </p>
          )}

          <p>{weather ? weather.weather[0].description : "Loading..."}</p>

          <p>
            {weather && weather.main ? getSuggestion(weather.main.temp) : ""}
          </p>
        </div>

        {/* Indoor History */}
        <div
          className="card large indoor-history"
          onClick={() => navigate("/indoor")}
        >
          <h2>Indoor History</h2>
        </div>

        {/* Outdoor History */}
        <div
          className="card large outdoor-history"
          onClick={() => navigate("/outdoor")}
        >
          <h2>Outdoor History</h2>
        </div>

        {/* About */}
        <div className="card large about" onClick={() => navigate("/about")}>
          <h2>About</h2>
        </div>
      </div>
    </>
  );
}

export default Home;
