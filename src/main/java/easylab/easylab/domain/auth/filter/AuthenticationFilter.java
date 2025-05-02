package easylab.easylab.domain.auth.filter;

import easylab.easylab.domain.auth.jwt.JwtProvider;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements Filter {

  private final JwtProvider jwtProvider;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    String uri = req.getRequestURI();
    final String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
    // JWT 없이 접근 가능한 경로 예외 처리
    if (uri.startsWith("/api/boards") || uri.startsWith("/api/portfolios") || uri.startsWith("/api/auth")) {
      chain.doFilter(request, response);
      return;
    }

    if (Objects.isNull(authorizationHeader)) {
      throw new IllegalArgumentException("접근 토큰이 없습니다.");
    }

    // Bearer 제거
    final String token = resolveToken(authorizationHeader);

    if (jwtProvider.isTokenExpired(token)) {
      throw new IllegalArgumentException("토큰이 만료되었습니다.");
    }

    chain.doFilter(request, response);
  }

  private String resolveToken(String authorizationHeader) {
    if (authorizationHeader != null) {
      // "Bearer" 접두사와 그 뒤의 공백 제거
      return authorizationHeader.replaceFirst("(?i)^Bearer\\s+", "").trim();
    }
    return null;
  }
}
