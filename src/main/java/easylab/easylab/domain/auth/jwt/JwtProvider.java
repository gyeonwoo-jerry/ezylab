package easylab.easylab.domain.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import javax.crypto.SecretKey;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor  // 생성자 주입 사용
public class JwtProvider {

  private final SecretKey secretKey;  // Bean으로 주입
  private final RedisTemplate<String, String> redisTemplate;

  // 액세스 토큰 유효 시간 (1시간)
  private static final long ACCESS_TOKEN_EXPIRE_TIME = 60 * 60 * 1000L ;
  // 리프레시 토큰 유효 시간 (24시간)
  private static final long REFRESH_TOKEN_EXPIRE_TIME = 24 * 60 * 60 * 1000L;
  // Redis에서 리프레시 토큰 저장 시 사용할 접두사
  private static final String REFRESH_TOKEN_PREFIX = "refreshToken:";
  // Redis에서 블랙리스트 저장 시 사용할 접두사
  private static final String BLACKLIST_PREFIX = "blacklist:access:";

  @Getter
  @AllArgsConstructor
  public static class TokenInfo {
    private String accessToken;
    private String refreshToken;
  }

  // 액세스 토큰과 리프레시 토큰을 함께 생성
  public TokenInfo createTokens(Long userId) {
    final Date now = new Date();

    // 액세스 토큰 생성
    final Claims accessClaims = Jwts.claims().setSubject(String.valueOf(userId));
    accessClaims.put("type", "access");
    String accessToken = Jwts.builder()
        .setClaims(accessClaims)
        .setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME))
        .signWith(SignatureAlgorithm.HS256, secretKey.getEncoded())
        .compact();

    // 리프레시 토큰 생성
    final Claims refreshClaims = Jwts.claims().setSubject(String.valueOf(userId));
    refreshClaims.put("type", "refresh");
    String refreshToken = Jwts.builder()
        .setClaims(refreshClaims)
        .setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME))
        .signWith(SignatureAlgorithm.HS256, secretKey.getEncoded())
        .compact();

    // 리프레시 토큰을 Redis에 저장 (키: refreshToken:userId, 값: refreshToken)
    String key = REFRESH_TOKEN_PREFIX + userId;
    redisTemplate.opsForValue().set(key, refreshToken, REFRESH_TOKEN_EXPIRE_TIME, TimeUnit.MILLISECONDS);

    return new TokenInfo(accessToken, refreshToken);
  }

  // 토큰에서 사용자 ID 추출
  public Long getPayload(final String token) {
    // 블랙리스트 확인 추가
    if (isTokenBlacklisted(token)) {
      throw new IllegalArgumentException("이미 로그아웃된 토큰입니다.");
    }

       String subject = getClaims(token)
        .getBody()
        .getSubject();
    return Long.parseLong(subject);
  }

  // 토큰의 Claims 가져오기
  public Jws<Claims> getClaims(final String token) {
    // 블랙리스트 확인 추가
    if (isTokenBlacklisted(token)) {
      throw new IllegalArgumentException("이미 로그아웃된 토큰입니다.");
    }

   try {
      return Jwts.parserBuilder()
          .setSigningKey(secretKey.getEncoded())
          .build()
          .parseClaimsJws(token);
    } catch (Exception e) {
      throw new IllegalArgumentException(e);
    }
  }

  // 토큰 파싱하기
  public Claims parseToken(final String token) {
    return Jwts.parser()
        .setSigningKey(secretKey.getEncoded())
        .parseClaimsJws(token)
        .getBody();
  }

  // 토큰 만료 여부 확인
  public boolean isTokenExpired(final String token) {
    return parseToken(token).getExpiration().before(new Date());
  }

  // 사용자 로그아웃 - 리프레시 토큰 삭제
  public void logout(Long userId, String accessToken) {
    redisTemplate.delete(REFRESH_TOKEN_PREFIX + userId);

    blacklistAccessToken(accessToken);

    log.info("사용자 로그아웃 처리 완료. ID: {}", userId);
  }

  // 액세스 토큰을 블랙리스트에 추가하는 메서드
  public void blacklistAccessToken(String accessToken) {
    try {
      Claims claims = parseToken(accessToken);
      Date expiration = claims.getExpiration();
      String userId = claims.getSubject();

      // 현재 시간부터 토큰 만료 시간까지의 남은 시간(밀리초) 계산
      long ttl = expiration.getTime() - System.currentTimeMillis();

      // 만료 시간이 남아있는 경우에만 블랙리스트에 추가
      if (ttl > 0) {
        String blacklistKey = BLACKLIST_PREFIX + accessToken;
        redisTemplate.opsForValue().set(blacklistKey, userId, ttl, TimeUnit.MILLISECONDS);
        log.info("액세스 토큰이 블랙리스트에 추가되었습니다. 사용자 ID: {}", userId);
      }
    } catch (Exception e) {
      log.error("블랙리스트 추가 중 오류 발생", e);
    }
  }

  // 토큰이 블랙리스트에 있는지 검사하는 메서드
  public boolean isTokenBlacklisted(String accessToken) {
    String blacklistKey = BLACKLIST_PREFIX + accessToken;
    Boolean exists = redisTemplate.hasKey(blacklistKey);
    return Boolean.TRUE.equals(exists);
  }
}