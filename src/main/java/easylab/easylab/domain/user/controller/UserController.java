package easylab.easylab.domain.user.controller;

import easylab.easylab.domain.auth.resolver.AuthenticationUserId;
import easylab.easylab.domain.user.dto.ProfileResponseDto;
import easylab.easylab.domain.user.dto.UserUpdateRequest;
import easylab.easylab.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

  private final UserService userService;

  @GetMapping("/myself")
  public ResponseEntity<ProfileResponseDto> getProfile(@AuthenticationUserId Long id) {
    return ResponseEntity.status(HttpStatus.OK).body(userService.getProfile(id));
  }

  @PutMapping("/users/{userId}")
  public ResponseEntity<Void> updateProfile(
      @PathVariable Long userId,
      @RequestBody UserUpdateRequest request,
      @AuthenticationUserId Long authUserId
  ) {
    userService.updateProfile(userId, request, authUserId);
    return ResponseEntity.status(HttpStatus.OK).build();
  }

  @DeleteMapping("/users/delete")
  public ResponseEntity<Void> deleteUser(@AuthenticationUserId Long id) {
    userService.deleteUser(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
