import './Intro.css';

function Intro() {

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <div className="intro">
        <section className="hero">
          <h1>EZYLAB에 오신 걸 환영합니다</h1>
          <button className="hero-button" onClick={scrollToAbout}>
            자세히 보기
          </button>
        </section>

        <section className="about" id="about">
          <h2>About EZYLAB</h2>
          <p>EZYLAB은 다양한 프로젝트를 통해 함께 성장하는 공간입니다.</p>
        </section>

        <section className="features">
          <div className="feature-card">게시판</div>
          <div className="feature-card">포트폴리오</div>
        </section>

        <footer className="footer">
          © 2025 EZYLAB. All rights reserved.
        </footer>
      </div>
  );
}

export default Intro;