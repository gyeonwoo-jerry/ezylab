import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import "../styles/boardDetail.css";

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 로그인 정보 가져오기 (AuthContext 없이)
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = !!userInfo;
  const isAuthor = userInfo && userInfo.name === post?.author;

  useEffect(() => {
    if (isLoaded) return;

    const fetchPostDetails = async () => {
      try {
        const res = await API.get(`/board/${id}`);
        console.log("게시글 데이터:", res.data.content); // 디버깅용
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
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/board/${id}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/board");
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 수정 버튼 핸들러 - BoardEdit으로 라우팅 변경
  const handleEdit = () => {
    // URL 파라미터와 state 둘 다 전달 (안전성을 위해)
    navigate(`/board/edit/${id}`, { state: { post } });
  };

  if (loading) return <div className="board-detail-loading">로딩 중...</div>;
  if (error) return <div className="board-detail-error">{error}</div>;
  if (!post)
    return <div className="board-detail-error">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="board-detail-container">
      <div className="board-detail-header">
        <h1 className="board-detail-title">{post.title}</h1>
        <div className="board-detail-info">
          <span className="author">작성자: {post.author}</span>
          <span className="date">
            작성일: {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="views">조회수: {post.viewCount}</span>
        </div>
      </div>

      <div className="board-detail-content">
        {post.content.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      {/* 첨부 이미지 섹션 */}
      {post.images && post.images.length > 0 && (
        <div className="board-detail-images">
          <h3>📸 첨부 이미지 ({post.images.length}개)</h3>
          <div className="images-grid">
            {post.images.map((image, index) => {
              // ImageResponse 구조: { id, url }
              const imageSrc = `http://211.110.44.28:8580${image.url}`;

              return (
                <div key={index} className="image-item">
                  <img
                    src={imageSrc}
                    alt={`게시글 이미지 ${index + 1}`}
                    className="board-detail-image"
                    onError={(e) => {
                      console.error("이미지 로드 실패:", imageSrc);
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div className="image-error" style={{ display: "none" }}>
                    이미지를 불러올 수 없습니다
                  </div>
                  <div className="image-info">
                    이미지 {index + 1} (ID: {image.id})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 첨부파일 섹션 */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="board-detail-attachments">
          <h3>📎 첨부파일 ({post.attachments.length}개)</h3>
          <div className="attachment-list">
            {post.attachments.map((attachment, index) => {
              // 파일 확장자별 아이콘
              const fileExtension =
                attachment.originalFileName?.split(".").pop()?.toLowerCase() ||
                "";
              const getFileIcon = (ext) => {
                switch (ext) {
                  case "pdf":
                    return "📄";
                  case "doc":
                  case "docx":
                    return "📝";
                  case "xls":
                  case "xlsx":
                    return "📊";
                  case "ppt":
                  case "pptx":
                    return "📋";
                  case "zip":
                  case "rar":
                    return "🗜️";
                  case "txt":
                    return "📃";
                  default:
                    return "📎";
                }
              };

              return (
                <div key={index} className="attachment-item">
                  <div className="attachment-icon">
                    {getFileIcon(fileExtension)}
                  </div>
                  <div className="attachment-details">
                    <a
                      href={`http://211.110.44.28:8580${attachment.filePath}`}
                      download={attachment.originalFileName}
                      className="attachment-link"
                    >
                      <strong>{attachment.originalFileName}</strong>
                    </a>
                    <div className="attachment-meta">
                      <span className="attachment-id">ID: {attachment.id}</span>
                      <span className="attachment-type">
                        {fileExtension.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="attachment-actions">
                    <a
                      href={`http://211.110.44.28:8580${attachment.filePath}`}
                      download={attachment.originalFileName}
                      className="download-btn"
                      title="다운로드"
                    >
                      ⬇️
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 첨부파일이 없을 때 */}
      {(!post.images || post.images.length === 0) &&
        (!post.attachments || post.attachments.length === 0) && (
          <div className="no-attachments">
            <p>첨부된 파일이 없습니다.</p>
          </div>
        )}

      <div className="board-detail-actions">
        <button
          className="board-button back"
          onClick={() => navigate("/board")}
        >
          목록으로
        </button>

        {isLoggedIn && (
          <div className="logged-in-actions">
            {isAuthor ? (
              <>
                <button className="board-button edit" onClick={handleEdit}>
                  수정
                </button>
                <button className="board-button delete" onClick={handleDelete}>
                  삭제
                </button>
              </>
            ) : (
              <span className="action-message">
                작성자만 수정/삭제할 수 있습니다
              </span>
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
