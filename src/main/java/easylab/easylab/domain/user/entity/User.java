package easylab.easylab.domain.user.entity;

import easylab.easylab.domain.BaseEntity;
import easylab.easylab.domain.auth.config.PasswordEncoder;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String password;

  private String email;

  private String address;

  @Enumerated(EnumType.STRING)
  private Role role;

  public User(String name, String password, String email, String address, Role role) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.address = address;
    this.role = role;
  }

  public static User of(String name, String password, String email, String address, String role) {
    return new User(name, password, email, address, Role.from(role));
  }

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
