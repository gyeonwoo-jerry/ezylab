package easylab.easylab.domain.portfolio.repository;

import easylab.easylab.domain.portfolio.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

}
