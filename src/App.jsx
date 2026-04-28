import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import IndoorHistory from "./pages/IndoorHistory";
import OutdoorHistory from "./pages/OutdoorHistory";
import Forecast from "./pages/Forecast";
import About from "./pages/About";
import "./App.css";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

// App component manages routing, user authentication state, and global UI elements like dark mode and current date/time display
function App() {
  const [darkMode, setDarkMode] = useState(false); // State to track whether dark mode is enabled
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // State to track the current date and time for display in the sidebar

  // Function to toggle between dark mode and light mode, updates the darkMode state which triggers a re-render with the appropriate CSS class
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))); // State to track the currently logged-in user, initialized from localStorage to persist login across page refreshes

  // useEffect hook to set up an interval that updates the currentDateTime state every second, ensuring the displayed date and time in the sidebar is always current  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to handle user logout, clears user data from localStorage and resets the user state to null, which will trigger the app to show the login/register routes instead of the main app content
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedCity");
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <Router>
          <Routes>
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/" element={<Login setUser={setUser} />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <div className={`app ${darkMode ? "dark-mode" : ""}`}>
            {/* Sidebar */}
            <nav className="sidebar">
              <h1>ENVIROMonitor 1000</h1>
              <hr style={{ width: "100%" }} />
              {user && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    margin: "5px 0 10px 0",
                  }}
                >
                  👤 Logged in as: <strong>{user.username}</strong>
                </p>
              )}
              <p
                style={{
                  fontSize: "12px",
                  color: darkMode ? "#c4cbf5" : "#4b578c",
                  margin: "0 0 12px 0",
                  lineHeight: 1.4,
                }}
              >
                {currentDateTime.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <br />
                {currentDateTime.toLocaleTimeString()}
              </p>
              <Link to="/">Home</Link>
              <Link to="/indoor">Indoor History</Link>
              <Link to="/outdoor">Outdoor History</Link>
              <Link to="/forecast">Forecast</Link>
              <Link to="/about">About</Link>

              <div className="sidebar-actions">
                <button className="toggle-button" onClick={toggleDarkMode}>
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </nav>

            {/* Main Content */}
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/indoor" element={<IndoorHistory />} />
                <Route path="/outdoor" element={<OutdoorHistory />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
