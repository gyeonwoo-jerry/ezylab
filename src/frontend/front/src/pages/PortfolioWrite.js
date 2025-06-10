import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/portfolioWrite.css';

const PortfolioWrite = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 인증 확인
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [navigate]);

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('최대 5장까지만 업로드할 수 있습니다.');
      return;
    }

    setImages(files);
    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreviewImages(previews);
  };

  // 이미지 삭제 핸들러
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviewImages(newPreviews);

    // 파일 input 초기화
    const fileInput = document.getElementById('images');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      const requestDto = {
        title: title.trim(),
        content: content.trim(),
        url: url.trim() || null,
        type: type.trim() || null
      };

      const jsonBlob = new Blob([JSON.stringify(requestDto)], {
        type: 'application/json'
      });

      formData.append('request', jsonBlob);

      images.forEach(img => {
        formData.append('images', img);
      });

      const response = await API.post('/portfolio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response?.data) {
        alert('포트폴리오가 생성되었습니다.');
        navigate('/portfolio');
      }
    } catch (err) {
      console.error('포트폴리오 저장 실패:', err);
      alert(`오류가 발생했습니다: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (window.confirm('작업을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      navigate('/portfolio');
    }
  };

  return (
      <div className="portfolio-form-container">
        <h1>포트폴리오 작성</h1>

        <form onSubmit={handleSubmit} className="portfolio-form">
          <div className="form-group">
            <label htmlFor="title">제목 *</label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                disabled={loading}
                required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용 *</label>
            <textarea
                id="content"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                disabled={loading}
                required
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">관련 URL (선택)</label>
            <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="관련 링크를 입력하세요"
                disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">분류 (선택)</label>
            <input
                id="type"
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="예: 디자인, 개발 등"
                disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">이미지</label>
            <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
            />
            <p className="help-text">여러 이미지를 선택할 수 있습니다. (최대 5장)</p>
          </div>

          {previewImages.length > 0 && (
              <div className="image-preview-container">
                <h3>이미지 미리보기</h3>
                <div className="image-preview-grid">
                  {previewImages.map((img, idx) => (
                      <div key={idx} className="image-preview-item">
                        <img src={img.url} alt={`미리보기 ${idx + 1}`} />
                        <div className="image-info">
                          <span className="image-name">{img.name}</span>
                          <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(idx)}
                              disabled={loading}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          <div className="form-actions">
            <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
                disabled={loading}
            >
              취소
            </button>
            <button
                type="submit"
                className="submit-btn"
                disabled={loading}
            >
              {loading ? '처리 중...' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default PortfolioWrite;