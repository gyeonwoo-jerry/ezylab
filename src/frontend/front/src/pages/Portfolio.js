import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/portfolio.css';
import axios from 'axios';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setLoading(true);
        setError(null);
        // API 엔드포인트와 파라미터 확인 필요 (실제 엔드포인트에 맞게 수정)
        const response = await axios.get(`/api/portfolios?page=${page}&size=${size}`);
        
        // 실제 응답 구조에 맞게 처리
        if (response.data && response.data.success) {
          // content.list가 있는 경우 (API 응답 구조)
          if (response.data.content && Array.isArray(response.data.content.list)) {
            setPortfolioItems(response.data.content.list);
            setTotalPages(response.data.content.totalPage || 1);
          } else {
            console.warn('API 응답 구조가 예상과 다릅니다:', response.data);
            setPortfolioItems([]);
            setTotalPages(0);
          }
        } else {
          console.warn('API 호출은 성공했지만 응답에 성공 플래그가 없습니다:', response.data);
          setPortfolioItems([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('포트폴리오 목록 조회 실패:', error);
        setError('포트폴리오 목록을 불러오는데 실패했습니다.');
        setPortfolioItems([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [page, size]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 페이지 크기 변경 핸들러
  const handleSizeChange = (event) => {
    setSize(Number(event.target.value));
    setPage(1); // 페이지 크기가 변경되면 1페이지로 이동
  };

  // 포트폴리오 생성 페이지로 이동
  const handleCreateClick = () => {
    navigate('/portfolio/write');
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

        {loading ? (
          <div className="loading-indicator">포트폴리오 목록을 불러오는 중...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : portfolioItems.length > 0 ? (
          <div className="portfolio-content">
            <div className="portfolio-grid">
              {portfolioItems.map((item) => (
                  <Link to={`/portfolio/${item.id}`} key={item.id} className="portfolio-card">
                    <img
                        src={item.images && item.images.length > 0 
                          ? item.images[0] 
                          : '/images/default-portfolio.png'}
                        alt={item.title}
                    />
                    <p>{item.title}</p>
                  </Link>
              ))}
            </div>
            
            {/* 페이지네이션 UI (페이지가 2개 이상일 때만 표시) */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(page - 1)} 
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  이전
                </button>
                <span className="page-info">
                  {page} / {totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(page + 1)} 
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  다음
                </button>
                
                <select 
                  value={size} 
                  onChange={handleSizeChange}
                  className="page-size-selector"
                >
                  <option value="5">5개씩 보기</option>
                  <option value="10">10개씩 보기</option>
                  <option value="20">20개씩 보기</option>
                </select>
              </div>
            )}
          </div>
        ) : (
          <div className="no-items-message">등록된 포트폴리오가 없습니다.</div>
        )}
      </div>
  );
};

export default Portfolio;