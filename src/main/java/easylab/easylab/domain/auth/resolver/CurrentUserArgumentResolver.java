package easylab.easylab.domain.auth.resolver;

import easylab.easylab.domain.auth.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
@Slf4j
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

  private final JwtProvider jwtProvider;

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return parameter.getParameterAnnotation(AuthenticationUserId.class) != null
        && parameter.getParameterType().equals(Long.class);
  }

  @Override
  public Object resolveArgument(
      MethodParameter parameter, ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

    final HttpServletRequest httpServletRequest = webRequest.getNativeRequest(HttpServletRequest.class);

    final String token = Objects.requireNonNull(httpServletRequest).getHeader(HttpHeaders.AUTHORIZATION).replaceFirst("(?i)^Bearer\\s+", "").trim();

    log.debug("token: {}", token);


    return jwtProvider.getPayload(token);
  }
}
