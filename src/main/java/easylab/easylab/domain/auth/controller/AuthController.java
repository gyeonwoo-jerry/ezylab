package easylab.easylab.domain.auth.controller;

import easylab.easylab.domain.auth.dto.JoinRequest;
import easylab.easylab.domain.auth.dto.LoginRequest;
import easylab.easylab.domain.auth.dto.LoginResponse;
import easylab.easylab.domain.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/auth/join")
  public ResponseEntity<Long> signup(@RequestBody JoinRequest request) {
    Long userId = authService.join(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(userId);
  }

  @PostMapping("/auth/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
    LoginResponse loginResponse = authService.login(request);
    response.addHeader("Authorization","Bearer" + loginResponse.token());
    return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
  }
}
