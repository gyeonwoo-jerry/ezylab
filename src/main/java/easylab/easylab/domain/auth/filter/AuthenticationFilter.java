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
    final String requestUri = req.getRequestURI();

    // /api 가 아닌 경로는 필터 적용 제외 (정적 리소스 등)
    if (!requestUri.startsWith("/api")) {
      chain.doFilter(request, response);
      return;
    }

    // JWT 없이 허용할 API 경로 (ex: 로그인, 회원가입, 공개 데이터)
    if (isWhitelisted(requestUri)) {
      chain.doFilter(request, response);
      return;
    }

    // JWT 검사 대상
    final String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
    if (Objects.isNull(authorizationHeader)) {
      throw new IllegalArgumentException("접근 토큰이 없습니다.");
    }

    final String token = resolveToken(authorizationHeader);
    if (jwtProvider.isTokenExpired(token)) {
      throw new IllegalArgumentException("토큰이 만료되었습니다.");
    }

    chain.doFilter(request, response);
  }

  private boolean isWhitelisted(String uri) {
    return uri.startsWith("/api/auth/login")
        || uri.startsWith("/api/auth/join")
        || uri.startsWith("/api/boards")
        || uri.startsWith("/api/portfolios")
        || uri.startsWith("/api/portfolio")
        || uri.startsWith("/api/board");
  }

  private String resolveToken(String authorizationHeader) {
    if (authorizationHeader != null) {
      // "Bearer" 접두사와 그 뒤의 공백 제거
      return authorizationHeader.replaceFirst("(?i)^Bearer\\s+", "").trim();
    }
    return null;
  }
}
