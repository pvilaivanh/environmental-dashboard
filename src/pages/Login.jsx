import { useState } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

// Login component handles user authentication and sets the user state upon successful login
function Login({ setUser }) {
  const [username, setUsername] = useState(""); // Controlled input for username
  const [password, setPassword] = useState(""); // Controlled input for password (note: should be hashed in production) 

  // Function to handle login form submission, sends credentials to backend and updates user state on success
  const handleLogin = async () => {
    const res = await fetch("https://localhost:7220/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        passwordHash: password,
        firstName: "temp",
        middleInitial: "temp",
        lastName: "temp",
        address: "temp",
        startingLocation: "temp",
        theme: "light",
      }),
    });

    // If login fails, alert the user and exit the function
    if (!res.ok) {
      alert("Invalid username or password");
      return;
    }

    // On successful login, parse the response data, update localStorage and user state
    const data = await res.json();

    // If the user has a starting location and no preferred city is set, use the starting location as the preferred city
    const startingLocation = data?.startingLocation?.trim();
    if (startingLocation) {
      localStorage.setItem("selectedCity", startingLocation);
    }

    localStorage.setItem("user", JSON.stringify(data)); // Store user data in localStorage for persistence
    setUser(data); // Update the user state in the parent component to reflect the logged-in user
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2>Login</h2>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)} 
            value={username}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
          />
        </div>

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
export default Login;
