package easylab.easylab.domain.portfolio.entity;

import easylab.easylab.domain.BaseEntity;
import easylab.easylab.domain.board.entity.Board;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "portfolio_image")
@Builder
public class PortfolioImage extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String imagePath;

  @Column(nullable = false)
  private String originalFileName;

  @ManyToOne
  @JoinColumn(name = "portfolio_id")
  private Portfolio portfolio;
}
