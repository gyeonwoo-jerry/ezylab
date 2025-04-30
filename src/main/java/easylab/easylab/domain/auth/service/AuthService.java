package easylab.easylab.domain.auth.service;

import easylab.easylab.domain.auth.config.PasswordEncoder;
import easylab.easylab.domain.auth.dto.LoginRequest;
import easylab.easylab.domain.auth.dto.LoginResponse;
import easylab.easylab.domain.auth.dto.SingUpRequest;
import easylab.easylab.domain.auth.jwt.JwtProvider;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;

  public void join(SingUpRequest request) {
    String memberId = request.memberId();
    String password = passwordEncoder.encode(request.password());

    //회원 중복 확인
    Optional<User> checkUser = userRepository.findByMemberId(memberId);
    if (checkUser.isPresent()) {
      throw new IllegalArgumentException("중복된 사용자가 존재합니다.");
    }

    // email 중복 확인
    String email = request.email();
    Optional<User> checkEmail = userRepository.findByEmail(email);
    if (checkEmail.isPresent()) {
      throw new IllegalArgumentException("중복된 Email 입니다.");
    }

    // 휴대전화 번호 유효성 검사
    String phone = request.phone();
    String phoneRegex = "^(01[0|1|6|7|8|9])\\d{7,8}$";

    boolean isOnlyDigits = phone.chars().allMatch(Character::isDigit);

    if (!phone.matches(phoneRegex) || !isOnlyDigits) {
      throw new IllegalArgumentException("휴대전화 번호는 숫자만 입력하며, 010으로 시작하는 10~11자리여야 합니다.");
    }

    // 휴대전화 중복 검사
    if (userRepository.findByPhone(phone).isPresent()) {
      throw new IllegalArgumentException("중복된 전화번호입니다.");
    }

    User user = User.builder()
        .memberId(memberId)
        .name(request.name())
        .password(password)
        .email(email)
        .phone(phone)
        .address(request.address())
        .build();

    userRepository.save(user);
  }

  public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByMemberId(request.memberId())
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

    if(!user.isValidPassword(request.password(), passwordEncoder)) {
      throw new IllegalArgumentException("아이디나 비밀번호를 정확하게 입력해주세요.");
    }

    String token = jwtProvider.createToken(user.getId());

    return new LoginResponse(token, user.getName());
  }
}
