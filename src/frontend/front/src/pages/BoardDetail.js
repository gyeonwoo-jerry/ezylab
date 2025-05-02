import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/boardDetail.css';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://211.110.44.79:48080/api/boards/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('게시글을 불러오는데 실패했습니다.');
      return res.json();
    })
    .then(data => {
      setPost(data.data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/boards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('게시글이 삭제되었습니다.');
        navigate('/board');
      } else {
        alert('삭제에 실패했습니다.');
      }
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

  const isAuthor = user && user.username === post.username;

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

        <div className="board-detail-content">{post.content}</div>

        <div className="board-detail-actions">
          <button className="back-button" onClick={() => navigate('/board')}>목록으로</button>

          {isAuthor && (
              <>
                <button className="edit-button" onClick={handleEdit}>수정</button>
                <button className="delete-button" onClick={handleDelete}>삭제</button>
              </>
          )}
        </div>
      </div>
  );
}

export default BoardDetail;
