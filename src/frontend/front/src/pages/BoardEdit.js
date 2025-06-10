import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/boardWrite.css';

const BoardEdit = () => {
  const { id } = useParams(); // boardId가 아니라 id로 변경
  const navigate = useNavigate();

  console.log('BoardEdit 컴포넌트 렌더링, id:', id); // 디버깅

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // 기존 파일들
  const [existingImages, setExistingImages] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  // 새 파일들
  const [newImages, setNewImages] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);

  // 삭제 예정 파일들
  const [imagesToDelete, setImagesToDelete] = useState(new Set());
  const [attachmentsToDelete, setAttachmentsToDelete] = useState(new Set());

  // 게시글 데이터 로드
  useEffect(() => {
    console.log('useEffect 실행됨, id:', id); // 디버깅

    const fetchBoard = async () => {
      try {
        setLoading(true);
        console.log('API 호출 시작:', `/board/${id}`); // 디버깅

        const response = await API.get(`/board/${id}`);
        console.log('API 응답:', response); // 디버깅
        console.log('응답 데이터:', response.data); // 디버깅

        // BoardDetail과 동일하게 data.content로 접근
        const boardData = response.data.content;
        console.log('게시글 데이터:', boardData); // 디버깅

        setFormData({
          title: boardData.title,
          content: boardData.content
        });

        setExistingImages(boardData.images || []);
        setExistingAttachments(boardData.attachments || []);

        console.log('데이터 설정 완료'); // 디버깅

      } catch (err) {
        console.error('게시글 로드 실패 - 전체 에러:', err);
        console.error('에러 응답:', err.response);
        console.error('에러 메시지:', err.message);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBoard();
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
    setNewImages(prev => [...prev, ...files]);
  };

  // 새 첨부파일 추가
  const handleNewAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setNewAttachments(prev => [...prev, ...files]);
  };

  // 새 이미지 삭제
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // 새 첨부파일 삭제
  const removeNewAttachment = (index) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
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

  // 기존 첨부파일 삭제 토글
  const toggleAttachmentDeletion = (attachmentId) => {
    setAttachmentsToDelete(prev => {
      const newSet = new Set(prev);
      if (newSet.has(attachmentId)) {
        newSet.delete(attachmentId);
      } else {
        newSet.add(attachmentId);
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

      formDataToSend.append('update', new Blob([JSON.stringify(updateData)], {
        type: 'application/json'
      }));

      // 새 이미지 파일들 추가
      if (newImages.length > 0) {
        newImages.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      // 새 첨부파일들 추가
      if (newAttachments.length > 0) {
        newAttachments.forEach(attachment => {
          formDataToSend.append('attachments', attachment);
        });
      }

      // 유지할 이미지 ID들
      const keepImageIds = existingImages
      .filter(img => !imagesToDelete.has(img.id))
      .map(img => img.id);

      if (keepImageIds.length > 0) {
        formDataToSend.append('keepImageIds', new Blob([JSON.stringify(keepImageIds)], {
          type: 'application/json'
        }));
      }

      // 유지할 첨부파일 ID들
      const keepAttachmentIds = existingAttachments
      .filter(att => !attachmentsToDelete.has(att.id))
      .map(att => att.id);

      if (keepAttachmentIds.length > 0) {
        formDataToSend.append('keepAttachmentIds', new Blob([JSON.stringify(keepAttachmentIds)], {
          type: 'application/json'
        }));
      }

      await API.put(`/board/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/board/${id}`);

    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert(error.response?.data?.message || '게시글 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      navigate(`/board/${id}`);
    }
  };

  if (loading) {
    return (
        <div className="board-write-container">
          <div className="loading">게시글을 불러오는 중...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="board-write-container">
          <div className="error">
            <h3>오류 발생</h3>
            <p>{error}</p>
            <button className="btn-secondary" onClick={() => navigate('/board')}>
              목록으로 돌아가기
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="board-write-container">
        <div className="board-write-header">
          <h2>게시글 수정</h2>
        </div>

        <form className="board-write-form" onSubmit={handleSubmit}>
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
                placeholder="내용을 입력하세요"
                disabled={submitting}
                required
            />
          </div>

          {/* 기존 이미지 */}
          {existingImages.length > 0 && (
              <div className="form-group">
                <label>기존 이미지</label>
                <div className="existing-files-container">
                  {existingImages.map((image) => (
                      <div
                          key={image.id}
                          className={`existing-file-item ${
                              imagesToDelete.has(image.id) ? 'marked-for-deletion' : ''
                          }`}
                      >
                        <div className="image-preview">
                          <img
                              src={image.imagePath}
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
                            onClick={() => toggleImageDeletion(image.id)}
                            disabled={submitting}
                        >
                          {imagesToDelete.has(image.id) ? '↶' : '×'}
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

          {/* 기존 첨부파일 */}
          {existingAttachments.length > 0 && (
              <div className="form-group">
                <label>기존 첨부파일</label>
                <div className="existing-files-container">
                  {existingAttachments.map((attachment) => (
                      <div
                          key={attachment.id}
                          className={`existing-file-item ${
                              attachmentsToDelete.has(attachment.id) ? 'marked-for-deletion' : ''
                          }`}
                      >
                        <div className="file-name">{attachment.originalFileName}</div>
                        <button
                            type="button"
                            className="btn-remove"
                            onClick={() => toggleAttachmentDeletion(attachment.id)}
                            disabled={submitting}
                        >
                          {attachmentsToDelete.has(attachment.id) ? '↶' : '×'}
                        </button>
                      </div>
                  ))}
                </div>
                {attachmentsToDelete.size > 0 && (
                    <div className="deletion-notice">
                      {attachmentsToDelete.size}개의 첨부파일이 삭제 예정입니다.
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
            <div className="form-help">이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF 등)</div>

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

          {/* 새 첨부파일 업로드 */}
          <div className="form-group">
            <label htmlFor="attachments">새 첨부파일 추가</label>
            <input
                type="file"
                id="attachments"
                multiple
                onChange={handleNewAttachmentChange}
                disabled={submitting}
            />
            <div className="form-help">모든 파일 형식을 업로드할 수 있습니다.</div>

            {newAttachments.length > 0 && (
                <div className="new-files-container">
                  <h4>새로 추가될 첨부파일</h4>
                  {newAttachments.map((attachment, index) => (
                      <div key={index} className="new-file-item">
                        <div className="file-name">{attachment.name}</div>
                        <div className="file-size">{formatFileSize(attachment.size)}</div>
                        <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeNewAttachment(index)}
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

export default BoardEdit;