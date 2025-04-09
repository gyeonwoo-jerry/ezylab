package easylab.easylab.domain.portfolio.dto;

import easylab.easylab.domain.board.dto.BoardResponseDto;
import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.BoardImage;
import easylab.easylab.domain.portfolio.entity.Portfolio;
import easylab.easylab.domain.portfolio.entity.PortfolioImage;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Builder
public record PortfolioResponseDto(
    Long id,
    String title,
    String content,
    String author,
    List<String> images,
    Long viewCount,
    LocalDateTime createdAt,
    LocalDateTime modifiedAt
) {
  public static PortfolioResponseDto from(Portfolio portfolio) {
    return PortfolioResponseDto.builder()
        .id(portfolio.getId())
        .title(portfolio.getTitle())
        .content(portfolio.getContent())
        .author(portfolio.getUser().getName())
        .images(portfolio.getImages().stream().map(PortfolioImage::getImagePath).toList())
        .viewCount(portfolio.getViewCount())
        .createdAt(portfolio.getCreatedAt())
        .modifiedAt(portfolio.getModifiedAt())
        .build();
  }
}