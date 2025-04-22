package easylab.easylab.domain.board.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.QBoard;
import easylab.easylab.domain.board.entity.SearchType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@RequiredArgsConstructor
public class BoardRepositoryImpl implements BoardRepositoryCustom {

  private final JPAQueryFactory queryFactory;

  @Override
  public Page<Board> searchBoards(String search, SearchType searchType, Pageable pageable) {
    QBoard board = QBoard.board;

    BooleanBuilder builder = new BooleanBuilder();

    if (search != null && !search.trim().isEmpty()) {
      String keyword = "%" + search.toLowerCase() + "%";

      if (searchType == SearchType.TITLE) {
        builder.and(board.title.toLowerCase().like(keyword));
      } else if (searchType == SearchType.AUTHOR) {
        builder.and(board.user.name.toLowerCase().like(keyword));
      } else {
        builder.and(
            board.title.toLowerCase().like(keyword)
                .or(board.user.name.toLowerCase().like(keyword))
        );
      }
    }

    List<Board> content = queryFactory
        .selectFrom(board)
        .where(builder)
        .orderBy(board.createdAt.desc())
        .offset(pageable.getOffset())
        .limit(pageable.getPageSize())
        .fetch();

    long total = queryFactory
        .select(board.count())
        .from(board)
        .where(builder)
        .fetchOne();

    return new PageImpl<>(content, pageable, total);
  }
}

