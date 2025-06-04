package easylab.easylab.domain.portfolio.controller;

import easylab.easylab.domain.auth.resolver.AuthenticationUserId;
import easylab.easylab.domain.board.dto.BoardResponseDto;
import easylab.easylab.domain.common.response.ApiResponse;
import easylab.easylab.domain.common.response.PageResponse;
import easylab.easylab.domain.portfolio.dto.PortfolioRequestDto;
import easylab.easylab.domain.portfolio.dto.PortfolioResponseDto;
import easylab.easylab.domain.portfolio.dto.PortfolioUpdateDto;
import easylab.easylab.domain.portfolio.service.PortfolioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PortfolioController {

  private final PortfolioService portfolioService;

  @PostMapping("/portfolio")
  public ApiResponse<Void> createPortfolio (
      @RequestPart("request")
      @Valid
      PortfolioRequestDto request,
      @AuthenticationUserId
      Long userId,
      @RequestPart(value = "images", required = false)
      List<MultipartFile> images
  ) {
    portfolioService.createPortfolio(request, userId, images);
    return ApiResponse.success("포트폴리오 생성 완료", null);
  }

  @GetMapping("/portfolios")
  public ApiResponse<PageResponse<PortfolioResponseDto>> getPortfolios (
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    PageResponse<PortfolioResponseDto> portfolioList = portfolioService.getPortfolios(page, size);
    return ApiResponse.success("포트폴리오 목록 조회 성공", portfolioList);
  }

  @GetMapping("/portfolio/{portfolioId}")
  public ApiResponse<PortfolioResponseDto> getPortfolio (
      @PathVariable("portfolioId") Long portfolioId,
      HttpServletRequest request
  ) {
    return ApiResponse.success("포트폴리오 조회 성공", portfolioService.getPortfolio(portfolioId, request));
  }

  @PutMapping("/portfolio/{portfolioId}")
  public ApiResponse<Void> updatePortfolio (
      @PathVariable Long portfolioId,
      @RequestPart("update") PortfolioUpdateDto update,
      @AuthenticationUserId Long userId,
      @RequestPart(value = "images", required = false) List<MultipartFile> images,
      @RequestPart(value = "keepImageIds", required = false) List<Long> keepImageIds
  ) {
    portfolioService.updatePortfolio(portfolioId, update, userId, images, keepImageIds);
    return ApiResponse.success("포트폴리오 수정 성공", null);
  }

  @DeleteMapping("/portfolio/{portfolioId}")
  public ApiResponse<Void> deletePortfolio (
      @PathVariable("portfolioId") Long portfolioId,
      @AuthenticationUserId Long userId
  ) {
    portfolioService.deletePortfolio(portfolioId, userId);
    return ApiResponse.success("포트폴리오 삭제 성공", null);
  }
}
