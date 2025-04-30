import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/portfolioForm.css';

const PortfolioWrite = () => {
  const { id } = useParams(); // id가 있으면 수정 모드, 없으면 생성 모드
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 수정 모드일 때 기존 포트폴리오 정보 불러오기
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
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
        const response = await axios.get(`/api/portfolio?portfolioId=${id}`);

        if (response.data.success) {
          const portfolioData = response.data.data;
          setTitle(portfolioData.title);
          setContent(portfolioData.content);

          // 기존 이미지 미리보기 설정
          if (portfolioData.images && portfolioData.images.length > 0) {
            setPreviewImages(portfolioData.images.map(img => ({
              url: img.imagePath,
              isExisting: true,
              id: img.id
            })));
          }
        }
      } catch (error) {
        console.error('포트폴리오 데이터 조회 실패:', error);
        setError('포트폴리오 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 로그인 확인 후 데이터 조회
    if (checkAuth()) {
      if (isEditMode) {
        fetchPortfolioData();
      }
    }
  }, [id, isEditMode, navigate]);

  // 이미지 파일 변경 핸들러
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // 이미지 미리보기 생성
    const newPreviewImages = files.map(file => ({
      url: URL.createObjectURL(file),
      isExisting: false
    }));

    setPreviewImages(newPreviewImages);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    const portfolioData = {
      title,
      content
    };

    formData.append('request', new Blob([JSON.stringify(portfolioData)], {
      type: 'application/json'
    }));

    // 이미지 파일 추가
    if (images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    try {
      setLoading(true);
      let response;

      if (isEditMode) {
        // 수정 요청
        const updateData = {
          title,
          content
        };

        response = await axios.put(`/api/portfolio/${id}`, updateData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        // 이미지가 있는 경우 별도로 처리 (백엔드 API 구조에 따라 조정 필요)
        if (images.length > 0) {
          const imageFormData = new FormData();
          images.forEach(image => {
            imageFormData.append('images', image);
          });

          await axios.put(`/api/portfolio/${id}/images`, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
        }
      } else {
        // 생성 요청
        response = await axios.post('/api/portfolio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      }

      if (response.data.success) {
        alert(isEditMode ? '포트폴리오가 수정되었습니다.' : '포트폴리오가 생성되었습니다.');
        navigate('/portfolio');
      }
    } catch (error) {
      console.error(isEditMode ? '포트폴리오 수정 실패:' : '포트폴리오 생성 실패:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    const confirmCancel = window.confirm('작업을 취소하시겠습니까? 변경사항이 저장되지 않습니다.');
    if (confirmCancel) {
      navigate(isEditMode ? `/portfolio/${id}` : '/portfolio');
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
                type="text"
                id="title"
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">이미지</label>
            <input
                type="file"
                id="images"
                onChange={handleImageChange}
                multiple
                accept="image/*"
            />
            <p className="help-text">여러 이미지를 선택할 수 있습니다. (최대 5장)</p>
          </div>

          {previewImages.length > 0 && (
              <div className="image-preview-container">
                <h3>이미지 미리보기</h3>
                <div className="image-preview-grid">
                  {previewImages.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={image.url} alt={`미리보기 ${index + 1}`} />
                      </div>
                  ))}
                </div>
              </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              취소
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '처리 중...' : isEditMode ? '수정하기' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default PortfolioWrite;