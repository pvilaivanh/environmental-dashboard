import { useState } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

// Register component handles user registration and sets the user state upon successful account creation
function Register({ setUser }) {
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

  // Function to handle changes in the registration form inputs, updates the form state accordingly
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle registration form submission, sends user data to backend and updates user state on success
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

    // If registration fails, alert the user and exit the function
    if (!res.ok) {
      alert("Registration failed");
      return;
    }

    // On successful registration, parse the response data, update localStorage and user state
    const startingLocation = form.startingLocation.trim();

    // If the user has a starting location, set it as the preferred city in localStorage
    if (startingLocation) {
      localStorage.setItem("selectedCity", startingLocation);
    }

    // Attempt to parse the registered user data from the response, handle any parsing errors gracefully
    let registeredUser = null;
    try {
      registeredUser = await res.json();
    } catch {
      registeredUser = null;
    }

    // If the registered user data contains a username and the setUser function is available, update localStorage and user state to log in the new user immediately after registration
    if (registeredUser?.username && setUser) {
      localStorage.setItem("user", JSON.stringify(registeredUser));
      setUser(registeredUser);
      return;
    }

    // If registration was successful but the response did not contain valid user data, alert the user that the account was created and they can now log in
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
