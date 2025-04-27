import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import containerImage from "../assets/Container.png"; // Logo
import Image from "../assets/image.png"; // Customer support image
import orangeCircle from "../assets/orangecircle.png"; // Orange circle image
import blueCircle from "../assets/bluecircle.png"; // Blue circle image
import footer from "../assets/footer.png"; // Footer image
import sidetriangle from "../assets/triangle.png";
import sidesemicircle from "../assets/halfcircle.png"
const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="navbar">
        <div className="logo">
          <img src={containerImage} alt="Logo" className="logo-image" />
        </div>
        <div className="nav-buttons">
        <Link to="/signup">
            <button className="sign-in">Sign In</button>
          </Link>
          <button className="create-form">Create a BotForm</button>
        </div>
      </header>

      {/* Central Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <img src={sidetriangle} alt="orange triangle" className="orange-triangle" />
          <h1 className="gradient-text">Build advanced chatbots visually</h1>
          <img src={sidesemicircle} alt="blue semicircle" className="blue-semicircle" />
          <p>
            Typebot gives you powerful blocks to create unique chat experiences.
            Embed them anywhere on your web/mobile apps and start collecting
            results like magic.
          </p>
          <button className="cta-button">Create a FormBot for free</button>
        </div>
        <div className="image-preview">
          {/* Background Circles */}
          <img src={orangeCircle} alt="Orange Circle" className="circle left-circle" />
          <img src={blueCircle} alt="Blue Circle" className="circle right-circle" />
          <img src={Image} alt="Chatbot Preview" className="preview-image" />
        </div>
      </main>

      {/* Footer */}
      <div className="footer">
      <img src={footer} alt="footer" className="footer-image" />
      </div>
    </div>
  );
};

export default LandingPage;
