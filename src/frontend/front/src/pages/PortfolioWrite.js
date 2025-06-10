import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../utils/api';
import '../styles/portfolioWrite.css';

const PortfolioWrite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id || (location.state && location.state.portfolio);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        alert('로그인이 필요한 서비스입니다.');
        navigate('/login');
        return false;
      }
      return true;
    };

    const fetchPortfolioData = async () => {
      if (!isEditMode || !checkAuth()) return;

      try {
        setLoading(true);
        const portfolioData = location.state?.portfolio;

        if (portfolioData) {
          setTitle(portfolioData.title);
          setContent(portfolioData.content);
          setUrl(portfolioData.url || '');
          setType(portfolioData.type || '');
          if (portfolioData.images?.length > 0) {
            setPreviewImages(
                portfolioData.images.map((imgPath, idx) => ({
                  url: `http://211.110.44.79:48080${imgPath}`,
                  isExisting: true,
                  id: idx
                }))
            );
          }
        } else if (id) {
          const res = await API.get(`/portfolio/${id}`);
          const data = res.data.content;
          setTitle(data.title);
          setContent(data.content);
          setUrl(data.url || '');
          setType(data.type || '');
          if (data.images?.length > 0) {
            setPreviewImages(
                data.images.map((imgPath, idx) => ({
                  url: `http://211.110.44.79:48080${imgPath}`,
                  isExisting: true,
                  id: idx
                }))
            );
          }
        }
      } catch (err) {
        console.error('포트폴리오 데이터 조회 실패:', err);
        setError('포트폴리오 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (checkAuth()) fetchPortfolioData();
  }, [id, isEditMode, navigate, location.state]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      isExisting: false
    }));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    const requestDto = { title, content, url, type };
    const jsonBlob = new Blob([JSON.stringify(requestDto)], {
      type: 'application/json'
    });

    const keyName = isEditMode ? 'update' : 'request';
    formData.append(keyName, jsonBlob);

    images.forEach(img => {
      formData.append('images', img);
    });

    try {
      setLoading(true);
      let response;
      const portfolioId = id || location.state?.portfolio?.id;

      if (isEditMode && portfolioId) {
        response = await API.put(`/portfolio/${portfolioId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await API.post('/portfolio', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response?.data) {
        alert(isEditMode ? '포트폴리오가 수정되었습니다.' : '포트폴리오가 생성되었습니다.');
        navigate('/portfolio');
      }
    } catch (err) {
      console.error('포트폴리오 저장 실패:', err);
      alert(`오류가 발생했습니다: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작업을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      const returnId = id || location.state?.portfolio?.id || '';
      navigate(isEditMode ? `/portfolio/${returnId}` : '/portfolio');
    }
  };

  if (loading && isEditMode) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
      <div className="portfolio-form-container">
        <h1>{isEditMode ? '포트폴리오 수정' : '포트폴리오 작성'}</h1>

        <form onSubmit={handleSubmit} className="portfolio-form">
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
                id="content"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">관련 URL (선택)</label>
            <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="관련 링크를 입력하세요"
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
                      </div>
                  ))}
                </div>
              </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">취소</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '처리 중...' : isEditMode ? '수정하기' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default PortfolioWrite;
