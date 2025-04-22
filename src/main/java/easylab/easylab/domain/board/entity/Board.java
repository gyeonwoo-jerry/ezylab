package easylab.easylab.domain.board.entity;

import easylab.easylab.domain.common.BaseEntity;
import easylab.easylab.domain.board.dto.BoardUpdateDto;
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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "board")
@Where(clause = "is_deleted = 'N'")
@Builder
public class Board extends BaseEntity {

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

  @Builder.Default
  @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<BoardImage> images = new ArrayList<>();

  public void updateBoard(BoardUpdateDto update) {
    update.title().ifPresent(title -> {
      if (!title.isBlank()) this.title = title;
    });

    update.content().ifPresent(content -> {
      if (!content.isBlank()) this.content = content;
    });
  }

  public void increaseViewCount() {
    this.viewCount += 1;
  }

  public void softDelete() {
    this.isDeleted = "Y";
  }
}
