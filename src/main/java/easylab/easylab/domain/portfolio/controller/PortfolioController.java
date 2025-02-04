package easylab.easylab.domain.portfolio.controller;

import easylab.easylab.domain.auth.resolver.AuthenticationUserId;
import easylab.easylab.domain.board.dto.BoardResponseDto;
import easylab.easylab.domain.portfolio.dto.PortfolioRequestDto;
import easylab.easylab.domain.portfolio.dto.PortfolioResponseDto;
import easylab.easylab.domain.portfolio.service.PortfolioService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PortfolioController {

  private final PortfolioService portfolioService;

  @PostMapping("/portfolio")
  public ResponseEntity<PortfolioResponseDto> createPortfolio (
      @RequestBody PortfolioRequestDto request,
      @AuthenticationUserId Long userId
  ) {
    PortfolioResponseDto responseDto = portfolioService.createPortfolio(request, userId);
    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping("/portfolios")
  public ResponseEntity<Page<PortfolioResponseDto>> getPortfolios (
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "createdAt") String sortBy,
      @RequestParam(defaultValue = "true") boolean isAsc
  ) {
    Page<PortfolioResponseDto> responseDto = portfolioService.getPortfolios(page-1, size, sortBy, isAsc);
    return ResponseEntity.status(HttpStatus.OK).body(responseDto);
  }

  @PutMapping("/{portfolioId}")
  public ResponseEntity<PortfolioResponseDto> updatePortfolio (
      @PathVariable Long portfolioId,
      @RequestBody PortfolioRequestDto request,
      @AuthenticationUserId Long userId
  ) {
    PortfolioResponseDto responseDto = portfolioService.updatePortfolio(portfolioId, request, userId);
    return ResponseEntity.status(HttpStatus.OK).body(responseDto);
  }

  @DeleteMapping("/{portfolioId}")
  public ResponseEntity<Void> deletePortfolio (
      @PathVariable Long portfolioId,
      @AuthenticationUserId Long userId
  ) {
    portfolioService.deletePortfolio(portfolioId, userId);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
