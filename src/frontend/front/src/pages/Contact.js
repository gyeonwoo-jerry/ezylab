import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../styles/contact.css';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contentError, setContentError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    // 이름 검증
    if (name.trim() === '') {
      setNameError('이름을 입력해주세요.');
      valid = false;
    } else {
      setNameError('');
    }

    // 이메일 검증
    if (email.trim() === '') {
      setEmailError('이메일을 입력해주세요.');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      valid = false;
    } else {
      setEmailError('');
    }

    // 문의내용 검증
    if (content.trim() === '') {
      setContentError('문의내용을 입력해주세요.');
      valid = false;
    } else {
      setContentError('');
    }

    if (!valid) return;

    setIsLoading(true);

    try {
      // EmailJS로 이메일 전송
      const templateParams = {
        company: company,
        name: name,
        email: email,
        message: content,
        to_email: 'gyeonwoo2916@gmail.com' // 받을 이메일 주소
      };

      await emailjs.send(
          'service_x7fyy07',  // EmailJS 서비스 ID
          'template_diaecxf', // EmailJS 템플릿 ID
          templateParams,
          'q746hI-1SPzKVRBU5'   // EmailJS 공개 키
      );

      setSubmitted(true);
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      alert('문의 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="contact-page">
        <div className="inner">
          <div className="video-background">
            <iframe
                src="https://www.youtube.com/embed/yPtnPlQT0MM?autoplay=1&mute=1&loop=1&playlist=yPtnPlQT0MM&controls=0&showinfo=0"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="배경 비디오"
            ></iframe>
          </div>
          <div className="contact-form">
            <h1>Contact Us</h1>

            {submitted ? (
                <div className="submit-message">문의가 정상적으로 접수되었습니다. 감사합니다!</div>
            ) : (
                <form onSubmit={handleSubmit}>
                  <label>회사명</label>
                  <input
                      type="text"
                      placeholder="회사명을 입력해주세요"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                  />

                  <label>이름</label>
                  <input
                      type="text"
                      placeholder="이름을 입력해주세요"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                  />
                  {nameError && <div className="error-message">{nameError}</div>}

                  <label>이메일</label>
                  <input
                      type="email"
                      placeholder="이메일을 입력해주세요"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && <div className="error-message">{emailError}</div>}

                  <label>문의내용</label>
                  <textarea
                      placeholder="예시) 안녕하세요. 저희 회사 앱 개발 관련하여 상담을 요청드립니다. 자세한 내용을 메일로 전달드리겠습니다."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                  />
                  {contentError && <div className="error-message">{contentError}</div>}

                  <button type="submit" disabled={isLoading}>
                    {isLoading ? '전송 중...' : '문의하기'}
                  </button>
                </form>
            )}
          </div>
        </div>
      </div>
  );
};

export default Contact;