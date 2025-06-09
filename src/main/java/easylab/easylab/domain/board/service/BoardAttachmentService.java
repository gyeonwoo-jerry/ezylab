package easylab.easylab.domain.board.service;

import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.BoardAttachment;
import easylab.easylab.domain.board.repository.BoardAttachmentRepository;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardAttachmentService {

  @Value("${filepath.attachment}")
  private String attachmentPath;

  private final BoardAttachmentRepository attachmentRepository;

  public void uploadAttachment(Board board, List<MultipartFile> files) {
    if (files == null || files.isEmpty()) {
      return;
    }

    try {
      String uploads = attachmentPath;

      for (MultipartFile file : files) {
        String originalFileName = file.getOriginalFilename();
        String dbFilePath = saveFile(file, uploads);

        BoardAttachment attachment = BoardAttachment.builder()
            .board(board)
            .filePath(dbFilePath)
            .originalFileName(originalFileName)
            .build();

        attachmentRepository.save(attachment);
      }

    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private String saveFile(MultipartFile file, String uploads) throws IOException {
    String originalFileName = file.getOriginalFilename();
    String uuid = UUID.randomUUID().toString().replace("-", "");
    String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

    String extension = "";
    if (originalFileName != null && originalFileName.contains(".")) {
      extension = originalFileName.substring(originalFileName.lastIndexOf("."));
    }

    String fileName = datePrefix + "_" + uuid + extension;
    String filePath = uploads + fileName;

    Path path = Paths.get(filePath);
    Files.createDirectories(path.getParent());
    Files.write(path, file.getBytes());

    return filePath;
  }

  public void updateAttachments(Board board, List<MultipartFile> newFiles, List<Long> keepAttachmentIds) {
    List<BoardAttachment> existingAttachments = attachmentRepository.findByBoardId(board.getId());

    // 삭제 대상 선별: keepAttachmentIds에 없는 기존 첨부파일
    List<BoardAttachment> toDelete = existingAttachments.stream()
        .filter(attachment -> keepAttachmentIds == null || !keepAttachmentIds.contains(attachment.getId()))
        .collect(Collectors.toList());

    // 선택된 첨부파일들 삭제
    for (BoardAttachment attachment : toDelete) {
      deletePhysicalFile(attachment.getFilePath(), attachment.getOriginalFileName());
      attachmentRepository.delete(attachment);
    }

    // 새 첨부파일 업로드
    if (newFiles != null && !newFiles.isEmpty()) {
      uploadAttachment(board, newFiles);
    }
  }

  private void deletePhysicalFile(String dbDirPath, String originalFileName) {
    try {
      String extension = "";
      if (originalFileName != null && originalFileName.contains(".")) {
        extension = originalFileName.substring(originalFileName.lastIndexOf("."));
      }

      Path dirPath = Paths.get(dbDirPath);

      try (DirectoryStream<Path> stream = Files.newDirectoryStream(dirPath, "*_*" + extension)) {
        for (Path entry : stream) {
          Files.deleteIfExists(entry);
          break;
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}

