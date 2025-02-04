package easylab.easylab.domain.board.dto;

import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.BoardImage;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;

@Getter
public class BoardResponseDto {
  String title;
  String content;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  List<String> images;

  public BoardResponseDto(Board board) {
    this.title = board.getTitle();
    this.content = board.getContent();
    this.createdAt = board.getCreatedAt();
    this.updatedAt = board.getUpdatedAt();
    this.images = board.getImages().stream().map(BoardImage::getImagePath).toList();
  }
}
