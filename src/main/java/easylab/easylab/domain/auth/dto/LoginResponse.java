package easylab.easylab.domain.auth.dto;

public record LoginResponse (
    String accessToken,
    String refreshToken,
    String name
) {
}
