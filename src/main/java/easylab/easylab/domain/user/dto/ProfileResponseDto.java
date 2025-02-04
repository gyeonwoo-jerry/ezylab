package easylab.easylab.domain.user.dto;

import easylab.easylab.domain.user.entity.User;
import lombok.Getter;

@Getter
public class ProfileResponseDto {
  String email;
  String name;
  String password;
  String address;

  public ProfileResponseDto(User user) {
    this.email = user.getEmail();
    this.name = user.getName();
    this.password = user.getPassword();
    this.address = user.getAddress();
  }
}
