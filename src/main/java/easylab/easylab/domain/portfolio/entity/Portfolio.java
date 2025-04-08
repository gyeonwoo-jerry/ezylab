package easylab.easylab.domain.portfolio.entity;

import easylab.easylab.domain.BaseEntity;
import easylab.easylab.domain.board.entity.BoardImage;
import easylab.easylab.domain.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

@Getter
@Entity
@AllArgsConstructor
@Builder
@Where(clause = "is_deleted = 'N'")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Portfolio")
public class Portfolio extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  private String content;

  @Builder.Default
  @Column(name = "is_deleted", nullable = false, length = 1)
  private String isDeleted = "N";

  @Builder.Default
  @Column(nullable = false)
  private Long viewCount = 0L;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<PortfolioImage> images = new ArrayList<>();

  public void updatePortfolio(String title, String content) {
    this.title = title;
    this.content = content;
  }
}
