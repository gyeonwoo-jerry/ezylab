package easylab.easylab.domain.board.service;

import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.BoardImage;
import easylab.easylab.domain.board.repository.BoardImageRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardImageService {

  private final BoardImageRepository boardImageRepository;

  public void uploadImage(Board board, List<MultipartFile> images) {
    try {
      String uploads = "src/main/resources/images/";

      for (MultipartFile image : images) {
        String dbFilePath = saveImage(image, uploads);

        BoardImage boardImage = new BoardImage(board, dbFilePath);
        boardImageRepository.save(boardImage);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private String saveImage(MultipartFile image, String uploads) throws IOException {
    String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + image.getOriginalFilename();

    String filePath = uploads + fileName;

    String dbFilepath = "/uploads/images/" + fileName;

    Path path = Paths.get(filePath);
    Files.createDirectories(path.getParent());
    Files.write(path, image.getBytes());

    return dbFilepath;
  }
}
