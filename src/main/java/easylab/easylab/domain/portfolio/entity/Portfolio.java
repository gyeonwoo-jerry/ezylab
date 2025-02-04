package easylab.easylab.domain.portfolio.entity;

import easylab.easylab.domain.BaseEntity;
import easylab.easylab.domain.user.entity.User;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Portfolio")
public class Portfolio extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  private String content;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  public Portfolio(String title, String content, User user, LocalDateTime createdAt, LocalDateTime updatedAt) {
    this.title = title;
    this.content = content;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static Portfolio of(User user, String title, String content) {
    return new Portfolio(title, content, user, LocalDateTime.now(), LocalDateTime.now());
  }

  public void updatePortfolio(String title, String content) {
    this.title = title;
    this.content = content;
  }
}
