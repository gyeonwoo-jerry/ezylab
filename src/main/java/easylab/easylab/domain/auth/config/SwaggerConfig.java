package easylab.easylab.domain.auth.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(title = "회원가입 API", version = "1.0", description = "Swagger를 활용한 회원가입 API 문서")
)
public class SwaggerConfig {

}
