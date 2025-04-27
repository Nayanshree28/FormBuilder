import React, { useState, useEffect } from "react";
import attherate from "../assets/@.png";
import date from "../assets/date.png";
import gif from "../assets/gif.png";
import hash from "../assets/hash.png";
import image from "../assets/images.png";
import phone from "../assets/phone.png";
import star from "../assets/star.png";
import text from "../assets/text.png";
import tick from "../assets/tick.png";
import video from "../assets/video.png";
import msg from "../assets/chat_bubble.png";
import deleteicon from "../assets/delete.png";
import blueFlag from "../assets/blue_flag.png";
import close from "../assets/close.png";
import flag from "../assets/flag.png";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Make sure this is imported
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import "./WorkSpace.css";
const API_URL = "https://formbuilder-coyl.onrender.com";

//Fallback storage utility
const storage = (() => {
  let isLocalStorageAvailable = true;

  try {
    localStorage.setItem("test", "value");
    localStorage.removeItem("test");
  } catch (err) {
    isLocalStorageAvailable = false;
    console.warn(
      "localStorage not accessible. Falling back to in-memory storage."
    );
  }

  const memoryStorage = new Map();

  return {
    setItem: (key, value) => {
      if (isLocalStorageAvailable) {
        localStorage.setItem(key, value);
      } else {
        memoryStorage.set(key, value);
      }
    },
    getItem: (key) => {
      if (isLocalStorageAvailable) {
        return localStorage.getItem(key);
      }
      return memoryStorage.get(key) || null;
    },
    removeItem: (key) => {
      if (isLocalStorageAvailable) {
        localStorage.removeItem(key);
      } else {
        memoryStorage.delete(key);
      }
    },
  };
})();

const WorkSpace = () => {
  const { state } = useLocation(); // Get the passed state
  const { fileId } = state || {}; // Destructure fileId from the passed state

  const [fileName, setFileName] = useState("");
  const [isSaved, setIsSaved] = useState(false); // Track if data is saved
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to false (light mode)
  const [shareMessage, setShareMessage] = useState(""); // Initialize shareMessage state
  const navigate = useNavigate();


  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Fetch user details
        const userResponse = await fetch(
          "https://formbuilder-coyl.onrender.com/api/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.ok) {
          const user = await userResponse.json();
          // Set user details (Example: setUsername(user.name))
        } else {
          toast.error("Failed to fetch user details.");
        }

        // Fetch containers and files (update this if necessary)
        const dataResponse = await fetch(`${API_URL}/api/auth/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (dataResponse.ok) {
          const data = await dataResponse.json();
          setContainers(data.containers || []); // Assuming 'containers' is part of the response
        } else {
          toast.error("Failed to fetch containers.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      }
    }
  };

  // Effect to load theme and containers based on fileId
  useEffect(() => {
    if (!fileId) {
      setContainers([]); // Reset containers if no fileId is available
      return;
    }

    // Set dark mode by default
    setIsDarkMode(true);

    // Load containers from localStorage if available
    const savedContainers = localStorage.getItem(`containers_${fileId}`);
    if (savedContainers) {
      setContainers(JSON.parse(savedContainers));
    }
  }, [fileId]); // This effect runs when fileId changes

  // Save containers to localStorage and backend
  const saveContainers = async () => {
    if (!fileId) {
      toast.error("Invalid file ID");
      return;
    }

    try {
      // Save containers to localStorage
      localStorage.setItem(`containers_${fileId}`, JSON.stringify(containers));

      // Also save containers to backend (if needed)
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/api/auth/files/${fileId}`,
        { containers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Containers saved successfully!");
      } else {
        toast.error("Failed to save containers.");
      }
    } catch (error) {
      toast.error("An error occurred while saving containers.");
    }
  };

  // Handle file name change
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  // Handle key press event (e.g., pressing Enter)
  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${API_URL}/api/auth/files/${fileId}`,
          { name: fileName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          toast.success(`File name updated to: ${fileName}`);
        } else {
          toast.error("Failed to update the file. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred while updating the file.");
      }
    }
  };

  // Handle name change (for file update)
  const handleNameChange = async () => {
    if (!fileName.trim()) {
      toast.error("File name is required!");
      return;
    }

    if (!fileId) {
      toast.error("Invalid fileId");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/auth/files/update`,
        { fileId, name: fileName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.file) {
        toast.success("File name updated successfully!");
      } else {
        toast.error("Failed to update file name.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the file name.");
    }
  };

  // Effect to handle theme loading
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");

    if (savedTheme) {
      document.body.classList.add(savedTheme);
    } else {
      document.body.classList.add("light");
    }

    // Fetch data
    fetchData();
  }, []);

  const saveFileName = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${API_URL}/api/auth/files/${fileId}`,
        { name: fileName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        ("File name saved successfully!");
      } else {
        alert("Failed to save file name.");
      }
    } catch (error) {
      alert("An error occurred while saving the file name.");
    }
  };

  const [containers, setContainers] = useState(() => {
    const savedContainers = localStorage.getItem(`containers_${fileId}`);
    return savedContainers ? JSON.parse(savedContainers) : []; // Return an empty array if no saved data
  });

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);

    // Apply the theme class to the body element
    document.body.classList.remove(isDarkMode ? "dark" : "light");
    document.body.classList.add(newTheme);
  };

  const handleClose = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  const handleButtonClick = (containerType) => {
    const newContainer = {
      id: Date.now(),
      type: containerType,
      value: "",
      isTouched: false,
    };
    setContainers((prev) => [...prev, newContainer]);
  };

  const handleInputChange = (id, e) => {
    // Update the value of the input field for the specific container
    const updatedContainers = containers.map((container) => {
      if (container.id === id) {
        return { ...container, value: e.target.value };
      }
      return container;
    });
    setContainers(updatedContainers);
  };

  const handleDelete = (id) => {
    // Filter out the container with the matching id
    const updatedContainers = containers.filter(
      (container) => container.id !== id
    );
    setContainers(updatedContainers); // Set the new array as the updated state
  };

  const handleNavigate = () => {
    navigate("/response");
  };

  const handleBlur = (id) => {
    setContainers((prev) =>
      prev.map((container) =>
        container.id === id ? { ...container, isTouched: true } : container
      )
    );
  };

  // Example function to handle button clicks in the toolbox
  const handleToolboxButtonClick = (container) => {
    setContainers((prevContainers) => [...prevContainers, container]);
  };

  const handleCopyLink = () => {
    const link = `${
      window.location.origin
    }/sharedPage?containers=${encodeURIComponent(JSON.stringify(containers))}`;
    navigator.clipboard.writeText(link); // Copy the link to clipboard
    setShareMessage("Link copied");
    setTimeout(() => setShareMessage(""), 2000); // Hide message after 3 seconds
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };
  return (
    <div
      className={`workspace-component ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <header className="workspace-header">
        <input
          type="text"
          value={fileName}
          onChange={handleFileNameChange}
          onKeyDown={handleKeyPress} // Listen for the Enter key
          placeholder="Enter file name"
          className="form-name"
        />
        
        <div className="nav-btn">
          <div className="flow-btn">
            <button>flow</button>
          </div>
          <button onClick={handleNavigate}>Response</button>
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
          <button onClick={handleCopyLink} className="share">
            Share
          </button>

          <button onClick={saveContainers} className="save">
            Save
          </button>
          <button onClick={handleClose} className="close">
            <img src={close} alt="" />
          </button>
        </div>
      </header>

      <main className="workspace-main">
        <aside className="toolbox">
          <div className="tool-section">
            <h3>Bubbles</h3>
            <div className="button-row">
              <button className="msg" onClick={() => handleButtonClick("text")}>
                <img src={msg} alt="" />
                Text
              </button>
              <button onClick={() => handleButtonClick("img")}>
                <img src={image} alt="" />
                Images
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => handleButtonClick("video")}>
                <img src={video} alt="" />
                Video
              </button>
              <button onClick={() => handleButtonClick("gif")}>
                <img src={gif} alt="" />
                GIF
              </button>
            </div>
          </div>
          <div className="tool-section">
            <h3>Inputs</h3>
            <div className="button-row">
              <button onClick={() => handleButtonClick("input-text")}>
                <img src={text} alt="" />
                Text
              </button>
              <button onClick={() => handleButtonClick("input-number")}>
                <img src={hash} alt="" />
                Number
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => handleButtonClick("input-email")}>
                <img src={attherate} alt="" />
                Email
              </button>
              <button onClick={() => handleButtonClick("input-phone")}>
                <img src={phone} alt="" />
                Phone
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => handleButtonClick("input-date")}>
                <img src={date} alt="" />
                Date
              </button>
              <button onClick={() => handleButtonClick("input-rating")}>
                <img src={star} alt="" />
                Rating
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => handleButtonClick("input-button")}>
                <img src={tick} alt="" />
                Buttons
              </button>
            </div>
          </div>
        </aside>
        <section className="canvas">
          <div className="start-node">
            <img
              src={isDarkMode ? flag : blueFlag} // Show blueFlag in light mode
              alt="flag"
              className="flag"
            />
            Start
          </div>

          {/* Show Share Message */}
          {shareMessage && (
            <div className="canvas-message">
              <p>{shareMessage}</p> {/* Display the share message */}
            </div>
          )}
          {/* Render all containers dynamically */}
          <div className="containers">
            {containers.map((container) => (
              <div key={container.id} className="container">
                {container.type === "text" && (
                  <div className="text-container">
                    <h1>Text</h1>

                    <div className="input-wrapper">
                      <span className="input-icon">
                        <img src={msg} alt="icon" />
                      </span>
                      <input
                        type="text"
                        value={container.value}
                        onChange={(e) => handleInputChange(container.id, e)}
                        onBlur={() => handleBlur(container.id)}
                        placeholder="Click here to edit"
                        className={`text-input ${
                          container.isTouched && !container.value
                            ? "input-error"
                            : ""
                        }`}
                      />
                      {container.isTouched && !container.value && (
                        <span className="error-message">Required Field</span>
                      )}
                    </div>
                  </div>
                )}
                {container.type === "img" && (
                  <div className="img-container">
                    <h1>Image 1 </h1>
                    <input
                      type="text"
                      value={container.value}
                      onChange={(e) => handleInputChange(container.id, e)}
                      placeholder="Click to add link"
                    />
                  </div>
                )}
                {container.type === "video" && (
                  <div className="video-container">
                    <h1>Video 1</h1>
                    <input
                      type="text"
                      value={container.value}
                      onChange={(e) => handleInputChange(container.id, e)}
                      placeholder="Click to add link"
                    />
                  </div>
                )}
                {container.type === "gif" && (
                  <div className="gif-container">
                    <h1>GIF 1</h1>
                    <input
                      type="text"
                      value={container.value}
                      onChange={(e) => handleInputChange(container.id, e)}
                      placeholder="Click to add link"
                    />
                  </div>
                )}
                {container.type === "input-text" && (
                  <div className="input-text-container">
                    <h1>Input Text 1</h1>
                    <p>Hint : User will input a text on his form</p>
                  </div>
                )}
                {container.type === "input-number" && (
                  <div className="input-number-container">
                    <h1>Input Number 1</h1>
                    <p>Hint : User will input a text on his form</p>
                  </div>
                )}
                {container.type === "input-email" && (
                  <div className="input-email-container">
                    <h1>Input Email 1</h1>
                    <p>Hint : User will input a email on his form</p>
                  </div>
                )}
                {container.type === "input-phone" && (
                  <div className="input-phone-container">
                    <h1>Input Phone 1</h1>
                    <p>Hint : User will input a phone on his form</p>
                  </div>
                )}
                {container.type === "input-date" && (
                  <div className="input-date-container">
                    <h1>Input Date 1</h1>
                    <p>Hint : User will select a date</p>
                  </div>
                )}
                {container.type === "input-rating" && (
                  <div className="input-rating-container">
                    <h1>Input Rating 1</h1>
                    <p>Hint : User will tap to rate out of 5</p>
                  </div>
                )}
                {container.type === "input-button" && (
                  <div className="input-button-container">
                    <h1>Input Button1</h1>
                    <input
                      type="text"
                      value={container.value}
                      onChange={(e) => handleInputChange(container.id, e)}
                    />
                  </div>
                )}
                <button
                  onClick={() => handleDelete(container.id)}
                  className="delete-button"
                >
                  <img src={deleteicon} alt="" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default WorkSpace;
