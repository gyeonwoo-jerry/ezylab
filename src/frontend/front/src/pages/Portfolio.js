import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/portfolio.css';
import API from '../utils/api'; // axios 인스턴스 import

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await API.get('/portfolios', {
          params: { page, size }
        });

        console.log('✅ API 응답 데이터:', res.data);

        const data = res.data;
        if (data) {
          if (data.content?.list) {
            setPortfolioItems(data.content.list);
            setTotalPages(data.content.totalPage || 1);
          } else if (Array.isArray(data.content)) {
            setPortfolioItems(data.content);
            setTotalPages(data.totalPage || 1);
          } else if (Array.isArray(data)) {
            setPortfolioItems(data);
            setTotalPages(1);
          } else {
            console.warn('알 수 없는 응답 구조:', data);
            setPortfolioItems([]);
            setTotalPages(0);
          }
        } else {
          setPortfolioItems([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('포트폴리오 목록 조회 실패:', err);
        if (err.response) {
          console.error('상태 코드:', err.response.status);
          console.error('응답 데이터:', err.response.data);
        }
        setError('포트폴리오 목록을 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
        setPortfolioItems([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [page, size]);

  // 이미지 URL을 안전하게 생성하는 함수
  const getImageUrl = (imageData) => {
    console.log('🖼️ 이미지 데이터:', imageData, '타입:', typeof imageData);

    if (!imageData) {
      return '/images/default-portfolio.png';
    }

    // 이미지가 배열인 경우 첫 번째 이미지 사용
    let imagePath = Array.isArray(imageData) ? imageData[0] : imageData;

    if (!imagePath) {
      return '/images/default-portfolio.png';
    }

    // imagePath를 문자열로 변환 (안전성 확보)
    imagePath = String(imagePath);

    console.log('📍 처리할 이미지 경로:', imagePath);

    // 이미 전체 URL인 경우 (http로 시작하는 경우)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // 상대 경로인 경우 서버 URL과 결합
    if (imagePath.startsWith('/')) {
      return `http://211.110.44.79:48080${imagePath}`;
    } else {
      return `http://211.110.44.79:48080/${imagePath}`;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(1);
  };

  const handleCreateClick = () => {
    navigate('/portfolio/write');
  };

  const handleClearCache = () => {
    window.location.reload(true);
  };

  return (
      <div className="portfolio-list">
        <div className="portfolio-header">
          <h1>포트폴리오</h1>
          <div className="portfolio-actions">
            {isLoggedIn && (
                <button className="create-portfolio-btn" onClick={handleCreateClick}>
                  포트폴리오 작성
                </button>
            )}
            <button className="refresh-btn" onClick={handleClearCache} title="데이터를 새로 불러옵니다">
              새로고침
            </button>
          </div>
        </div>

        {loading ? (
            <div className="loading-indicator">포트폴리오 목록을 불러오는 중...</div>
        ) : error ? (
            <div className="error-message">
              {error}
              <button onClick={handleClearCache} className="retry-btn">다시 시도</button>
            </div>
        ) : portfolioItems.length > 0 ? (
            <div className="portfolio-content">
              <div className="portfolio-grid">
                {portfolioItems.map((item) => (
                    <Link to={`/portfolio/${item.id}`} key={item.id} className="portfolio-card">
                      <div className="card-image">
                        <img
                            src={getImageUrl(item.images)}
                            alt="포트폴리오 썸네일"
                            loading="lazy"
                            onLoad={(e) => {
                              e.target.style.opacity = '1';
                            }}
                            onError={(e) => {
                              console.warn(`이미지 로드 실패: ${e.target.src}`);
                              e.target.src = '/images/default-portfolio.png';
                            }}
                            style={{
                              opacity: '0',
                              transition: 'opacity 0.3s ease'
                            }}
                        />
                      </div>
                      <div className="card-content">
                        <h3 className="card-title">{item.title}</h3>
                        {item.type && (
                            <span className="card-type">{item.type}</span>
                        )}
                      </div>
                    </Link>
                ))}
              </div>

              {totalPages > 1 && (
                  <div className="pagination">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="pagination-btn">
                      이전
                    </button>
                    <span className="page-info">{page} / {totalPages}</span>
                    <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="pagination-btn">
                      다음
                    </button>
                    <select value={size} onChange={handleSizeChange} className="page-size-selector">
                      <option value="5">5개씩 보기</option>
                      <option value="10">10개씩 보기</option>
                      <option value="20">20개씩 보기</option>
                    </select>
                  </div>
              )}
            </div>
        ) : (
            <div className="no-items-message">
              등록된 포트폴리오가 없습니다.
              <button onClick={handleClearCache} className="retry-btn">다시 불러오기</button>
            </div>
        )}

        {process.env.NODE_ENV === 'development' && (
            <div className="debug-info">
              <details>
                <summary>디버깅 정보</summary>
                <p>페이지: {page} / {totalPages}</p>
                <p>아이템 수: {portfolioItems.length}</p>
                <p>로그인 상태: {isLoggedIn ? '로그인됨' : '로그인 안됨'}</p>
                {portfolioItems.length > 0 && (
                    <div>
                      <h4>첫 번째 아이템 이미지 정보:</h4>
                      <pre>{JSON.stringify(portfolioItems[0]?.images, null, 2)}</pre>
                    </div>
                )}
              </details>
            </div>
        )}
      </div>
  );
};

export default Portfolio;