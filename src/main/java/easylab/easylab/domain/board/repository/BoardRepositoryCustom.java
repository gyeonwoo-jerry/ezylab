package easylab.easylab.domain.board.repository;

import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.SearchType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardRepositoryCustom {
  Page<Board> searchBoards(String search, SearchType searchType, Pageable pageable);
}
