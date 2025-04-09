package easylab.easylab.domain.user.dto;

import java.util.Optional;

public record UserUpdateRequest(
    Optional<String> name,
    Optional<String> memberId,
    Optional<String> password,
    Optional<String> email,
    Optional<String> phone,
    Optional<String> address
) {
}