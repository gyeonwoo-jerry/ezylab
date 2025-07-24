package easylab.easylab.domain.auth.service;

import easylab.easylab.domain.auth.config.PasswordEncoder;
import easylab.easylab.domain.user.entity.Role;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 관리자 계정 자동 생성 기능 비활성화
// 필요시 @Service 어노테이션 주석을 해제하여 활성화할 수 있습니다.
// @Service
@RequiredArgsConstructor
@Slf4j
public class AdminInitService implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // application.yml에서 관리자 정보를 설정할 수 있도록 함
    @Value("${admin.member-id:admin}")
    private String adminMemberId;

    @Value("${admin.name:관리자}")
    private String adminName;

    @Value("${admin.password:admin123!}")
    private String adminPassword;

    @Value("${admin.email:admin@easylab.com}")
    private String adminEmail;

    @Value("${admin.phone:010-0000-0000}")
    private String adminPhone;

    @Value("${admin.address:서울특별시}")
    private String adminAddress;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {
        // 관리자 계정이 이미 존재하는지 확인
        if (userRepository.findByMemberId(adminMemberId).isPresent()) {
            log.info("관리자 계정이 이미 존재합니다. ID: {}", adminMemberId);
            return;
        }

        try {
            // 관리자 계정 생성
            User admin = User.builder()
                    .memberId(adminMemberId)
                    .name(adminName)
                    .password(passwordEncoder.encode(adminPassword))
                    .email(adminEmail)
                    .phone(adminPhone)
                    .address(adminAddress)
                    .role(Role.ADMIN)
                    .isDeleted("N")
                    .build();

            userRepository.save(admin);
            log.info("관리자 계정이 성공적으로 생성되었습니다.");
            log.info("관리자 ID: {}", adminMemberId);
            log.info("관리자 이메일: {}", adminEmail);
            log.info("임시 비밀번호: {}", adminPassword);
            log.warn("보안을 위해 관리자 비밀번호를 변경해주세요!");

        } catch (Exception e) {
            log.error("관리자 계정 생성 중 오류가 발생했습니다: {}", e.getMessage(), e);
        }
    }
} 