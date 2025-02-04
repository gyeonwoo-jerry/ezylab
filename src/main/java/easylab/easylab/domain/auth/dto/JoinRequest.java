package easylab.easylab.domain.auth.dto;

public record JoinRequest(
    String name,
    String password,
    String email,
    String address,
    String role
) {
}
