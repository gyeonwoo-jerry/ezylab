package easylab.easylab.domain.portfolio.service;

import easylab.easylab.domain.board.dto.BoardResponseDto;
import easylab.easylab.domain.common.response.PageResponse;
import easylab.easylab.domain.portfolio.dto.PortfolioRequestDto;
import easylab.easylab.domain.portfolio.dto.PortfolioResponseDto;
import easylab.easylab.domain.portfolio.dto.PortfolioUpdateDto;
import easylab.easylab.domain.portfolio.entity.Portfolio;
import easylab.easylab.domain.portfolio.repository.PortfolioRepository;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class PortfolioService {

  private final PortfolioRepository portfolioRepository;
  private final UserRepository userRepository;
  private final PortfolioImageService portfolioImageService;

  public void createPortfolio(PortfolioRequestDto request, Long userId, List<MultipartFile> images) {
    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    Portfolio portfolio = Portfolio.builder()
        .title(request.title())
        .content(request.content())
        .url(request.url())
        .type(request.type())
        .user(user)
        .build();

    portfolioRepository.save(portfolio);

    portfolioImageService.uploadImage(portfolio, images);
  }

  @Transactional(readOnly = true)
  public PageResponse<PortfolioResponseDto> getPortfolios(int page, int size) {
    PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));

    Page<Portfolio> portfolios = portfolioRepository.findAll(pageRequest);

    Page<PortfolioResponseDto> allPortfolio = portfolios.map(PortfolioResponseDto::from);

    return PageResponse.fromPage(allPortfolio);
  }

  public PortfolioResponseDto getPortfolio(Long portfolioId, HttpServletRequest request) {
    Portfolio portfolio = portfolioRepository.findById(portfolioId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    HttpSession session = request.getSession();
    String sessionKey = "viewed_portfolio_" + portfolioId;

    if (session.getAttribute(sessionKey) == null) {
      portfolio.increaseViewCount(); // 처음 본 경우에만 조회수 증가
      session.setAttribute(sessionKey, true);
      session.setMaxInactiveInterval(60 * 60); // 1시간 유지
    }

    return PortfolioResponseDto.from(portfolio);
  }

  public void updatePortfolio(Long portfolioId, PortfolioUpdateDto update, Long userId, List<MultipartFile> images, List<Long> keepImageIds) {
    Portfolio portfolio = portfolioRepository.findById(portfolioId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if (!portfolio.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("게시글 수정 권한이 없습니다.");
    }

    portfolio.updatePortfolio(update);

    portfolioImageService.updateImages(portfolio, images, keepImageIds);
  }

  public void deletePortfolio(Long portfolioId, Long userId) {
    Portfolio portfolio = portfolioRepository.findById(portfolioId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if (!portfolio.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("게시글 수정 권한이 없습니다.");
    }

    portfolio.softDelete();
  }
}
