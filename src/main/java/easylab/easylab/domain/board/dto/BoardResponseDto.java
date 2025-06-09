package easylab.easylab.domain.board.dto;

import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.common.response.AttachmentResponse;
import easylab.easylab.domain.common.response.ImageResponse;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record BoardResponseDto(
    Long id,
    String title,
    String content,
    String author,
    List<ImageResponse> images,
    List<AttachmentResponse> attachments,
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
        .images(board.getImages().stream()
            .map(img -> new ImageResponse(img.getId(), img.getImagePath()))
            .toList())
        .attachments(board.getAttachments().stream()  // 첨부파일 매핑
            .map(att -> new AttachmentResponse(
                att.getId(),
                att.getFilePath(),
                att.getOriginalFileName()
            ))
            .toList())
        .viewCount(board.getViewCount())
        .createdAt(board.getCreatedAt())
        .modifiedAt(board.getModifiedAt())
        .build();
  }
}
