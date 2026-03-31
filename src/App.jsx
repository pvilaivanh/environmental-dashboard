import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import IndoorHistory from "./pages/IndoorHistory";
import OutdoorHistory from "./pages/OutdoorHistory";
import Forecast from "./pages/Forecast";
import About from "./pages/About";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        
        {/* Sidebar */}
        <nav className="sidebar">
          <h1>Environmental Dashboard</h1>
          <hr style={{ width: "100%" }}/>
          <Link to="/">Home</Link>
          <Link to="/indoor">Indoor</Link>
          <Link to="/outdoor">Outdoor</Link>
          <Link to="/forecast">Forecast</Link>
          <Link to="/about">About</Link>

          <button className="toggle-button" style={{ marginTop: "420px" }}>Mode</button>
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
  );
}

export default App;