import React, { useState, useEffect } from 'react';
import close from "../assets/close.png";
import { useNavigate } from "react-router-dom";
import calendar from "../assets/calendar.png";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

import "./ResponsePage.css";


// Register the necessary chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title,);

const ResponsePage = () => {
  const [activeTab, setActiveTab] = useState("Response"); // Tab state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    // Check if there is a saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
  
    // Set theme based on saved value or default to dark
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      localStorage.setItem("theme", "dark"); // Default to dark mode if no theme saved
    }
  
    // Apply the theme immediately by updating body class
    document.body.className = isDarkMode ? 'dark' : 'light';
  
  }, [isDarkMode]); // Re-run when isDarkMode changes
  

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
  
    // Apply the theme class to the body element
    document.body.classList.remove(isDarkMode ? "dark" : "light");
    document.body.classList.add(newTheme);
  };
  
  const chartData = {
    labels: ["Complete", "Incomplete"],
    datasets: [
      {
        data: [33, 67],
        backgroundColor: ["#3B82F6", "#909090"], // Blue and Grey colors
        hoverBackgroundColor: ["#3B82F6", "#909090"], // Blue and Grey on hover
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Tooltip format to show percentage on hover
          },
        },
      },
      legend: {
        display: false, // Hide the legend above the chart
      },
    },
    cutout: 90, // Inner radius for donut style chart (0-100)
  };
return (
    <div className={`response-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* navbar */}
     <header className="workspace-header">
       
        <div className="nav-btn-res">
      <button
        onClick={() => {
          navigate(-1); // Navigate to the previous page
        }}
      >
        Flow
      </button>
           <div className="response">
          <button  >Response</button>
          </div>
        </div>
        <div className="nav-toogle">
          <span className="light-text">Light</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
          <span className={`mode-text ${isDarkMode ? "dark" : "light"}`}>
            <span className="dark-text">Dark</span>
          </span>
        </div>
        <div className="header-controls">
          <button  className="share">Share</button>
          
          <button className="save">Save</button>
          <button className="close"><img src={close} alt="" /></button>
        </div>
      </header>
      {/* Main Content */}
      <main className="response-main">
        {/* Stats Section */}
        <div className="stats-container">
          <div className="stat-box">
            <p>Views</p>
            <h3>6</h3>
          </div>
          <div className="stat-box">
            <p>Starts</p>
            <h3>100</h3>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container">
          <table className="response-table">
            <thead>
              <tr>
                <th></th>
                <th>
                   <div className="flex-align">
                   <img src={calendar} alt="" className="calendar" /> Submitted at</div>
                 </th>
                <th>Button 1</th>
                <th>Email 1</th>
                <th>Text 1</th>
                <th>Button 2</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
      {[
        {
          submittedAt: "Jul 17, 02:23 PM",
          button1: "Hi",
          email: "abc@gmail.com",
          text: "alpha",
          description: "Studio App to Manage Clients, Tracking App for Clients",
          rating: "5",
        },
        {
          submittedAt: "Jul 17, 02:48 PM",
          button1: "Hi",
          email: "---",
          text: "---",
          description: "---",
          rating: "---",
        },
        {
          submittedAt: "Jul 14, 04:25 PM",
          button1: "Hi",
          email: "---",
          text: "---",
          description: "---",
          rating: "---",
        },
      ].map((row, index) => (
        <tr key={index}>
          <td>{index + 1}</td> {/* Line number */}
          <td>{row.submittedAt}</td>
          <td>{row.button1}</td>
          <td>{row.email}</td>
          <td>{row.text}</td>
          <td>{row.description}</td>
          <td>{row.rating}</td>
        </tr>
      ))}
    </tbody>
          </table>
        </div>

        {/* Chart Section */}
        <div className="chart-container">
        <Pie data={chartData} options={options} />
                      </div>
      </main>
    </div>
  );
};

export default ResponsePage;
