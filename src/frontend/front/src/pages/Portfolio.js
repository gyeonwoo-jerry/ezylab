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

  // API 기본 URL 설정 - 서버 주소에 맞게 변경하세요
  const API_BASE_URL = 'http://211.110.44.79:48080'; // BoardDetail에서 사용한 API 주소 활용

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

        // 콘솔에 API 요청 정보 출력 (디버깅용)
        console.log(`📡 포트폴리오 API 요청: ${API_BASE_URL}/api/portfolios?page=${page}&size=${size}`);

        // API 엔드포인트와 파라미터 수정 (절대 경로 사용)
        const response = await axios.get(`${API_BASE_URL}/api/portfolios?page=${page}&size=${size}`, {
          withCredentials: true, // 쿠키 포함 설정
          headers: {
            'Accept': 'application/json'
          }
        });

        // API 응답 구조 출력 (디버깅용)
        console.log('✅ API 응답 데이터:', response.data);

        // 다양한 응답 구조 처리 로직
        if (response.data) {
          // 케이스 1: content.list 구조
          if (response.data.content && Array.isArray(response.data.content.list)) {
            setPortfolioItems(response.data.content.list);
            setTotalPages(response.data.content.totalPage || 1);
          }
          // 케이스 2: content 배열 구조
          else if (Array.isArray(response.data.content)) {
            setPortfolioItems(response.data.content);
            setTotalPages(response.data.totalPage || 1);
          }
          // 케이스 3: 응답 자체가 배열인 경우
          else if (Array.isArray(response.data)) {
            setPortfolioItems(response.data);
            setTotalPages(1); // 페이지 정보가 없으면 기본값 1
          }
          // 케이스 4: 데이터 없음
          else {
            console.warn('API 응답 구조를 처리할 수 없습니다:', response.data);
            setPortfolioItems([]);
            setTotalPages(0);
          }
        } else {
          setPortfolioItems([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('포트폴리오 목록 조회 실패:', error);
        // 상세 오류 정보 출력
        if (error.response) {
          console.error('상태 코드:', error.response.status);
          console.error('응답 데이터:', error.response.data);
        }
        setError('포트폴리오 목록을 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
        setPortfolioItems([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [page, size, API_BASE_URL]);

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

  // 로컬 캐시 초기화 핸들러 (문제 해결 시도용)
  const handleClearCache = () => {
    // 페이지를 새로고침하여 API를 다시 호출
    window.location.reload(true);
  };

  return (
      <div className="portfolio-list">
        <div className="portfolio-header">
          <h1>포트폴리오</h1>
          <div className="portfolio-actions">
            {isLoggedIn && (
                <button
                    className="create-portfolio-btn"
                    onClick={handleCreateClick}
                >
                  포트폴리오 작성
                </button>
            )}
            <button
                className="refresh-btn"
                onClick={handleClearCache}
                title="데이터를 새로 불러옵니다"
            >
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
            <div className="no-items-message">
              등록된 포트폴리오가 없습니다.
              <button onClick={handleClearCache} className="retry-btn">다시 불러오기</button>
            </div>
        )}

        {/* 디버깅 정보 (개발 중에만 사용) */}
        {process.env.NODE_ENV === 'development' && (
            <div className="debug-info">
              <details>
                <summary>디버깅 정보</summary>
                <p>API URL: {`${API_BASE_URL}/api/portfolios?page=${page}&size=${size}`}</p>
                <p>로그인 상태: {isLoggedIn ? '로그인됨' : '로그인 안됨'}</p>
                <p>페이지: {page} / {totalPages}</p>
                <p>아이템 수: {portfolioItems.length}</p>
              </details>
            </div>
        )}
      </div>
  );
};

export default Portfolio;