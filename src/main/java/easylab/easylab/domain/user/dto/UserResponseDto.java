package easylab.easylab.domain.user.dto;

import easylab.easylab.domain.user.entity.Role;
import easylab.easylab.domain.user.entity.User;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record UserResponseDto(
    Long id,
    String memberId,
    String name,
    String email,
    String phone,
    String address,
    Role role,
    LocalDateTime createdAt,
    LocalDateTime modifiedAT
) {

  public static UserResponseDto fromEntity(User user) {
    return UserResponseDto.builder()
        .id(user.getId())
        .memberId(user.getMemberId())
        .name(user.getName())
        .email(user.getEmail())
        .phone(user.getPhone())
        .address(user.getAddress())
        .role(user.getRole())
        .createdAt(user.getCreatedAt())
        .modifiedAT(user.getModifiedAt())
        .build();
  }
}
