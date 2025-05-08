import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../utils/api'; // axios 인스턴스 가져오기
import '../styles/boardDetail.css';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const fetchPostDetails = async () => {
      try {
        const res = await API.get(`/board/${id}`);
        console.log("✅ 응답 데이터:", res.data);
        setPost(res.data.content);
        setIsLoaded(true);
      } catch (err) {
        console.error("❌ 오류:", err.message);
        setError("API 요청 실패: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id, isLoaded]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await API.delete(`/board/${id}`);
      alert('게시글이 삭제되었습니다.');
      navigate('/board');
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    navigate('/board/write', { state: { post } }); // 수정모드로 이동
  };

  if (loading) return <div className="board-detail-loading">로딩 중...</div>;
  if (error) return <div className="board-detail-error">{error}</div>;
  if (!post) return <div className="board-detail-error">게시글을 찾을 수 없습니다.</div>;

  const isAuthor = user && user.username === post.author;
  const isLoggedIn = !!user;

  return (
      <div className="board-detail-container">
        <div className="board-detail-header">
          <h1 className="board-detail-title">{post.title}</h1>
          <div className="board-detail-info">
            <span className="author">작성자: {post.author}</span>
            <span className="date">작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="views">조회수: {post.viewCount}</span>
          </div>
        </div>

        <div className="board-detail-content">{post.content}</div>

        {post.images && post.images.length > 0 && (
            <div className="board-detail-images">
              {post.images.map((imagePath, index) => (
                  <img
                      key={index}
                      src={`http://211.110.44.79:48080${imagePath}`}
                      alt={`게시글 이미지 ${index + 1}`}
                      className="board-detail-image"
                  />
              ))}
            </div>
        )}

        <div className="board-detail-actions">
          <button className="back-button" onClick={() => navigate('/board')}>목록으로</button>

          {isLoggedIn && (
              <div className="logged-in-actions">
                {isAuthor ? (
                    <>
                      <button className="edit-button" onClick={handleEdit}>수정</button>
                      <button className="delete-button" onClick={handleDelete}>삭제</button>
                    </>
                ) : (
                    <span className="action-message">작성자만 수정/삭제할 수 있습니다</span>
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

export default BoardDetail;
