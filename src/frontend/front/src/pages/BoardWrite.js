import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/boardWrite.css';

function BoardWrite() {
  const navigate = useNavigate();

  // 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 이미지 삭제
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 첨부파일 삭제
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // 폼 제출
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

      // JSON 데이터 생성
      const requestData = { title: title.trim(), content: content.trim() };
      const jsonBlob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
      formData.append('request', jsonBlob);

      // 이미지 추가 (유효한 파일만)
      if (images && images.length > 0) {
        Array.from(images).forEach((file) => {
          if (file && file.size > 0) {
            formData.append('images', file);
          }
        });
      }

      // 첨부파일 추가 (유효한 파일만)
      if (attachments && attachments.length > 0) {
        Array.from(attachments).forEach((file) => {
          if (file && file.size > 0) {
            formData.append('attachments', file);
          }
        });
      }

      console.log('게시글 등록 요청 시작...');
      const response = await API.post('/board', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert('게시글이 등록되었습니다.');
        navigate('/board', { replace: true });
      } else {
        alert(response.data.message || '등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('등록 오류:', error);

      if (error.response) {
        alert(`서버 오류 (${error.response.status}): ${
            error.response.data?.message || '서버에서 오류가 발생했습니다.'
        }`);
      } else if (error.request) {
        alert('서버로부터 응답을 받지 못했습니다. 네트워크를 확인해주세요.');
      } else {
        alert(`요청 오류: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 취소
  const handleCancel = () => {
    if (window.confirm('작업을 취소하시겠습니까? 작성한 내용이 삭제됩니다.')) {
      navigate('/board', { replace: true });
    }
  };

  return (
      <div className="board-write-container">
        <div className="board-write-header">
          <h2>게시글 작성</h2>
        </div>

        <form onSubmit={handleSubmit} className="board-write-form">
          {/* 제목 */}
          <div className="form-group">
            <label htmlFor="title">제목 *</label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
                disabled={loading}
            />
          </div>

          {/* 내용 */}
          <div className="form-group">
            <label htmlFor="content">내용 *</label>
            <textarea
                id="content"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                required
                disabled={loading}
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="form-group">
            <label htmlFor="images">이미지 업로드</label>
            <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files).filter(file =>
                      file && file.size > 0 && file.type.startsWith('image/')
                  );
                  if (files.length !== e.target.files.length) {
                    alert('일부 파일이 유효하지 않아 제외되었습니다.');
                  }
                  setImages(files);
                }}
                disabled={loading}
            />
            {images.length > 0 && (
                <div className="new-files-container">
                  <h4>선택된 이미지:</h4>
                  {Array.from(images).map((file, index) => (
                      <div key={index} className="new-file-item">
                        <div className="image-preview">
                          <img
                              src={URL.createObjectURL(file)}
                              alt={`이미지 ${index + 1}`}
                          />
                        </div>
                        <span className="file-name">{file.name}</span>
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="btn-remove"
                            title="이미지 제거"
                        >
                          ✕
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* 첨부파일 업로드 */}
          <div className="form-group">
            <label htmlFor="attachments">첨부파일 업로드</label>
            <input
                id="attachments"
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files).filter(file =>
                      file && file.size > 0
                  );
                  if (files.length !== e.target.files.length) {
                    alert('일부 파일이 유효하지 않아 제외되었습니다.');
                  }
                  setAttachments(files);
                }}
                disabled={loading}
            />
            {attachments.length > 0 && (
                <div className="new-files-container">
                  <h4>선택된 첨부파일:</h4>
                  {Array.from(attachments).map((file, index) => (
                      <div key={index} className="new-file-item">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                        <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="btn-remove"
                            title="파일 제거"
                        >
                          ✕
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="form-actions">
            <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
                disabled={loading}
            >
              취소
            </button>
            <button
                type="submit"
                className="btn-submit"
                disabled={loading}
            >
              {loading ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
  );
}

export default BoardWrite;