package easylab.easylab.domain.user.entity;

import easylab.easylab.domain.common.BaseEntity;
import easylab.easylab.domain.auth.config.PasswordEncoder;
import easylab.easylab.domain.user.dto.UserUpdateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String memberId;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String password;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(unique = true, nullable = false)
  private String phone;

  @Column(unique = true, nullable = false)
  private String address;

  @Enumerated(EnumType.STRING)
  private Role role;

  @Builder.Default
  @Column(name = "is_deleted", nullable = false, length = 1)
  private String isDeleted = "N";

  public boolean isValidPassword(String password, PasswordEncoder passwordEncoder) {
    return passwordEncoder.matches(password, this.password);
  }

  public boolean isOwner(Long authUserId) {
    return this.id.equals(authUserId);
  }

  public void updateProfile(UserUpdateRequest request) {
    request.name().ifPresent(value -> {
      if (!value.isBlank()) {
        this.name = value;
      }
    });

    request.memberId().ifPresent(value -> {
      if (!value.isBlank()) {
        this.memberId = value;
      }
    });

    request.email().ifPresent(value -> {
      if (!value.isBlank()) {
        this.email = value;
      }
    });

    request.phone().ifPresent(value -> {
      if (!value.isBlank()) {
        this.phone = value;
      }
    });

    request.address().ifPresent(value -> {
      if (!value.isBlank()) {
        this.address = value;
      }
    });
  }

  public void changePassword(String newPassword) {
    if (newPassword != null && !newPassword.isBlank()) {
      this.password = newPassword;
    }
  }

  public void softDelete() {
    this.isDeleted = "Y";
  }
}
