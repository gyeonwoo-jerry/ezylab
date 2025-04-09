package easylab.easylab.domain.user.service;

import easylab.easylab.domain.auth.config.PasswordEncoder;
import easylab.easylab.domain.common.response.PageResponse;
import easylab.easylab.domain.user.dto.UserDeleteRequest;
import easylab.easylab.domain.user.dto.UserResponseDto;
import easylab.easylab.domain.user.dto.UserUpdateRequest;
import easylab.easylab.domain.user.entity.Role;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public PageResponse<UserResponseDto> getAllUser(Long userId, int page, int size, String name) {
    // 1. 관리자 유저 확인
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

    if (user.getRole() != Role.ADMIN) {
      throw new IllegalArgumentException("관리자 권한이 없습니다.");
    }

    // 2. PageRequest 생성
    PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));

    // 3. 이름 조건에 따른 유저 목록 조회
    Page<User> userPage = (name != null && !name.trim().isEmpty())
        ? userRepository.findByNameContainingIgnoreCase(name, pageRequest)
        : userRepository.findAll(pageRequest);

    // 4. 엔티티 → DTO 변환
    Page<UserResponseDto> dtoPage = userPage.map(UserResponseDto::fromEntity);

    // 5. PageResponse로 변환하여 반환
    return PageResponse.fromPage(dtoPage);
  }

  public UserResponseDto getProfile(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    return UserResponseDto.fromEntity(user);
  }

  public void updateProfile(Long userId, UserUpdateRequest request, List<MultipartFile> images) {
    User user = userRepository.findById(userId).orElseThrow(()->new IllegalArgumentException("유저를 찾을 수 없습니다."));

    user.updateProfile(request);

    request.password().ifPresent(password -> {
      if (!password.isBlank()) {
        user.changePassword(passwordEncoder.encode(password));
      }
    });
  }

  public void deleteUser(Long userId, UserDeleteRequest request) {
    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if(!passwordEncoder.matches(request.password(), user.getPassword())) {
      throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
    }

    user.softDelete();
  }
}
