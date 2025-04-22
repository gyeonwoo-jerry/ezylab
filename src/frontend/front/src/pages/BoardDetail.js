import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BoardDetail.css';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 게시글 데이터 가져오기
    setLoading(true);
    fetch(`/api/boards/${id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }
      return res.json();
    })
    .then(data => {
      setPost(data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching post:', err);
      setError(err.message);
      setLoading(false);
    });
  }, [id]);

  const handleGoBack = () => {
    navigate('/board');
  };

  if (loading) return <div className="board-detail-loading">로딩 중...</div>;
  if (error) return <div className="board-detail-error">{error}</div>;
  if (!post) return <div className="board-detail-error">게시글을 찾을 수 없습니다.</div>;

  return (
      <div className="board-detail-container">
        <div className="board-detail-header">
          <h1 className="board-detail-title">{post.title}</h1>
          <div className="board-detail-info">
            <span className="author">작성자: {post.username}</span>
            <span className="date">작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="views">조회수: {post.viewCount}</span>
          </div>
        </div>

        <div className="board-detail-content">
          {post.content}
        </div>

        <div className="board-detail-actions">
          <button className="back-button" onClick={handleGoBack}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
  );
}

export default BoardDetail;