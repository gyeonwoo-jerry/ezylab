import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/portfolio.css';

// 포트폴리오 임시 데이터
const portfolioItems = [
  { id: 1, title: 'logo', image: '/images/logo.png' },
  { id: 2, title: 'example1', image: '/images/sec_01_img_01.png' },
  { id: 3, title: 'example2', image: '/images/sec_02_img_01.png' },
  { id: 4, title: 'example3', image: '/images/sec_03_img_01.png' },
];

const Portfolio = () => {
  return (
      <div className="portfolio-list">
        <h1>포트폴리오</h1>
        <div className="portfolio-grid">
          {portfolioItems.map((item) => (
              <Link to={`/portfolio/${item.id}`} key={item.id} className="portfolio-card">
                <img src={item.image} alt={item.title} />
                <p>{item.title}</p>
              </Link>
          ))}
        </div>
      </div>
  );
};

export default Portfolio;
