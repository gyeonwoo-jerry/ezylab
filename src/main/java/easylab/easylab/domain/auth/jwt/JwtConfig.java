package easylab.easylab.domain.auth.jwt;

import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

  // 고정된 시크릿 키 문자열 (실제로는 환경 변수나 설정 파일에서 가져오는 것을 권장)
  private static final String SECRET_KEY = "your_secret_key_should_be_at_least_256_bits_long_for_hs256_algorithm";

  @Bean
  public SecretKey jwtSecretKey() {
    // 문자열에서 SecretKey 생성 (매번 동일한 키 생성)
    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
  }
}
