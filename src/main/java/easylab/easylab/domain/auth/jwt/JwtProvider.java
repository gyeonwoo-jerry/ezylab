package easylab.easylab.domain.auth.jwt;

import easylab.easylab.domain.user.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class JwtProvider {

  private final SecretKey secretKey;

  public JwtProvider() {
    this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
  }

  public String createToken(final Long id, final Role role) {
    final Date now = new Date();
    final Claims claims = Jwts.claims().setSubject(String.valueOf(id));
    claims.put("role", role);
    return Jwts.builder()
        .setClaims(claims)
        .setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + (30 * 60 * 1000L)))
        .signWith(SignatureAlgorithm.HS256, secretKey.getEncoded())
        .compact();
  }

  public Long getPayload(final String token) {
    String sub = getClaims(token)
        .getBody()
        .get("sub", String.class);
    return Long.parseLong(sub);
  }

  public Jws<Claims> getClaims(final String token) {
    try {
      return Jwts.parserBuilder()
          .setSigningKey(secretKey.getEncoded())
          .build()
          .parseClaimsJws(token);
    } catch (Exception e) {
      throw new IllegalArgumentException(e);
    }
  }

  public Claims parseToken(final String token) {
    return Jwts.parser()
        .setSigningKey(secretKey.getEncoded())
        .parseClaimsJws(token)
        .getBody();
  }

  public boolean isTokenExpired(final String token) {
    return parseToken(token).getExpiration().before(new Date());
  }

  public Role getUserRole(final String token) {
    final Claims claims = Jwts.parser().setSigningKey(secretKey.getEncoded()).parseClaimsJws(token).getBody();
    return Role.valueOf(claims.get("role").toString());
  }
}
