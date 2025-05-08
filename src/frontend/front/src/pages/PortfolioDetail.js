import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/portfolio.css';

const PortfolioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로그인 상태 및 포트폴리오 정보 조회
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);

      // 사용자 ID 가져오기 (실제 구현에서는 토큰에서 추출하거나 사용자 정보 API 호출)
      const userId = localStorage.getItem('userId');
      return userId;
    };

    const fetchPortfolioDetail = async () => {
      const userId = checkLoginStatus();

      try {
        setLoading(true);
        const response = await axios.get(`/api/portfolio/${id}`);

        if (response.data.success) {
          setPortfolio(response.data.data);
          // 작성자인지 확인 (백엔드에서 제공하는 작성자 ID와 현재 로그인한 사용자 ID 비교)
          setIsAuthor(userId && response.data.data.userId === parseInt(userId));
        }
      } catch (error) {
        console.error('포트폴리오 상세 조회 실패:', error);
        setError('포트폴리오를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioDetail();
  }, [id]);

  // 수정 페이지로 이동
  const handleEditClick = () => {
    navigate(`/portfolio/${id}`);
  };

  // 삭제 확인 알럿 표시
  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  // 포트폴리오 삭제 실행
  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`/api/portfolio/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.success) {
        alert('포트폴리오가 삭제되었습니다.');
        navigate('/portfolio');
      }
    } catch (error) {
      console.error('포트폴리오 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setShowDeleteAlert(false);
    }
  };

  // 삭제 취소
  const cancelDelete = () => {
    setShowDeleteAlert(false);
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!portfolio) return <div className="not-found">포트폴리오를 찾을 수 없습니다.</div>;

  return (
      <div className="portfolio-detail">
        <h1>{portfolio.title}</h1>

        {/* 작성자인 경우 수정/삭제 버튼 표시 */}
        {isLoggedIn && isAuthor && (
            <div className="portfolio-actions">
              <button className="edit-btn" onClick={handleEditClick}>수정</button>
              <button className="delete-btn" onClick={handleDeleteClick}>삭제</button>
            </div>
        )}

        {/* 포트폴리오 이미지들 표시 */}
        <div className="portfolio-images">
          {portfolio.images && portfolio.images.length > 0 ? (
              portfolio.images.map((image, index) => (
                  <img
                      key={index}
                      src={image.imagePath}
                      alt={`${portfolio.title} 이미지 ${index + 1}`}
                      className="portfolio-image"
                  />
              ))
          ) : (
              <img
                  src="/images/default-portfolio.png"
                  alt={portfolio.title}
                  className="portfolio-image default-image"
              />
          )}
        </div>

        <div className="portfolio-content">
          <p>{portfolio.content}</p>
        </div>

        {/* 삭제 확인 알럿 */}
        {showDeleteAlert && (
            <div className="delete-alert-overlay">
              <div className="delete-alert">
                <p>정말 삭제하시겠습니까?</p>
                <div className="delete-alert-buttons">
                  <button onClick={confirmDelete}>삭제</button>
                  <button onClick={cancelDelete}>취소</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default PortfolioDetail;