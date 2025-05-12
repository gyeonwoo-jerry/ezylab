package easylab.easylab.domain.auth.dto;

public record LogoutResponse(
    Long userId,
    String message
) {
}
