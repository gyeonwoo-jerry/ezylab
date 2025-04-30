import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/portfolio.css';
import axios from 'axios';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  // 포트폴리오 목록 조회
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get(`/api/portfolios?page=${page}&size=${size}`);
        if (response.data.success) {
          setPortfolioItems(response.data.data.content);
        }
      } catch (error) {
        console.error('포트폴리오 목록 조회 실패:', error);
      }
    };

    fetchPortfolios();
  }, [page, size]);

  // 포트폴리오 생성 페이지로 이동
  const handleCreateClick = () => {
    navigate('/portfolio/create');
  };

  return (
      <div className="portfolio-list">
        <div className="portfolio-header">
          <h1>포트폴리오</h1>
          {isLoggedIn && (
              <button
                  className="create-portfolio-btn"
                  onClick={handleCreateClick}
              >
                포트폴리오 작성
              </button>
          )}
        </div>

        <div className="portfolio-grid">
          {portfolioItems.map((item) => (
              <Link to={`/portfolio/${item.id}`} key={item.id} className="portfolio-card">
                <img
                    src={item.imagePath || '/images/default-portfolio.png'}
                    alt={item.title}
                />
                <p>{item.title}</p>
              </Link>
          ))}
        </div>
      </div>
  );
};

export default Portfolio;