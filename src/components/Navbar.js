import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/download">Download</Link></li>
        <li><Link to="/project">Project</Link></li>
        <li><Link to="/srccode">Code</Link></li>
        <li><Link to="/testing">Testing</Link></li>

      </ul>
    </nav>
  );
};

export default Navbar;
