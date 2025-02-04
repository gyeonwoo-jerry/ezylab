package easylab.easylab.domain.board.entity;

import easylab.easylab.domain.BaseEntity;
import easylab.easylab.domain.portfolio.entity.Portfolio;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "board_image")
public class BoardImage extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String imagePath;

  @ManyToOne
  @JoinColumn(name = "board_id")
  private Board board;

  @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  private LocalDateTime createdAt;

  public BoardImage(Board board, String imagePath) {
    this.imagePath = imagePath;
    this.board = board;
    this.createdAt = LocalDateTime.now();
  }
}
