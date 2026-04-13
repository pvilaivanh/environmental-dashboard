import { useState } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    address: "",
    password: "",
    startingLocation: "",
    theme: "light",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    const res = await fetch("https://localhost:7220/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        firstName: form.firstName,
        middleInitial: form.middleInitial,
        lastName: form.lastName,
        address: form.address,
        passwordHash: form.password,
        startingLocation: form.startingLocation,
        theme: form.theme,
      }),
    });

    if (!res.ok) {
      alert("Registration failed");
      return;
    }

    alert("Account created! You can now log in.");
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <h2>Register</h2>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            placeholder="Choose a username"
            onChange={handleChange}
            value={form.username}
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            placeholder="First name"
            onChange={handleChange}
            value={form.firstName}
          />
        </div>

        <div className="form-group">
          <label htmlFor="middleInitial">Middle Initial</label>
          <input
            id="middleInitial"
            name="middleInitial"
            placeholder="Middle initial"
            onChange={handleChange}
            value={form.middleInitial}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            placeholder="Last name"
            onChange={handleChange}
            value={form.lastName}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            placeholder="Your address"
            onChange={handleChange}
            value={form.address}
          />
        </div>

        <div className="form-group">
          <label htmlFor="startingLocation">Starting Location</label>
          <input
            id="startingLocation"
            name="startingLocation"
            placeholder="Starting location"
            onChange={handleChange}
            value={form.startingLocation}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            onChange={handleChange}
            value={form.password}
          />
        </div>

        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
