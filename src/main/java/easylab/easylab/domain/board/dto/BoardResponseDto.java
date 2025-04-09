package easylab.easylab.domain.board.dto;

import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.BoardImage;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record BoardResponseDto(
    Long id,
    String title,
    String content,
    String author,
    List<String> images,
    Long viewCount,
    LocalDateTime createdAt,
    LocalDateTime modifiedAt
) {
  public static BoardResponseDto from(Board board) {
    return BoardResponseDto.builder()
        .id(board.getId())
        .title(board.getTitle())
        .content(board.getContent())
        .author(board.getUser().getName())
        .images(board.getImages().stream().map(BoardImage::getImagePath).toList())
        .viewCount(board.getViewCount())
        .createdAt(board.getCreatedAt())
        .modifiedAt(board.getModifiedAt())
        .build();
  }
}
