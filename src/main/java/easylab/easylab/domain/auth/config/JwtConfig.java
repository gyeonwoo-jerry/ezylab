package easylab.easylab.domain.auth.config;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

  @Bean
  public SecretKey secretKey() {
    return Keys.secretKeyFor(SignatureAlgorithm.HS256); // 또는 원하는 알고리즘
  }
}
