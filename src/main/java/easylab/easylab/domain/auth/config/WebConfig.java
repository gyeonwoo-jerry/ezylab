package easylab.easylab.domain.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;  
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.servlet.resource.PathResourceResolver;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${filepath}")
    private String filepath;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins("http://localhost:3000", "http://211.110.44.79:3000") // 프론트 개발 & 운영 주소
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true);
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 업로드된 파일 핸들러
    registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:/uploads/")
        .setCachePeriod(3600)
        .resourceChain(true)
        .addResolver(new PathResourceResolver());

    // React fallback (정적 파일 없을 때만 index.html 반환)
    registry.addResourceHandler("/**")  // 모든 경로
        .addResourceLocations("classpath:/static/")
        .resourceChain(true)
        .addResolver(new PathResourceResolver() {
          @Override
          protected Resource getResource(String resourcePath, Resource location) throws IOException {
            // 실제 자원이 없으면 index.html 반환
            return new ClassPathResource("/static/index.html");
          }
        });
  }
}

