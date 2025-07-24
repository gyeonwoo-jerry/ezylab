import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api"; // axios 인스턴스
import "../styles/portfolioDetail.css";

function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 로그인 정보 가져오기 (AuthContext 없이)
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = !!userInfo;
  const isAuthor = userInfo && userInfo.name === portfolio?.author;

  useEffect(() => {
    if (isLoaded) return;

    const fetchPortfolio = async () => {
      try {
        const res = await API.get(`/portfolio/${id}`);
        console.log("✅ 포트폴리오 응답:", res.data);
        setPortfolio(res.data.content);
        setIsLoaded(true);
      } catch (err) {
        console.error("❌ 오류:", err.message);
        setError("포트폴리오 요청 실패: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id, isLoaded]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await API.delete(`/portfolio/${id}`);
      alert("포트폴리오가 삭제되었습니다.");
      navigate("/portfolio");
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/portfolio/edit/${id}`, {
      state: { portfolio },
    });
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!portfolio)
    return <div className="not-found">포트폴리오를 찾을 수 없습니다.</div>;

  return (
    <div className="portfolio-detail">
      <div className="portfolio-header">
        <h1>{portfolio.title}</h1>
        <div className="portfolio-meta">
          <span>작성자: {portfolio.author}</span>
          <span>
            작성일: {new Date(portfolio.createdAt).toLocaleDateString()}
          </span>
          <span>조회수: {portfolio.viewCount}</span>
          {/* 분류(타입) 표시 */}
          {portfolio.type && <span>분류: {portfolio.type}</span>}
        </div>

        {/* URL 링크 표시 */}
        {portfolio.url && (
          <div className="portfolio-url">
            <span>🔗 관련 링크: </span>
            <a
              href={portfolio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-link"
            >
              {portfolio.url}
            </a>
          </div>
        )}
      </div>

      <div className="portfolio-content">{portfolio.content}</div>

      {portfolio.images && portfolio.images.length > 0 && (
        <div className="portfolio-images">
          {portfolio.images.map((imgPath, index) => (
            <img
              key={index}
              src={`http://211.110.44.28:8580${imgPath}`}
              alt={`포트폴리오 이미지 ${index + 1}`}
              className="portfolio-image"
            />
          ))}
        </div>
      )}

      <div className="portfolio-actions">
        <button onClick={() => navigate("/portfolio")}>목록으로</button>

        {isLoggedIn && (
          <div className="logged-in-actions">
            {isAuthor ? (
              <>
                <button className="edit-btn" onClick={handleEdit}>
                  수정
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  삭제
                </button>
              </>
            ) : (
              <span className="action-message">
                작성자만 수정/삭제할 수 있습니다
              </span>
            )}
          </div>
        )}

        {!isLoggedIn && (
          <div className="guest-message">
            <span>게시글 작성 및 관리는 로그인 후 이용 가능합니다</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioDetail;
