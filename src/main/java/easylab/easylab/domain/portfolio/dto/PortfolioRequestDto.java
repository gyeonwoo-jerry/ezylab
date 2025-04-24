package easylab.easylab.domain.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record PortfolioRequestDto (
    @NotBlank(message = "제목을 입력해주세요")
    String title,
    @NotBlank(message = "내용을 입력해주세요")
    String content,
    @NotBlank(message = "url을 입력해주세요")
    String url,
    @NotBlank(message = " 타입을 입력해주세요")
    String type
){
}
