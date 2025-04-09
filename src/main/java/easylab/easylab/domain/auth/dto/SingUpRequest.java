package easylab.easylab.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SingUpRequest(
    @NotBlank(message = "아이디를 입력해주세요.")
    String memberId,
    @NotBlank(message = "이름을 입력해주세요.")
    String name,
    @NotBlank(message = "비밀번호를 입력해 주세요")
    String password,
    @Email(message = "이메일 형식에 맞게 작성해주세요.")
    @NotBlank(message = "이메일은 필수 입력 사항입니다.")
    String email,
    @NotBlank(message = "휴대전화 번호를 입력해주세요.")
    String phone,
    @NotBlank(message = "주소를 입력해주세요.")
    String address
) {
}
