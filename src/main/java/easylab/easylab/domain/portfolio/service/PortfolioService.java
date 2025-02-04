package easylab.easylab.domain.portfolio.service;

import easylab.easylab.domain.portfolio.dto.PortfolioRequestDto;
import easylab.easylab.domain.portfolio.dto.PortfolioResponseDto;
import easylab.easylab.domain.portfolio.entity.Portfolio;
import easylab.easylab.domain.portfolio.repository.PortfolioRepository;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PortfolioService {

  private final PortfolioRepository portfolioRepository;
  private final UserRepository userRepository;

  public PortfolioResponseDto createPortfolio(PortfolioRequestDto request, Long userId) {
    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    Portfolio portfolio = Portfolio.of(user, request.title(), request.content());

    Portfolio savedPortfolio = portfolioRepository.save(portfolio);

    PortfolioResponseDto responseDto = new PortfolioResponseDto(savedPortfolio);
    
    return responseDto;
  }

  @Transactional(readOnly = true)
  public Page<PortfolioResponseDto> getPortfolios(int page, int size, String sortBy, boolean isAsc) {
    Sort.Direction direction = isAsc ? Sort.Direction.ASC : Sort.Direction.DESC;
    Sort sort = Sort.by(direction, sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);

    Page<Portfolio> portfolios = portfolioRepository.findAll(pageable);

    return portfolios.map(PortfolioResponseDto::new);
  }


  public PortfolioResponseDto updatePortfolio(Long portfolioId, PortfolioRequestDto request, Long userId) {
    Portfolio portfolio = portfolioRepository.findById(portfolioId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if(!userId.equals(user.getId())) {
      throw new IllegalArgumentException("수정 권한이 없습니다.");
    }

    portfolio.updatePortfolio(request.title(), request.content());

    return new PortfolioResponseDto(portfolio);
  }

  public void deletePortfolio(Long portfolioId, Long userId) {
    Portfolio portfolio = portfolioRepository.findById(portfolioId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if(!userId.equals(user.getId())) {
      throw new IllegalArgumentException("삭제 권한이 없습니다.");
    }

    portfolioRepository.delete(portfolio);
  }
}
