import { useState } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

    if (!res.ok) {
      alert("Invalid username or password");
      return;
    }

    const data = await res.json();

    const startingLocation = data?.startingLocation?.trim();
    if (startingLocation) {
      localStorage.setItem("selectedCity", startingLocation);
    }

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
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
