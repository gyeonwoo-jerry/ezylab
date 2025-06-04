package easylab.easylab.domain.board.service;

import easylab.easylab.domain.board.dto.BoardRequestDto;
import easylab.easylab.domain.board.dto.BoardResponseDto;
import easylab.easylab.domain.board.dto.BoardUpdateDto;
import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.SearchType;
import easylab.easylab.domain.board.repository.BoardRepository;
import easylab.easylab.domain.common.response.PageResponse;
import easylab.easylab.domain.user.entity.User;
import easylab.easylab.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
  private final BoardAttachmentService boardAttachmentService;

  public void createBoard(BoardRequestDto request, Long userId, List<MultipartFile> images, List<MultipartFile> attachments) {
    User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    Board board = Board.builder()
        .title(request.title())
        .content(request.content())
        .user(user)
        .build();

    boardRepository.save(board);

    boardImageService.uploadImage(board, images);
    boardAttachmentService.uploadAttachment(board, attachments);
  }

  @Transactional(readOnly = true)
  public PageResponse<BoardResponseDto> getBoards(int page, int size, String search, SearchType searchType) {
    Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));

    Page<Board> boards = boardRepository.searchBoards(search, searchType, pageable);

    return PageResponse.fromPage(boards.map(BoardResponseDto::from));
  }

  public BoardResponseDto getBoard(Long boardId, HttpServletRequest request) {
    Board board = boardRepository.findById(boardId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    HttpSession session = request.getSession();
    String sessionKey = "viewed_board_" + boardId;

    if (session.getAttribute(sessionKey) == null) {
      board.increaseViewCount(); // 처음 본 경우에만 조회수 증가
      session.setAttribute(sessionKey, true);
      session.setMaxInactiveInterval(60 * 60); // 1시간 유지
    }

    return BoardResponseDto.from(board);
  }

  public void updateBoard(Long boardId, BoardUpdateDto update, Long userId, List<MultipartFile> images, List<MultipartFile> attachments, List<Long> keepImageIds) {
    Board board = boardRepository.findById(boardId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if (!board.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("게시글 수정 권한이 없습니다.");
    }

    board.updateBoard(update);

    boardImageService.updateImages(board, images, keepImageIds);
    boardAttachmentService.updateAttachments(board, attachments);
  }


  public void deleteBoard(Long boardId, Long userId) {
    Board board = boardRepository.findById(boardId).orElseThrow(()-> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

    userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

    if (!board.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("게시글 삭제 권한이 없습니다.");
    }

    board.softDelete();
  }
}
