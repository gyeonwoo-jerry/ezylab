import React from 'react';
import { useParams } from 'react-router-dom';

// 포트폴리오 임시 데이터 (Detail에서도 불러옴)
const portfolioItems = [
  { id: 1, title: 'logo', description: 'logo 상세 설명', image: '/images/logo.png' },
  { id: 2, title: 'example1', description: 'example1 상세 설명', image: '/images/sec_01_img.png' },
  { id: 3, title: 'example2', description: 'example2 상세 설명', image: '/images/sec_02_img.png' },
  { id: 4, title: 'example3', description: 'example3 상세 설명 ', image: '/images/sec_03_img.png' },
];

const PortfolioDetail = () => {
  const { id } = useParams();
  const item = portfolioItems.find((p) => p.id === parseInt(id));

  if (!item) {
    return <div>포트폴리오를 찾을 수 없습니다.</div>;
  }

  return (
      <div className="portfolio-detail">
        <h1>{item.title}</h1>
        <img src={item.image} alt={item.title} />
        <p>{item.description}</p>
      </div>
  );
};

export default PortfolioDetail;
