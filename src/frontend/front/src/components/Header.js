import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

const Header = () => {
  return (
      <header>
        <div className="inner">
          <div className="logo">
            <Link to="/">
              <img
                  src="/img/logo.png"
                  srcSet="/img/logo@2x.png 2x, /img/logo@3x.png 3x"
                  className="logo"
                  alt="EZYLAB"
              />
            </Link>
          </div>
          <div className="menu">
            <ul>
              <li><Link to="/company">Company</Link></li>
              <li><Link to="/business">Business</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/board">Board</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </header>
  );
};

export default Header;