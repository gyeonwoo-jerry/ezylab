package easylab.easylab.domain.board.controller;

import easylab.easylab.domain.auth.resolver.AuthenticationUserId;
import easylab.easylab.domain.board.dto.BoardRequestDto;
import easylab.easylab.domain.board.dto.BoardResponseDto;
import easylab.easylab.domain.board.service.BoardService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BoardController {

  private final BoardService boardService;

  @PostMapping("/board")
  public ResponseEntity<BoardResponseDto> createBoard (
      @ModelAttribute("request") BoardRequestDto request,
      @AuthenticationUserId Long userId,
      @RequestParam ("images") List<MultipartFile> images
  ) {
    BoardResponseDto responseDto = boardService.createBoard(request, userId, images);
    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping("/boards")
  public ResponseEntity<Page<BoardResponseDto>> getBoards (
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "createdAt") String sortBy,
      @RequestParam(defaultValue = "true") boolean isAsc
  ) {
    Page<BoardResponseDto> responseDto = boardService.getBoards(page-1, size, sortBy, isAsc);
    return ResponseEntity.status(HttpStatus.OK).body(responseDto);
  }

  @PutMapping("/{boardId}")
  public ResponseEntity<BoardResponseDto> updateBoard (
      @PathVariable Long boardId,
      @RequestBody BoardRequestDto request,
      @AuthenticationUserId Long userId
  ) {
    BoardResponseDto responseDto = boardService.updateBoard(boardId, request, userId);
    return ResponseEntity.status(HttpStatus.OK).body(responseDto);
  }

  @DeleteMapping("/{boardId}")
  public ResponseEntity<Void> deleteBoard (
      @PathVariable Long boardId,
      @AuthenticationUserId Long userId
  ) {
    boardService.deleteBoard(boardId, userId);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
