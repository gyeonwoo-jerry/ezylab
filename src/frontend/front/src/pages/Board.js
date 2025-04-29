import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/board.css';

function Board() {
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('TITLE');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const navigate = useNavigate();

  const fetchBoards = (page, searchTerm = '', searchType = 'TITLE') => {
    fetch(`/api/boards?page=${page}&size=10&search=${searchTerm}&searchType=${searchType}`)
    .then(res => res.json())
    .then(data => {
      setBoards(data.data.content);
      setHasNextPage(!data.data.last);
    })
    .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBoards(page, searchTerm, searchType);
  }, [page, searchTerm, searchType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBoards(1, searchTerm, searchType);
  };

  return (
      <div className="board-container">
        <h1 className="board-title"></h1>

        <ul className="board-list">
          {boards.length > 0 ? (
              boards.map(board => (
                  <li
                      key={board.id}
                      className="board-item"
                      onClick={() => navigate(`/board/${board.id}`)}
                  >
                    <strong>{board.title}</strong>
                    <span>by {board.username} | 조회수: {board.viewCount}</span>
                  </li>
              ))
          ) : (
              <li className="board-empty">게시글이 없습니다.</li>
          )}
        </ul>

        <div className="board-bottom-controls">
          <form className="board-search" onSubmit={handleSearch}>
            <select
                className="search-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="TITLE">제목</option>
              <option value="AUTHOR">작성자</option>
              <option value="ALL">제목+작성자</option>
            </select>
            <input
                type="text"
                placeholder={searchType === "AUTHOR" ? "작성자로 검색" : "제목으로 검색"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">검색</button>
          </form>

          <div className="board-pagination">
            <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
            >
              ◀ 이전
            </button>
            <span>{page} 페이지</span>
            <button
                disabled={!hasNextPage}
                onClick={() => setPage(prev => prev + 1)}
            >
              다음 ▶
            </button>
          </div>
        </div>
      </div>
  );
}

export default Board;
