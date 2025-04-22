import React, { useState } from 'react';
import '../styles/LoginModal.css';

function LoginModal({ onClose }) {
  const [form, setForm] = useState({ memberId: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', form);
    // TODO: 서버로 로그인 요청 보내기
    onClose(); // 성공 가정 후 닫기
  };

  return (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-button" onClick={onClose}>×</button>
          <h2>로그인</h2>
          <form onSubmit={handleSubmit}>
            <input name="memberId" placeholder="아이디" value={form.memberId} onChange={handleChange} required />
            <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
            <button type="submit">로그인</button>
          </form>
        </div>
      </div>
  );
}

export default LoginModal;