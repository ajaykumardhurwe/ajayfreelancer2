import React from 'react';
import '../styles/Header.css';
import headerbgVideo from "../video/headerbgVideo.mp4"
const Header = () => {
  return (
    <header className="header">
      <div className="video-container">
        <video autoPlay muted loop className="background-video">
          <source src={headerbgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
      //  className="header-content"
       >
        {/* <h1>Ajay Freelancer</h1> */}
        {/* <p>Empowering freelancers with knowledge and tools</p> */}
      </div>
    </header>
  );
};

export default Header;
