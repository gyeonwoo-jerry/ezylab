package easylab.easylab.domain.auth.filter;

import easylab.easylab.domain.auth.jwt.JwtProvider;
import easylab.easylab.domain.user.entity.Role;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements Filter {

  private final JwtProvider jwtProvider;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;

    final String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);

    final String requestUri = req.getRequestURI();

    if (requestUri.startsWith("/api/auth/join") || requestUri.startsWith("/api/auth/login") || requestUri.startsWith("/swagger-ui") || requestUri.startsWith("/v3/api-docs") || requestUri.startsWith("/swagger-resources")) {
      chain.doFilter(request, response);
      return;
    }

    if (Objects.isNull(authorizationHeader)) {
      throw new IllegalArgumentException("접근 토큰이 없습니다.");
    }

    if (jwtProvider.isTokenExpired(authorizationHeader)) {
      throw new IllegalArgumentException("토큰이 만료되었습니다.");
    }

    final Role role = jwtProvider.getUserRole(authorizationHeader);

    req.setAttribute("role", role);

    chain.doFilter(request, response);
  }
}
