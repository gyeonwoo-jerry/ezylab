import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../utils/api'; // axios 인스턴스 import
import '../styles/boardWrite.css';

function BoardWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post || null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const isEditMode = !!post;

  useEffect(() => {
    if (isEditMode) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [isEditMode, post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const request = { title, content };
    const blob = new Blob([JSON.stringify(request)], { type: 'application/json' });

    formData.append(isEditMode ? 'update' : 'request', blob);
    images.forEach((file) => formData.append('images', file));
    attachments.forEach((file) => formData.append('attachments', file));

    // 🔐 post.id 안전성 체크
    let url = '/board';
    if (isEditMode) {
      if (!post || !post.id) {
        alert('수정하려는 게시글 정보가 없습니다.');
        return;
      }
      url = `/board/${post.id}`;
    }

    try {
      const response = await API({
        method: isEditMode ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert(isEditMode ? '게시글이 수정되었습니다.' : '게시글이 등록되었습니다.');
        const newId = response.data.content?.id;
        if (newId) {
          navigate(`/board/${newId}`);
        } else {
          navigate('/board'); // fallback
        }
      } else {
        alert(response.data.message || '요청 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    }
  };


  return (
      <div className="board-write-container">
        <h2>{isEditMode ? '게시글 수정' : '게시글 작성'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>제목</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
          </div>
          <div>
            <label>내용</label>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
          </div>
          <div>
            <label>이미지 업로드</label>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages([...e.target.files])}
            />
          </div>
          <div>
            <label>첨부파일 업로드</label>
            <input
                type="file"
                multiple
                onChange={(e) => setAttachments([...e.target.files])}
            />
          </div>
          <button type="submit">{isEditMode ? '수정' : '등록'}</button>
        </form>
      </div>
  );
}

export default BoardWrite;
