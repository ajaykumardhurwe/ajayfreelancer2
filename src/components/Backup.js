// Home.js
import React from "react";
import { Link } from "react-router-dom";
// import "./App.css";

const Home = () => {
  return (
    <div className="container">
      {/* Column 1 */}
      <div className="column">
        <h2 className="title">Column 1 Title</h2>
        <img
          src="https://via.placeholder.com/150"
          alt="Thumbnail 1"
          className="thumbnail"
        />
        <p className="description">
          This is a description for the first column.
        </p>
        <Link to="/test" className="button">
          Start Test
        </Link>
      </div>

      {/* Column 2 */}
      <div className="column">
        <h2 className="title">Column 2 Title</h2>
        <img
          src="https://via.placeholder.com/150"
          alt="Thumbnail 2"
          className="thumbnail"
        />
        <p className="description">
          This is a description for the second column.
        </p>
        <Link to="/test" className="button">
          Start Test
        </Link>
      </div>
    </div>
  );
};

export default Home;
