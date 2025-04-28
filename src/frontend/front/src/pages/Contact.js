import React from 'react';
import '../styles/contact.css';

const Contact = () => {
  return (
      <div className="contact-page">
        <div className="contact-form">
          <h1>Contact Us</h1>
          <form>
            <label>회사명</label>
            <input type="text" placeholder="회사명을 입력해주세요" />

            <label>이름</label>
            <input type="text" placeholder="이름을 입력해주세요" />

            <label>이메일</label>
            <input type="email" placeholder="이메일을 입력해주세요" />

            <label>문의내용</label>
            <textarea placeholder="예시) 안녕하세요. 저희 회사 앱 개발 관련하여 상담을 요청드립니다. 자세한 내용을 메일로 전달드리겠습니다." />

            <button type="submit">문의하기</button>
          </form>
        </div>
      </div>
  );
};

export default Contact;
