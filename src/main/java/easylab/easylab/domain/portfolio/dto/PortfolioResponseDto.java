package easylab.easylab.domain.portfolio.dto;

import easylab.easylab.domain.portfolio.entity.Portfolio;
import java.time.LocalDateTime;
import lombok.Getter;

@Getter
public class PortfolioResponseDto {
  String title;
  String content;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;

  public PortfolioResponseDto(Portfolio portfolio) {
    this.title = portfolio.getTitle();
    this.content = portfolio.getContent();
    this.createdAt = portfolio.getCreatedAt();
    this.updatedAt = portfolio.getUpdatedAt();
  }
}
