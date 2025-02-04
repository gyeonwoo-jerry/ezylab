package easylab.easylab.domain.user.entity;

import java.util.Arrays;

public enum Role {
  USER, ADMIN;

  public static Role from(final String role) {
    return Arrays.stream(values())
        .filter(v->v.name().equalsIgnoreCase(role))
        .findFirst()
        .orElseThrow();
  }
}
