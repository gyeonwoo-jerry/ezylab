// Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import '../styles/header.css';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // 토큰이 있으면 true
  }, []);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // 로그인 성공 → 상태 변경
    closeLoginModal();   // 모달 닫기
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false); // 상태만 바꿔주기
    alert('로그아웃되었습니다.');
  };

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
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/board">Board</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="login">
            {isLoggedIn ? (
                <button onClick={handleLogout}>LogOut</button>
            ) : (
                <button onClick={openLoginModal}>LogIn</button>
            )}
          </div>
        </div>

        {/* 로그인 모달 */}
        {isLoginOpen && (
            <LoginModal
                closeModal={closeLoginModal}
                onLogin={handleLoginSuccess}
            />
        )}
      </header>
  );
};

export default Header;
