package easylab.easylab.domain.portfolio.dto;

import easylab.easylab.domain.common.response.ImageResponse;
import easylab.easylab.domain.portfolio.entity.Portfolio;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record PortfolioResponseDto(
    Long id,
    String title,
    String content,
    String author,
    List<ImageResponse> images,
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
        .images(portfolio.getImages().stream()
            .map(img -> new ImageResponse(img.getId(), img.getImagePath()))
            .toList())
        .viewCount(portfolio.getViewCount())
        .createdAt(portfolio.getCreatedAt())
        .modifiedAt(portfolio.getModifiedAt())
        .build();
  }
}