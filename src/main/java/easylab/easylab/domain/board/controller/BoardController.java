package easylab.easylab.domain.board.controller;

import easylab.easylab.domain.auth.resolver.AuthenticationUserId;
import easylab.easylab.domain.board.dto.BoardRequestDto;
import easylab.easylab.domain.board.dto.BoardResponseDto;
import easylab.easylab.domain.board.dto.BoardUpdateDto;
import easylab.easylab.domain.board.service.BoardService;
import easylab.easylab.domain.common.response.ApiResponse;
import easylab.easylab.domain.common.response.PageResponse;
import jakarta.servlet.http.HttpServletRequest;
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
  public ApiResponse<Void> createBoard (
      @RequestPart("request") BoardRequestDto request,
      @AuthenticationUserId Long userId,
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) {
    boardService.createBoard(request, userId, images);
    return ApiResponse.success("게시판 생성 완료", null);
  }

  @GetMapping("/boards")
  public ApiResponse<PageResponse<BoardResponseDto>> getBoards (
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    PageResponse<BoardResponseDto> boardList = boardService.getBoards(page, size);
    return ApiResponse.success("게시판 목록 조회 성공", boardList);
  }

  @GetMapping("/board")
  public ApiResponse<BoardResponseDto> getBoard (
      @PathVariable("boardId") Long boardId,
      HttpServletRequest request
  ) {
    return ApiResponse.success("게시판 조회 성공", boardService.getBoard(boardId, request));
  }

  @PutMapping("/{boardId}")
  public ApiResponse<Void> updateBoard (
      @PathVariable Long boardId,
      @RequestBody BoardUpdateDto update,
      @AuthenticationUserId Long userId,
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) {
    boardService.updateBoard(boardId, update, userId, images);
    return ApiResponse.success("게시판 수정 성공", null);
  }

  @DeleteMapping("/{boardId}")
  public ApiResponse<Void> deleteBoard (
      @PathVariable("boardId") Long boardId,
      @AuthenticationUserId Long userId
  ) {
    boardService.deleteBoard(boardId, userId);
    return ApiResponse.success("게시판 삭제 성공", null);
  }
}
