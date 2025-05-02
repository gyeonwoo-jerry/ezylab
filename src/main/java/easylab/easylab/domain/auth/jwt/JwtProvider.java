package easylab.easylab.domain.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor  // 생성자 주입 사용
public class JwtProvider {

  private final SecretKey secretKey;  // Bean으로 주입

  public String createToken(final Long id) {
    final Date now = new Date();
    final Claims claims = Jwts.claims().setSubject(String.valueOf(id));
    return Jwts.builder()
        .setClaims(claims)
        .setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + (30 * 60 * 1000L)))
        .signWith(SignatureAlgorithm.HS256, secretKey)  // 인코딩된 키가 아닌 SecretKey 객체 직접 사용
        .compact();
  }

  public Long getPayload(final String token) {
    try {
      String sub = getClaims(token)
          .getBody()
          .get("sub", String.class);
      return Long.parseLong(sub);
    } catch (Exception e) {
      log.error("Failed to get payload: {}", e.getMessage());
      throw new IllegalArgumentException("토큰에서 페이로드를 추출할 수 없습니다: " + e.getMessage(), e);
    }
  }

  public Jws<Claims> getClaims(final String token) {
    log.debug("Authorization header: '{}'", token);
    try {
      if (token == null || token.trim().isEmpty()) {
        throw new IllegalArgumentException("토큰이 비어있습니다.");
      }

      return Jwts.parserBuilder()
          .setSigningKey(secretKey)  // 인코딩된 키가 아닌 SecretKey 객체 직접 사용
          .build()
          .parseClaimsJws(token.trim());  // 토큰 앞뒤 공백 제거
    } catch (Exception e) {
      log.error("JWT parsing error: {}{}", e.getMessage(), token);
      throw new IllegalArgumentException("토큰 파싱 오류: " + e.getMessage(), e);
    }
  }

  public boolean isTokenExpired(final String token) {
    try {
      if (token == null || token.trim().isEmpty()) {
        log.debug("Token is null or empty");
        return true;
      }

      // 토큰에 공백이 있는지 확인
      if (token.contains(" ")) {
        log.debug("Token contains spaces: '{}'", token);
        return true;
      }

      // 유효한 Base64 문자만 포함하는지 확인 (선택적)
      if (!token.matches("^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$")) {
        log.debug("Token has invalid format: '{}'", token);
        return true;
      }

      Jws<Claims> claimsJws = Jwts.parserBuilder()
          .setSigningKey(secretKey)
          .build()
          .parseClaimsJws(token.trim());

      Date expiration = claimsJws.getBody().getExpiration();
      return expiration.before(new Date());
    } catch (ExpiredJwtException e) {
      return true;
    } catch (Exception e) {
      log.error("Error checking token expiration: {}", e.getMessage());
      return true;
    }
  }
}