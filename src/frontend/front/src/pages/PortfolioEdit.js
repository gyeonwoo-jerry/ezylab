import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/portfolioWrite.css';

const PortfolioEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log('PortfolioEdit 컴포넌트 렌더링, id:', id); // 디버깅

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    url: '',
    type: ''
  });

  // 기존 이미지들
  const [existingImages, setExistingImages] = useState([]);

  // 새 이미지들
  const [newImages, setNewImages] = useState([]);

  // 삭제 예정 이미지들
  const [imagesToDelete, setImagesToDelete] = useState(new Set());

  // 포트폴리오 데이터 로드
  useEffect(() => {
    console.log('useEffect 실행됨, id:', id); // 디버깅

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        console.log('API 호출 시작:', `/portfolio/${id}`); // 디버깅

        const response = await API.get(`/portfolio/${id}`);
        console.log('API 응답:', response); // 디버깅
        console.log('응답 데이터:', response.data); // 디버깅

        // PortfolioDetail과 동일하게 data.content로 접근
        const portfolioData = response.data.content;
        console.log('포트폴리오 데이터:', portfolioData); // 디버깅

        setFormData({
          title: portfolioData.title || '',
          content: portfolioData.content || '',
          url: portfolioData.url || '',
          type: portfolioData.type || ''
        });

        setExistingImages(portfolioData.images || []);

        console.log('데이터 설정 완료'); // 디버깅

      } catch (err) {
        console.error('포트폴리오 로드 실패 - 전체 에러:', err);
        console.error('에러 응답:', err.response);
        console.error('에러 메시지:', err.message);
        setError('포트폴리오를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPortfolio();
    } else {
      console.log('id가 없음:', id); // 디버깅
    }
  }, [id]);

  // 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 새 이미지 파일 추가
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length - imagesToDelete.size + newImages.length + files.length;

    if (totalImages > 5) {
      alert('총 이미지는 최대 5장까지만 가능합니다.');
      return;
    }

    setNewImages(prev => [...prev, ...files]);
  };

  // 새 이미지 삭제
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // 기존 이미지 삭제 토글
  const toggleImageDeletion = (imageId) => {
    setImagesToDelete(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 이미지 미리보기 URL 생성
  const getImagePreviewUrl = (file) => {
    return URL.createObjectURL(file);
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();

      // 업데이트 데이터 추가
      const updateData = {};
      if (formData.title.trim()) updateData.title = formData.title.trim();
      if (formData.content.trim()) updateData.content = formData.content.trim();
      if (formData.url.trim()) updateData.url = formData.url.trim();
      if (formData.type.trim()) updateData.type = formData.type.trim();

      formDataToSend.append('update', new Blob([JSON.stringify(updateData)], {
        type: 'application/json'
      }));

      // 새 이미지 파일들 추가
      if (newImages.length > 0) {
        newImages.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      // 유지할 이미지 ID들 (백엔드가 keepImageIds를 받는다고 가정)
      const keepImageIds = existingImages
      .filter(img => !imagesToDelete.has(img.id))
      .map(img => img.id);

      if (keepImageIds.length > 0) {
        formDataToSend.append('keepImageIds', new Blob([JSON.stringify(keepImageIds)], {
          type: 'application/json'
        }));
      }

      await API.put(`/portfolio/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('포트폴리오가 성공적으로 수정되었습니다.');
      navigate(`/portfolio/${id}`);

    } catch (error) {
      console.error('포트폴리오 수정 실패:', error);
      alert(error.response?.data?.message || '포트폴리오 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      navigate(`/portfolio/${id}`);
    }
  };

  if (loading) {
    return (
        <div className="portfolio-form-container">
          <div className="loading">포트폴리오를 불러오는 중...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="portfolio-form-container">
          <div className="error">
            <h3>오류 발생</h3>
            <p>{error}</p>
            <button className="btn-secondary" onClick={() => navigate('/portfolio')}>
              목록으로 돌아가기
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="portfolio-form-container">
        <div className="portfolio-form-header">
          <h2>포트폴리오 수정</h2>
        </div>

        <form className="portfolio-form" onSubmit={handleSubmit}>
          {/* 제목 입력 */}
          <div className="form-group">
            <label htmlFor="title">제목 *</label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="제목을 입력하세요"
                disabled={submitting}
                required
            />
          </div>

          {/* 내용 입력 */}
          <div className="form-group">
            <label htmlFor="content">내용 *</label>
            <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="포트폴리오 내용을 입력하세요"
                disabled={submitting}
                required
            />
          </div>

          {/* URL 입력 */}
          <div className="form-group">
            <label htmlFor="url">관련 URL</label>
            <input
                type="text"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="프로젝트 관련 링크를 입력하세요 (선택)"
                disabled={submitting}
            />
          </div>

          {/* 타입 입력 */}
          <div className="form-group">
            <label htmlFor="type">분류</label>
            <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="예: 웹 개발, 모바일 앱, 디자인 등 (선택)"
                disabled={submitting}
            />
          </div>

          {/* 기존 이미지 */}
          {existingImages.length > 0 && (
              <div className="form-group">
                <label>기존 이미지</label>
                <div className="existing-files-container">
                  {existingImages.map((image, index) => (
                      <div
                          key={image.id || index}
                          className={`existing-file-item ${
                              imagesToDelete.has(image.id || index) ? 'marked-for-deletion' : ''
                          }`}
                      >
                        <div className="image-preview">
                          <img
                              src={`http://211.110.44.79:48080${image}`}
                              alt="기존 이미지"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                          />
                          <div className="image-error" style={{ display: 'none' }}>
                            이미지를 불러올 수 없습니다
                          </div>
                        </div>
                        <button
                            type="button"
                            className="btn-remove"
                            onClick={() => toggleImageDeletion(image.id || index)}
                            disabled={submitting}
                        >
                          {imagesToDelete.has(image.id || index) ? '↶' : '×'}
                        </button>
                      </div>
                  ))}
                </div>
                {imagesToDelete.size > 0 && (
                    <div className="deletion-notice">
                      {imagesToDelete.size}개의 이미지가 삭제 예정입니다.
                    </div>
                )}
              </div>
          )}

          {/* 새 이미지 업로드 */}
          <div className="form-group">
            <label htmlFor="images">새 이미지 추가</label>
            <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleNewImageChange}
                disabled={submitting}
            />
            <div className="form-help">이미지 파일만 업로드 가능합니다. 기존 이미지 포함 총 5장까지 가능합니다.</div>

            {newImages.length > 0 && (
                <div className="new-files-container">
                  <h4>새로 추가될 이미지</h4>
                  {newImages.map((image, index) => (
                      <div key={index} className="new-file-item">
                        <div className="image-preview">
                          <img src={getImagePreviewUrl(image)} alt={`새 이미지 ${index + 1}`} />
                        </div>
                        <div className="file-name">{image.name}</div>
                        <div className="file-size">{formatFileSize(image.size)}</div>
                        <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeNewImage(index)}
                            disabled={submitting}
                        >
                          ×
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* 폼 액션 버튼 */}
          <div className="form-actions">
            <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={submitting}
            >
              취소
            </button>
            <button
                type="submit"
                className="btn-submit"
                disabled={submitting}
            >
              {submitting ? '수정 중...' : '수정하기'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default PortfolioEdit;