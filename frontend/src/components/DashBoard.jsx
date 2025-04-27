import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
import createfolder from "../assets/SVG.png";
import createtypebot from "../assets/plus.png";
import deleteicon from "../assets/delete.png";
import closeicon from "../assets/close.png";
import dropdown from "../assets/drop-down.png";
import dropsvg from "../assets/dropdown.png";
import blacksvg from "../assets/down.png";
import axios from "axios";

const API_URL = "https://formbuilder-coyl.onrender.com";

const DashBoard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [showSharePopup, setShowSharePopup] = useState(false); // State for share popup
  const [email, setEmail] = useState(""); // Email for invite
  const navigate = useNavigate();
  const [dropdownOpen1, setDropdownOpen1] = useState(false); // For dropdown visibility

  const [dropdownOpen, setDropdownOpen] = useState(false); // For dropdown visibility
  const [selectedOption, setSelectedOption] = useState("Edit"); // For selected dropdown option
  const [typeBots, setTypeBots] = useState([]); // State to manage Typebots
  const [showTypeBotDeletePopup, setShowTypeBotDeletePopup] = useState(false); // Delete confirmation for Typebot
  const [typeBotToDelete, setTypeBotToDelete] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
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
            setUsername(user.name);
          } else {
            // Handle the error here if needed
          }

          // Fetch folders and files
          const dataResponse = await fetch(`${API_URL}/api/auth/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (dataResponse.ok) {
            const data = await dataResponse.json();

            setFolders(data.folders || []);
            setFiles(data.files || []);

            localStorage.setItem("folders", JSON.stringify(data.folders || []));
            localStorage.setItem("files", JSON.stringify(data.files || []));
          } else {
            // Handle the error here if needed
          }
        } catch (error) {
          // Handle error (e.g., log it or display a message to the user)
        }
      }
    };

    // Theme setup
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");

    // Add the appropriate theme class to the body
    if (savedTheme) {
      document.body.classList.add(savedTheme);
    } else {
      document.body.classList.add("light");
    }

    // Fetch data
    fetchData();

    // Load folders and files from localStorage
    const savedFolders = JSON.parse(localStorage.getItem("folders"));
    const savedFiles = JSON.parse(localStorage.getItem("files"));

    if (savedFolders) setFolders(savedFolders);
    if (savedFiles) setFiles(savedFiles);
  }, []); // Empty dependency array to run only once after initial render

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);

    // Apply the theme class to the body element
    document.body.classList.remove(isDarkMode ? "dark" : "light");
    document.body.classList.add(newTheme);
  };

  const handleCreateFolder = () => setShowPopup(true);

  const handleDone = async () => {
    if (newFolderName.trim()) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          "https://formbuilder-coyl.onrender.com/api/auth/folders",
          { name: newFolderName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201 && response.data.folder) {
          const newFolder = response.data.folder;

          // Update the folders state with the new folder
          setFolders((prevFolders) => {
            const updatedFolders = [...prevFolders, newFolder];

            // Save updated folders to localStorage
            localStorage.setItem("folders", JSON.stringify(updatedFolders));

            return updatedFolders;
          });

          // Clear input and close popup
          setNewFolderName("");
          setShowPopup(false);
        } else {
          toast.error("Failed to create folder. Please try again.");
        }
      } catch (error) {
        toast.error("Error creating folder. Please try again.");
      }
    } else {
      toast.error("Please enter a folder name.");
    }
  };

  const handleCancel = () => {
    setNewFolderName("");
    setShowPopup(false);
  };
  const handleDeleteFolder = (index) => {
    setFolderToDelete(index); // Use the folder index directly
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (
      folderToDelete === null ||
      folderToDelete < 0 ||
      folderToDelete >= folders.length
    ) {
      ("Invalid folder index");
      return;
    }

    const folder = folders[folderToDelete]; // Get the folder to be deleted

    if (!folder || !folder._id) {
      alert("An error occurred while deleting the folder.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // API call to delete the folder from the backend
      const response = await axios.delete(
        `${API_URL}/api/auth/folders/${folder._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update state
        setFolders((prevFolders) => {
          const updatedFolders = prevFolders.filter(
            (f) => f._id !== folder._id
          );

          // Update localStorage
          localStorage.setItem("folders", JSON.stringify(updatedFolders));

          return updatedFolders;
        });

        // Reset states
        setShowDeleteConfirmation(false);
        setFolderToDelete(null);
      } else {
        alert("Failed to delete the folder. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while deleting the folder.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setFolderToDelete(null);
  };

  const handleSelectFolder = (index) => {
    setSelectedFolderIndex(index);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleShare = () => setShowSharePopup(true); // Show Share Popup

  const handleSendInvite = () => {
    // Logic to send invite by email (e.g., API call)
    toast.error(`Invite sent to ${email}`);
    setEmail(""); // Reset email field
    setShowSharePopup(false); // Close the Share Popup
  };

  const handleCopyLink = () => {
    const link = window.location.href; // Get current page URL
    navigator.clipboard.writeText(link); // Copy the link to clipboard
    alert("Link copied to clipboard!");
  };

  const handleDeleteTypeBot = (id) => {
    setTypeBotToDelete(id);
    setShowTypeBotDeletePopup(true);
  };

  const handleCreateTypeBot = async () => {
    try {
      const token = localStorage.getItem("token");
      const newTypeBot ={ name: "New Form" }; // Default form name

      const response = await axios.post(
        `${API_URL}/api/auth/files`,
        newTypeBot,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 && response.data.file) {
        const createdTypeBot = response.data.file;

        // Update frontend state immediately
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, createdTypeBot];

          // Optionally, update localStorage for persistence
          localStorage.setItem("files", JSON.stringify(updatedFiles));
          return updatedFiles;
        });

        // After creating the form, reset containers to empty
        setContainers([]); // Reset containers when creating a new form
      } else {
        alert("Failed to create form. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while creating the form.");
    }
  };

  const handleItemClick = (fileId) => {
    setContainers([]);
    // Navigate to the workspace with the fileId as a parameter
    navigate(`/workspace`, { state: { fileId } });
  };
  const confirmTypeBotDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      // API call to delete the file from the backend
      const response = await axios.delete(
        `${API_URL}/api/auth/files/${typeBotToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Immediately remove the deleted file from the frontend state (files or typeBots)
        setFiles((prevFiles) => {
          const updatedFiles = prevFiles.filter(
            (file) => file._id !== typeBotToDelete
          );

          // Update localStorage to reflect the removal immediately
          localStorage.setItem("files", JSON.stringify(updatedFiles));

          return updatedFiles;
        });

        // Close the delete confirmation popup
        setShowTypeBotDeletePopup(false);
        setTypeBotToDelete(null);
      } else {
        alert("Failed to delete the form. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while deleting the form.");
    }
  };

  const cancelTypeBotDelete = () => {
    setShowTypeBotDeletePopup(false);
    setTypeBotToDelete(null);
  };

  return (
    <div className={`dashboard ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <nav className="Navbar">
        <div
          className={`workspace ${dropdownOpen1 ? "dropdown-open1" : ""}`}
          onClick={() => setDropdownOpen1(!dropdownOpen1)}
        >
          {username}'s workspace
          <img
            src={isDarkMode ? dropsvg : blacksvg} // Conditionally render the correct image
            alt="svg"
            className={`dropsvg ${dropdownOpen1 ? "rotate" : ""}`}
          />
          {dropdownOpen1 && (
            <div className="dropdown-menu-nav">
              <button
                className="dropdown-item"
                onClick={() => navigate("/Settings")}
              >
                Settings
              </button>
              <button
                className="dropdown-item-logout"
                onClick={() => {
                  localStorage.removeItem("token"); // Clear token or any other logout logic
                  navigate("/landing");
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        <div className="nav-actions">
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
        <button className="share-btn" onClick={handleShare}>
          Share
        </button>
      </nav>

      <div className="content">
        <div className="folder-container">
          <button className="create-folder" onClick={handleCreateFolder}>
            <img
              src={createfolder}
              alt="Create Folder"
              className="folder-icon"
            />
            Create a folder
          </button>

          <div className="folder-list">
            {folders.map((folder, index) => (
              <div
                key={folder._id} // Use unique key, like _id from the backend
                className={`folder-item ${
                  selectedFolderIndex === index ? "selected" : ""
                }`}
                onClick={() => handleSelectFolder(index)}
              >
                <span className="folder-text">{folder.name}</span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent folder selection click
                    handleDeleteFolder(index);
                  }}
                >
                  <img src={deleteicon} alt="delete" className="delete-icon" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="typebot-wrapper">
          <button className="create-typebot" onClick={handleCreateTypeBot}>
            <img
              src={createtypebot}
              alt="Create Typebot"
              className="typebot-icon"
            />
            <span className="typebot-text">Create a typebot</span>
          </button>

          <div className="typebot-container">
            {files.length > 0
              ? files.map((file) => (
                  <div key={file._id} className="typebot-item">
                    <span
                      className="newform"
                      onClick={() => handleItemClick(file._id)}
                    >
                      {file.name}
                      {console.log(file.name)}
                    </span>
                    <button
                      className="delete-typebot"
                      onClick={() => handleDeleteTypeBot(file._id)}
                    >
                      <img
                        src={deleteicon}
                        alt="delete"
                        className="delete-icon"
                      />
                    </button>
                  </div>
                ))
              : null}{" "}
            {/* Do not render anything if no files */}
          </div>
        </div>
      </div>
      {/* Typebot Delete Confirmation Popup */}
      {showTypeBotDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-dlt">
            <h3>
              Are you sure you want to <span> delete this form? </span>
            </h3>
            <div className="popup-actions">
              <button onClick={confirmTypeBotDelete} className="done-btn">
                Done
              </button>
              <div className="line"></div>
              <button onClick={cancelTypeBotDelete} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Popup */}
      {showSharePopup && (
        <div className="popup-overlay">
          <div className="popup-share">
            <div className="actions">
              <button
                onClick={() => setShowSharePopup(false)}
                className="close-btn"
              >
                <img src={closeicon} alt="close" className="close-btn" />
              </button>
            </div>

            <div className="invite-by-email">
              <div className="email-header">
                <h2>Invite by Email</h2>
                <div className="dropdown">
                  <button
                    className="dropdown-toggle"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {selectedOption}
                    <span className="arrow-icon">
                      <img src={dropdown} alt="" />
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleOptionSelect("Edit")}>
                        Edit
                      </button>
                      <div className="shareline"></div>
                      <button onClick={() => handleOptionSelect("View")}>
                        View
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email id"
              />
              <button onClick={handleSendInvite} className="invite-btn">
                Send Invite
              </button>
            </div>

            <div className="invite-by-link">
              <h2>Invite by Link</h2>
              <button onClick={handleCopyLink} className="copylink-btn">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Folder Creation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
            <div className="popup-actions">
              <button onClick={handleDone} className="done-btn">
                Done
              </button>

              <div className="line"></div>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="popup-overlay">
          <div className="popup-dlt">
            <h3>
              Are you sure you want to <span> delete this folder? </span>
            </h3>
            <div className="popup-actions">
              <button onClick={handleConfirmDelete} className="done-btn">
                Confirm
              </button>
              <div className="line"></div>
              <button onClick={handleCancelDelete} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
