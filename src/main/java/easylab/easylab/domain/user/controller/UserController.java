package easylab.easylab.domain.user.controller;

import easylab.easylab.domain.auth.resolver.AuthenticationUserId;
import easylab.easylab.domain.common.response.ApiResponse;
import easylab.easylab.domain.common.response.PageResponse;
import easylab.easylab.domain.user.dto.UserDeleteRequest;
import easylab.easylab.domain.user.dto.UserResponseDto;
import easylab.easylab.domain.user.dto.UserUpdateRequest;
import easylab.easylab.domain.user.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

  private final UserService userService;

  @GetMapping("/users")
  public ApiResponse<PageResponse<UserResponseDto>> getAllUser(
      @AuthenticationUserId Long userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String name
  ) {
    PageResponse<UserResponseDto> response = userService.getAllUser(userId, page, size, name);
    return ApiResponse.success("회원 조회 성공", response);
  }

  @GetMapping("/myself")
  public ApiResponse<UserResponseDto> getProfile(@AuthenticationUserId Long id) {
    return ApiResponse.success("프로필 조회 완료", userService.getProfile(id));
  }

  @PutMapping("/users/{userId}")
  public ApiResponse<Void> updateProfile(
      @AuthenticationUserId Long userId,
      @RequestPart("request") @Valid UserUpdateRequest request,
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) {
    userService.updateProfile(userId, request, images);
    return ApiResponse.success("프로필 수정 성공", null);
  }

  @DeleteMapping("/users/delete")
  public ApiResponse<Void> deleteUser(
      @AuthenticationUserId Long id,
      @RequestBody @Valid UserDeleteRequest request
  ) {
    userService.deleteUser(id, request);
    return ApiResponse.success("프로필 삭제 성공", null);
  }
}
