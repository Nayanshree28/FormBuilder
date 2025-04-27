import React, { useState } from "react";
import { toast } from "react-toastify"; // Import toast
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import frame from "../assets/Frame.png";
import showpassword from "../assets/show-password.png"; 
import hidepassword from "../assets/hide-password.png"; 
import lock from "../assets/lock.png";
import logout from "../assets/Logout.png";
const API_URL = "https://form-bot-6.onrender.com";

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showEmail, setShowEmail] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Check if token is present in localStorage
      if (!token) {
        setError("You must be logged in to update your profile.");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in header
        },
        body: JSON.stringify({ name, email, oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!"); // Display success toast
      } else {
        setError(data.message || "Failed to update profile.");
        toast.error(data.message || "Failed to update profile."); // Display error toast
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again."); // Display error toast
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      {error && <p className="error">{error}</p>}
      <form className="settings-form" onSubmit={handleUpdate}>
        <div className="form-group">
          <img src={frame} alt="frame" className="frame" />
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <img src={lock} alt="lock" className="lock" />
          <input type={showEmail ? "text" : "password"} placeholder="Update Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <img src={showEmail ? showpassword : hidepassword} alt="toggle visibility" className="eye" onClick={() => setShowEmail(!showEmail)} />
        </div>

        <div className="form-group">
          <img src={lock} alt="lock" className="lock" />
          <input type={showOldPassword ? "text" : "password"} placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <img src={showOldPassword ? showpassword : hidepassword} alt="toggle visibility" className="eye" onClick={() => setShowOldPassword(!showOldPassword)} />
        </div>

        <div className="form-group">
          <img src={lock} alt="lock" className="lock" />
          <input type={showNewPassword ? "text" : "password"} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <img src={showNewPassword ? showpassword : hidepassword} alt="toggle visibility" className="eye" onClick={() => setShowNewPassword(!showNewPassword)} />
        </div>

        <button type="submit" className="update-button">Update</button>
      </form>

      <button className="logout-button" onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
      }}>
        <img src={logout} alt="logout" />
        Log out
      </button>
    </div>
  );
};

export default Settings;
