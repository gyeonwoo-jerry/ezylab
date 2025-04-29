// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal'; // 모달 컴포넌트 가져오기
import '../styles/header.css';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  return (
      <header>
        <div className="inner">
          <div className="logo">
            <Link to="/">
              <img
                  src="/images/logo.png"
                  srcSet="/images/logo@2x.png 2x, /images/logo@3x.png 3x"
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

          <div className="login">
            <button onClick={openLoginModal}>LogIn</button>
          </div>
        </div>

        {/* 모달 분리된 컴포넌트 사용 */}
        {isLoginOpen && <LoginModal closeModal={closeLoginModal} />}
      </header>
  );
};

export default Header;
