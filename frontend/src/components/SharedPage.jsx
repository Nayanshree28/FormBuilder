
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SharedPage.css";
import send from "../assets/send-icon.png";
import logo from "../assets/png.png";

const SharedPage = () => {
  const [containers, setContainers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [replies, setReplies] = useState({});
  const location = useLocation();

  // Load containers data from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const containersData = queryParams.get("containers");

    if (containersData) {
      setContainers(JSON.parse(decodeURIComponent(containersData)));
    }
  }, [location]);

  // Handle reply submission
  const handleReply = (e, index) => {
    e.preventDefault();

    const inputElement = e.target.replyInput;
    const reply = inputElement.value.trim();

    if (reply) {
      setReplies((prevReplies) => ({
        ...prevReplies,
        [index]: reply,
      }));

      // Find the next valid container with content
      let nextIndex = index + 1;
      while (nextIndex < containers.length && !containers[nextIndex].value) {
        nextIndex++;
      }

      // Update the index to the next valid bubble
      if (nextIndex < containers.length) {
        setCurrentIndex(nextIndex);
      }
      inputElement.value = "";
    }
  };

  return (
    <div className="shared-page">
      <div className="chat-container">
        {/* Display messages and their corresponding replies */}
        {containers.slice(0, currentIndex + 1).map((container, index) => (
          <React.Fragment key={index}>
            {container.value && (
              <div className="bubble-container">
                <img src={logo} alt="logo" className="logo" />
                <div className="bubble">
                  {container.type === "text" && <p>{container.value}</p>}
                  {container.type === "img" && (
                    <img src={container.value} alt="Shared content" />
                  )}
                  {container.type === "gif" && (
                    <img src={container.value} alt="Shared GIF" />
                  )}
                  {container.type === "video" && (
                    <video width="320" height="240" controls>
                      <source src={container.value} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            )}
            {replies[index] && (
              <div className="reply-bubble">{replies[index]}</div>
            )}

            {/* Reply input for the current bubble */}
            {index === currentIndex && (
              <form
                onSubmit={(e) => handleReply(e, index)}
                className="reply-form"
              >
                <input
                  type="text"
                  name="replyInput"
                  placeholder="Type your reply..."
                  className="reply-input"
                />
                <button type="submit" className="send-button">
                  <img src={send} alt="send-icon" className="send-icon" />
                </button>
              </form>
            )}
          </React.Fragment>
        ))}

        {/* Message if no more replies are needed */}
        {currentIndex >= containers.length && (
          <div className="no-more-replies">
            <p>All bubbles have been replied to!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedPage;
