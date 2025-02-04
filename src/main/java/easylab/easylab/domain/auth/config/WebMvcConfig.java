package easylab.easylab.domain.auth.config;

import easylab.easylab.domain.auth.jwt.JwtProvider;
import easylab.easylab.domain.auth.resolver.CurrentUserArgumentResolver;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

  private final JwtProvider jwtProvider;

  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
    argumentResolvers.add(new CurrentUserArgumentResolver(jwtProvider));
  }
}
