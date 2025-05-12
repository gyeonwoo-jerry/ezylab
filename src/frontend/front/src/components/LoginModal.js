// src/components/LoginModal.js
import React, { useState } from 'react';
import API from '../utils/api';
import '../styles/modal.css';

const LoginModal = ({ closeModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', {
        memberId: username,
        password: password,
      });

      if (res.data?.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        closeModal();
      } else {
        setError('로그인 실패: 토큰이 없습니다.');
      }
    } catch (err) {
      setError('로그인 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  };

  return (
      <div className="modal_overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className="modal_content" onClick={(e) => e.stopPropagation()}>
          <div className="title">관리자 로그인</div>
          <input type="text" placeholder="아이디 입력" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="비밀번호 입력" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="error">{error}</div>}
          <button onClick={handleLogin}>LogIn</button>
          <button className="close_btn" onClick={closeModal}>Close</button>
        </div>
      </div>
  );
};

export default LoginModal;
