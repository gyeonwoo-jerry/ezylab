package easylab.easylab.domain.portfolio.dto;

import java.util.Optional;

public record PortfolioUpdateDto(
    Optional<String> title,
    Optional<String> content,
    Optional<String> url,
    Optional<String> type
) {

}
