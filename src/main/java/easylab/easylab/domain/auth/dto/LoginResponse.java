package easylab.easylab.domain.auth.dto;

import easylab.easylab.domain.user.entity.Role;

public record LoginResponse (
  String token,
  Role role,
  String name
) {
}
