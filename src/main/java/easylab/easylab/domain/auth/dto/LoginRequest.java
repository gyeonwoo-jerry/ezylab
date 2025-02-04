package easylab.easylab.domain.auth.dto;

public record LoginRequest (
    String email,
    String password
) {
}
