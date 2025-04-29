// LoginModal.js
import React from 'react';
import '../styles/modal.css'; // 모달 전용 스타일

const LoginModal = ({ closeModal }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
      <div className="modal_overlay" onClick={handleOverlayClick}>
        <div className="modal_content" onClick={(e) => e.stopPropagation()}>
          <h2>LogIn</h2>
          <input type="text" placeholder="아이디 입력" />
          <input type="password" placeholder="비밀번호 입력" />
          <button>LogIn</button>
          <button className="close_btn" onClick={closeModal}>Close</button>
        </div>
      </div>
  );
};

export default LoginModal;
