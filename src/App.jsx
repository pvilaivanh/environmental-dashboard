import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import IndoorHistory from "./pages/IndoorHistory";
import OutdoorHistory from "./pages/OutdoorHistory";
import Forecast from "./pages/Forecast";
import About from "./pages/About";
import "./App.css";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <>
      {!user ? (
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login setUser={setUser} />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <div className={`app ${darkMode ? "dark-mode" : ""}`}>
            
            {/* Sidebar */}
            <nav className="sidebar">
              <h1>ENVIROMonitor 1000</h1>
              <hr style={{ width: "100%" }}/>
              <Link to="/">Home</Link>
              <Link to="/indoor">Indoor</Link>
              <Link to="/outdoor">Outdoor</Link>
              <Link to="/forecast">Forecast</Link>
              <Link to="/about">About</Link>

              <button className="toggle-button" onClick={toggleDarkMode}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>

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