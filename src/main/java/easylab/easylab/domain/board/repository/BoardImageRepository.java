package easylab.easylab.domain.board.repository;

import easylab.easylab.domain.board.entity.BoardImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {

  List<BoardImage> findByBoardId(Long id);
}
