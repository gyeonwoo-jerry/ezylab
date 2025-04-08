package easylab.easylab.domain.auth.controller;

import easylab.easylab.domain.auth.dto.SingUpRequest;
import easylab.easylab.domain.auth.dto.LoginRequest;
import easylab.easylab.domain.auth.dto.LoginResponse;
import easylab.easylab.domain.auth.service.AuthService;
import easylab.easylab.domain.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/join")
  public ApiResponse<Void> signup(
      @RequestBody
      @Valid
      SingUpRequest request
  ) {
    authService.join(request);
    return ApiResponse.success("회원가입 완료", null);
  }

  @PostMapping("/login")
  public ApiResponse<LoginResponse> login(
      @RequestBody
      @Valid
      LoginRequest request
  ) {
    LoginResponse loginResponse = authService.login(request);
    return ApiResponse.success("로그인 성공", loginResponse);
  }
}
