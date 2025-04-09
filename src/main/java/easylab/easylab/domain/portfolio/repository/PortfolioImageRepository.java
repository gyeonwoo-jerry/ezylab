package easylab.easylab.domain.portfolio.repository;

import easylab.easylab.domain.portfolio.entity.PortfolioImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioImageRepository extends JpaRepository<PortfolioImage, Long> {

  List<PortfolioImage> findByPortfolioId(Long id);
}
