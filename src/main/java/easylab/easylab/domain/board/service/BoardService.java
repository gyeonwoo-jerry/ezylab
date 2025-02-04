package easylab.easylab.domain.board.service;

import easylab.easylab.domain.board.dto.BoardRequestDto;
import easylab.easylab.domain.board.dto.BoardResponseDto;
import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.BoardImage;
import easylab.easylab.domain.board.repository.BoardRepository;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {

  private final BoardRepository boardRepository;
  private final UserRepository userRepository;
  private final BoardImageService boardImageService;

  public BoardResponseDto createBoard(BoardRequestDto request, Long userId, List<MultipartFile> images) {
    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    Board board = Board.of(user, request.title(), request.content());

    Board savedBoard = boardRepository.save(board);

    boardImageService.uploadImage(board, images);

    BoardResponseDto responseDto = new BoardResponseDto(savedBoard);

    return responseDto;
  }

  @Transactional(readOnly = true)
  public Page<BoardResponseDto> getBoards(int page, int size, String sortBy, boolean isAsc) {
    Sort.Direction direction = isAsc ? Sort.Direction.ASC : Sort.Direction.DESC;
    Sort sort = Sort.by(direction, sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);

    Page<Board> boards = boardRepository.findAll(pageable);

    return boards.map(BoardResponseDto::new);
  }

  public BoardResponseDto updateBoard(Long boardId, BoardRequestDto request, Long userId) {
    Board board = boardRepository.findById(boardId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if(!userId.equals(user.getId())) {
      throw new IllegalArgumentException("수정 권한이 없습니다.");
    }

    board.updateBoard(request.title(),request.content());

    return new BoardResponseDto(board);
  }


  public void deleteBoard(Long boardId, Long userId) {
    Board board = boardRepository.findById(boardId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if(!userId.equals(user.getId())) {
      throw new IllegalArgumentException("삭제 권한이 없습니다.");
    }

    boardRepository.delete(board);
  }
}
