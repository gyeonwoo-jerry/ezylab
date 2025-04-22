import React, { useState } from 'react';
import '../styles/SignUp.css';

function SignUp() {
  const [form, setForm] = useState({
    memberId: '',
    name: '',
    password: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 서버에 POST 요청 보내는 로직 (예: axios.post('/api/signup', form))
    console.log('회원가입 정보:', form);
  };

  return (
      <div className="signup-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input name="memberId" placeholder="아이디" onChange={handleChange} required />
          <input name="name" placeholder="이름" onChange={handleChange} required />
          <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
          <input name="email" type="email" placeholder="이메일" onChange={handleChange} required />
          <input name="phone" placeholder="휴대전화 번호" onChange={handleChange} required />
          <input name="address" placeholder="주소" onChange={handleChange} required />
          <button type="submit">회원가입</button>
        </form>
      </div>
  );
}

export default SignUp;
