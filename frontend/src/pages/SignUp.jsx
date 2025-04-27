import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import sidetriangle from "../assets/Group 2.png";
import sidesemicircle from "../assets/Ellipse 2.png";
import bottomcircle from "../assets/Ellipse 1.png";
import googleIcon from "../assets/Google Icon.png";
import arrowBackIcon from "../assets/arrow_back.png";

const API_URL = "https://formbuilder-coyl.onrender.com";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("https://formbuilder-coyl.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to register");
        return;
      }
  
      const data = await response.json();
  
      // Store JWT token in localStorage
      localStorage.setItem("token", data.token);
  
      // Optionally, redirect to login
      navigate("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="signup-page">
      <img
        src={arrowBackIcon}
        alt="Back"
        className="arrow-back"
        onClick={() => navigate("/")}
      />

      <div className="signup-container">
        <img
          src={sidetriangle}
          alt="Decorative Triangle"
          className="decorative-triangle"
        />
        <img
          src={sidesemicircle}
          alt="Decorative Semicircle"
          className="side-circle"
        />
        <img
          src={bottomcircle}
          alt="Decorative Circle"
          className="bottom-circle"
        />

        <form className="signup-form" onSubmit={handleSubmit}>
          <p>Username</p>
          <input
            type="text"
            placeholder="Enter a username"
            className="form-input"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <p>Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p>Password</p>
          <input
            type="password"
            placeholder="***********"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p
            className={`confirm-password-label ${error ? "error-text" : ""}`}
          >
            Confirm Password
          </p>
          <input
            type="password"
            placeholder="***********"
            className={`form-input ${error ? "error-border" : ""}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="form-button">
            Sign Up
          </button>
        </form>

        <div className="or">OR</div>

        <button className="google-button">
          <img src={googleIcon} alt="Google Icon" className="google-icon" />
          Sign Up with Google
        </button>

        <p className="form-footer">
          Already have an account?{" "}
          <a href="/login" sr className="form-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
