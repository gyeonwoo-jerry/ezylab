package easylab.easylab.domain.board.dto;

import java.util.Optional;

public record BoardUpdateDto (
    Optional<String> title,
    Optional<String> content
) {

}
