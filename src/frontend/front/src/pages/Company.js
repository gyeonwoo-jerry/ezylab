import React from 'react';
import '../styles/company.css';

const Company = () => {
  const teamMembers = [
    {
      name: "김덕수",
      role: "대표 / 프론트 개발자 / UI/UX 디자이너",
      description: "10년 경력의 IT 개발자로 프로젝트 전체를 총괄하며, UI/UX, 프론트엔드까지 모든 영역을 담당합니다.",
      icon: "👨‍💻"
    },
    {
      name: "구태훈",
      role: "풀스택 개발자 / 모바일 개발자",
      description: "풀스택, iOS/Android 네이티브 개발 전문가로, 성능 최적화된 웹, 모바일 앱을 개발합니다.",
      icon: "📱"
    },
    {
      name: "박견우",
      role: "백엔드 개발자",
      description: "백앤드 개발자로 웹을 개발합니다.",
      icon: "📱"
    }
  ];

  const advantages = [
    {
      icon: "⚡",
      title: "빠른 의사결정",
      description: "3명이니까 회의는 5분, 결정은 즉시! 복잡한 승인 과정 없이 바로 실행합니다."
    },
    {
      icon: "💬",
      title: "직접 소통",
      description: "대표가 직접 프로젝트를 관리하고 소통합니다. 전화, 카톡, 메일 모두 가능!"
    },
    {
      icon: "💰",
      title: "합리적인 가격",
      description: "중간 마진 없는 직접 개발로 대기업 대비 30-50% 절약된 비용을 제공합니다."
    },
    {
      icon: "🎯",
      title: "1:1 맞춤 서비스",
      description: "담당자가 처음부터 끝까지 책임지며, 고객 요구사항에 즉시 반영 가능합니다."
    },
    {
      icon: "🔧",
      title: "평생 A/S",
      description: "개발 완료 후에도 지속적인 관리와 업데이트를 제공합니다."
    },
    {
      icon: "📍",
      title: "최고의 접근성",
      description: "구디역 공유오피스로 미팅과 상담이 편리합니다."
    }
  ];

  const stats = [
    { number: "20+", label: "완료 프로젝트" },
    { number: "80%", label: "재의뢰율" },
    { number: "3년", label: "평균 고객 관계" },
    { number: "24시간", label: "평균 응답시간" }
  ];

  return (
      <div className="company-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1>
              <span className="highlight">소수의 전문가</span>가 만드는<br />
              완벽한 솔루션
            </h1>
            <p>작지만 강한 팀, EZYLAB과 함께 당신의 아이디어를 현실로 만들어보세요</p>
          </div>
        </section>

        {/* Team Section */}
        <section className="section team-section">
          <div className="container">
            <h2 className="section-title">Our Team</h2>
            <p className="section-subtitle">각 분야의 전문가들이 모여 최고의 결과물을 만들어냅니다</p>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                  <div key={index} className="team-member">
                    <div className="member-avatar">{member.icon}</div>
                    <h3>{member.name}</h3>
                    <p className="member-role"><strong>{member.role}</strong></p>
                    <p className="member-description">{member.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="section advantages-section">
          <div className="container">
            <h2 className="section-title">Why EZYLAB?</h2>
            <p className="section-subtitle">소규모 팀만의 특별한 장점들</p>

            <div className="advantage-grid">
              {advantages.map((advantage, index) => (
                  <div key={index} className="advantage-card">
                    <div className="advantage-icon">{advantage.icon}</div>
                    <h3>{advantage.title}</h3>
                    <p>{advantage.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section stats-section">
          <div className="container">
            <h2 className="section-title">신뢰할 수 있는 실적</h2>

            <div className="stats-grid">
              {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="stat-number">{stat.number}</span>
                    <p className="stat-label">{stat.label}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CEO Message */}
        <section className="section ceo-message-section">
          <div className="container">
            <div className="message-content">
              <div className="quote">
                "큰 회사의 복잡함 없이, 작은 팀의 전문성으로<br />
                고객님의 아이디어를 현실로 만들어드립니다.<br /><br />

                저희는 단순히 개발만 하는 것이 아니라,<br />
                고객의 비즈니스 파트너가 되어<br />
                함께 성장해 나가고자 합니다."
              </div>
              <div className="quote-author">
                - EZYLAB 대표 김덕수
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Company;