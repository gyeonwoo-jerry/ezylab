// src/components/LoginModal.js
import React, { useState } from 'react';
import API from '../utils/api';
import '../styles/modal.css';

const LoginModal = ({ closeModal, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', {
        memberId: username,
        password: password,
      });

      const content = res.data?.content;

      if (content?.accessToken) {
        // 토큰 저장
        localStorage.setItem('accessToken', content.accessToken);
        localStorage.setItem('refreshToken', content.refreshToken);

        // 사용자 정보 저장
        const userInfo = {
          id: content.id || '',
          name: content.name || username,
          email: content.email || '',
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        alert('로그인 성공');

        // 상위에서 전달된 콜백 호출 (로그인 상태 변경)
        if (typeof onLogin === 'function') {
          onLogin();
        }

        // 모달 닫기
        closeModal();
      } else {
        setError('로그인 실패: 유효한 토큰이 없습니다.');
      }
    } catch (err) {
      const message = err.response?.data?.message || '아이디 또는 비밀번호가 잘못되었습니다.';
      setError(`로그인 실패: ${message}`);
    }
  };

  return (
      <div
          className="modal_overlay"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="modal_content" onClick={(e) => e.stopPropagation()}>
          <div className="title">로그인</div>
          <p className="subtext">이 페이지는 관리자 전용입니다.</p>
          <input
              type="text"
              placeholder="아이디 입력"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="error">{error}</div>}
          <button onClick={handleLogin}>로그인</button>
          <button className="close_btn" onClick={closeModal}>닫기</button>
        </div>
      </div>
  );
};

export default LoginModal;
