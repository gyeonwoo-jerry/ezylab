import './App.css';
import Intro from './Intro';

function App() {
  return (
      <div className="App">
        <div className="black-nav">
          <div className="logo">EZYLAB</div>
          <div className="center-menu">
            <span>소개</span>
            <span>포트폴리오</span>
            <span>게시판</span>
          </div>
          <div className="auth-buttons">
            <button>회원가입</button>
            <button>로그인</button>
          </div>
        </div>
        <Intro />
      </div>
  );
}

export default App;
