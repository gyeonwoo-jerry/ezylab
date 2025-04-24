package easylab.easylab.domain.board.repository;

import easylab.easylab.domain.board.entity.BoardAttachment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardAttachmentRepository extends JpaRepository<BoardAttachment, Long> {

  List<BoardAttachment> findByBoardId(Long id);
}
