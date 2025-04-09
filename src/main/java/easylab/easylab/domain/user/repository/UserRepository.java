package easylab.easylab.domain.user.repository;

import easylab.easylab.domain.user.entity.User;
import java.util.Optional;
import javax.swing.text.html.Option;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  Optional<User> findByMemberId(String memberId);

  Optional<User> findByPhone(String phone);

  Page<User> findByNameContainingIgnoreCase(String name, PageRequest pageRequest);
}
