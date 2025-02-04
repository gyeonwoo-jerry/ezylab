package easylab.easylab.domain.auth.service;

import easylab.easylab.domain.auth.dto.JoinRequest;
import easylab.easylab.domain.auth.dto.LoginRequest;
import easylab.easylab.domain.auth.dto.LoginResponse;
import easylab.easylab.domain.auth.jwt.JwtProvider;
import easylab.easylab.domain.auth.config.PasswordEncoder;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;

  public Long join(JoinRequest request) {
    String password = passwordEncoder.encode(request.password());
    User user = User.of(request.name(), password, request.email() , request.address(), request.role());
    User savedUser = userRepository.save(user);
    return savedUser.getId();
  }

  public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.email()).orElseThrow(()-> new IllegalArgumentException("이메일을 찾을수 없습니다."));

    if(!user.isValidPassword(request.password(), passwordEncoder)) {
      throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
    }

    String token = jwtProvider.createToken(user.getId(), user.getRole());
    return new LoginResponse(token);
  }
}
