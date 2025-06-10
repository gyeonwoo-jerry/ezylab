import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/services.css';

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const navigate = useNavigate();

  const services = [
    {
      id: 'uiux',
      title: 'UI/UX 디자인',
      icon: '🎨',
      description: '사용자 중심의 직관적이고 아름다운 인터페이스를 설계합니다',
      features: [
        '사용자 경험(UX) 리서치',
        '와이어프레임 & 프로토타입',
        '반응형 UI 디자인',
        '브랜드 아이덴티티 디자인',
        '사용성 테스트',
        '디자인 시스템 구축'
      ],
      process: [
        { step: '01', title: '리서치', desc: '사용자 분석 및 경쟁사 분석' },
        { step: '02', title: '기획', desc: '정보구조 설계 및 와이어프레임' },
        { step: '03', title: '디자인', desc: 'UI 디자인 및 프로토타입' },
        { step: '04', title: '검증', desc: '사용성 테스트 및 개선' }
      ],
      tools: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'Zeplin']
    },
    {
      id: 'app',
      title: '모바일 앱 개발',
      icon: '📱',
      description: 'iOS와 Android를 아우르는 고품질 모바일 애플리케이션을 개발합니다',
      features: [
        'iOS/Android 네이티브 개발',
        'React Native 크로스플랫폼',
        'Flutter 하이브리드 개발',
        '푸시 알림 시스템',
        '소셜 로그인 연동',
        '앱스토어 등록 대행'
      ],
      process: [
        { step: '01', title: '기획', desc: '요구사항 분석 및 기능 정의' },
        { step: '02', title: '설계', desc: 'DB 설계 및 API 구조 설계' },
        { step: '03', title: '개발', desc: 'UI 구현 및 기능 개발' },
        { step: '04', title: '배포', desc: '테스트 및 앱스토어 출시' }
      ],
      tools: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase']
    },
    {
      id: 'web',
      title: '웹 개발',
      icon: '💻',
      description: '반응형 웹사이트부터 복잡한 웹 애플리케이션까지 모든 웹 솔루션을 제공합니다',
      features: [
        '반응형 웹사이트 개발',
        'React/Vue.js SPA 개발',
        '전자상거래 솔루션',
        '관리자 시스템(CMS)',
        'API 서버 구축',
        '클라우드 배포 및 운영'
      ],
      process: [
        { step: '01', title: '분석', desc: '비즈니스 요구사항 분석' },
        { step: '02', title: '설계', desc: '시스템 아키텍처 설계' },
        { step: '03', title: '개발', desc: '프론트엔드 & 백엔드 개발' },
        { step: '04', title: '런칭', desc: '배포 및 운영 환경 구축' }
      ],
      tools: ['React', 'Vue.js', 'Node.js', 'Spring Boot', 'AWS', 'Docker']
    }
  ];

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handlePortfolioClick = () => {
    navigate('/portfolio');
  };

  const additionalServices = [];

  return (
      <div className="services-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1>
              <span className="highlight">전문적인 서비스</span>로<br />
              당신의 비즈니스를 성장시키세요
            </h1>
            <p>UI/UX 디자인부터 앱/웹 개발까지, 원스톱 디지털 솔루션을 제공합니다</p>
          </div>
        </section>

        {/* Main Services */}
        <section className="main-services-section">
          <div className="container">
            <h2 className="section-title">주요 서비스</h2>
            <p className="section-subtitle">EZYLAB의 핵심 서비스를 만나보세요</p>

            {/* Service Navigation */}
            <div className="service-nav">
              {services.map((service, index) => (
                  <button
                      key={service.id}
                      className={`service-nav-btn ${activeService === index ? 'active' : ''}`}
                      onClick={() => setActiveService(index)}
                  >
                    <span className="service-icon">{service.icon}</span>
                    <span className="service-name">{service.title}</span>
                  </button>
              ))}
            </div>

            {/* Service Detail */}
            <div className="service-detail">
              <div className="service-content">
                <div className="service-info">
                  <div className="service-header">
                    <span className="service-icon-large">{services[activeService].icon}</span>
                    <div>
                      <h3>{services[activeService].title}</h3>
                      <p>{services[activeService].description}</p>
                    </div>
                  </div>

                  <div className="service-features">
                    <h4>주요 기능</h4>
                    <ul>
                      {services[activeService].features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-specs">
                    <div className="spec-item">
                      <h5>사용 기술</h5>
                      <div className="tech-tags">
                        {services[activeService].tools.map((tool, index) => (
                            <span key={index} className="tech-tag">{tool}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="service-process">
                  <h4>개발 프로세스</h4>
                  <div className="process-steps">
                    {services[activeService].process.map((step, index) => (
                        <div key={index} className="process-step">
                          <div className="step-number">{step.step}</div>
                          <div className="step-content">
                            <h5>{step.title}</h5>
                            <p>{step.desc}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>프로젝트를 시작할 준비가 되셨나요?</h2>
              <p>
                상담을 통해 여러분의 아이디어를 구체화하고<br />
                최적의 솔루션을 제안해드리겠습니다.
              </p>
              <div className="cta-buttons">
                <button className="cta-btn primary" onClick={handleContactClick}>
                  상담 신청
                </button>
                <button className="cta-btn secondary" onClick={handlePortfolioClick}>
                  포트폴리오 보기
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Services;