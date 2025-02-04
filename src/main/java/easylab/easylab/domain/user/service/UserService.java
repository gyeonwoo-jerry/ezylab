package easylab.easylab.domain.user.service;

import easylab.easylab.domain.user.dto.ProfileResponseDto;
import easylab.easylab.domain.user.dto.UserUpdateRequest;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public ProfileResponseDto getProfile(Long id) {
    User user = userRepository.findById(id).orElseThrow(()->new IllegalArgumentException("유저를 찾을 수 없습나다."));
    ProfileResponseDto profileResponseDto = new ProfileResponseDto(user);
    return profileResponseDto;
  }

  public void updateProfile(Long userId, UserUpdateRequest request, Long authUserId) {
    User user = userRepository.findById(userId).orElseThrow(()->new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if (!user.isOwner(authUserId)) {
      throw new IllegalArgumentException("본인의 아이디가 아닙니다.");
    }

    user.updateProfile(request.name(), request.password(), request.email(), request.address(), request.role());
  }

  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }
}
