package easylab.easylab.domain.user.entity;

import easylab.easylab.domain.BaseEntity;
import easylab.easylab.domain.auth.config.PasswordEncoder;
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

  public boolean isValidPassword(String password, PasswordEncoder passwordEncoder) {
    return passwordEncoder.matches(password, this.password);
  }

  public boolean isOwner(Long authUserId) {
    return this.id.equals(authUserId);
  }

  public void updateProfile(String name, String password, String email, String address, String role) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.address = address;
    this.role = Role.from(role);
  }
}
