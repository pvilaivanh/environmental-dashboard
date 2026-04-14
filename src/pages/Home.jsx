import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Pages.css";
import Forecast from "./Forecast";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const preferredCity = localStorage.getItem("selectedCity");
  const startingLocation = storedUser?.startingLocation?.trim();
  const initialCity = preferredCity || startingLocation || "Elizabethton";

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

  const latest = data.length > 0 ? data[data.length - 1] : null;

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

  const [weather, setWeather] = useState(null);
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
            {latest && latest.Outdoor
              ? getSuggestion(latest.Outdoor.TemperatureF)
              : ""}
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
