package easylab.easylab.domain.portfolio.service;

import easylab.easylab.domain.board.entity.Board;
import easylab.easylab.domain.board.entity.BoardImage;
import easylab.easylab.domain.board.repository.BoardImageRepository;
import easylab.easylab.domain.portfolio.entity.Portfolio;
import easylab.easylab.domain.portfolio.entity.PortfolioImage;
import easylab.easylab.domain.portfolio.repository.PortfolioImageRepository;
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
public class PortfolioImageService {

  @Value("${filepath.image}")
  private String filepath;

  private final PortfolioImageRepository portfolioImageRepository;

  public void uploadImage(Portfolio portfolio, List<MultipartFile> images) {
    if (images == null || images.isEmpty()) {
      return;
    }

    try {
      String uploads = filepath+"portfolio/";

      for (MultipartFile image : images) {
        String originalFileName = image.getOriginalFilename();
        String dbFilePath = saveImage(image, uploads);

        PortfolioImage portfolioImage = PortfolioImage.builder()
            .portfolio(portfolio)
            .imagePath(dbFilePath)
            .originalFileName(originalFileName)
            .build();

        portfolioImageRepository.save(portfolioImage);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private String saveImage(MultipartFile image, String uploads) throws IOException {
    String originalFileName = image.getOriginalFilename();
    String uuid = UUID.randomUUID().toString().replace("-", "");
    String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")); // "20250326"

    // 확장자 추출
    String extension = "";
    if (originalFileName != null && originalFileName.contains(".")) {
      extension = originalFileName.substring(originalFileName.lastIndexOf("."));
    }

    String fileName = datePrefix + "_" + uuid + extension; // UUID 뒤에 확장자만 붙임

    String filePath = uploads + fileName; // 실제 저장 경로

    Path path = Paths.get(filePath);
    Files.createDirectories(path.getParent()); // 디렉토리 생성
    Files.write(path, image.getBytes()); // 파일 저장

    return filePath; // DB에 저장할 파일 경로 반환
  }

  public void updateImages(Portfolio portfolio, List<MultipartFile> newImages, List<Long> keepImageIds) {
    List<PortfolioImage> existingImages = portfolioImageRepository.findByPortfolioId(portfolio.getId());

    // 삭제 대상 선별: keepImageIds에 없는 기존 이미지
    List<PortfolioImage> toDelete = existingImages.stream()
        .filter(img -> keepImageIds == null || !keepImageIds.contains(img.getId()))
        .collect(Collectors.toList());

    for (PortfolioImage image : toDelete) {
      deletePhysicalFile(image.getImagePath(), image.getOriginalFileName());
      portfolioImageRepository.delete(image);
    }

    // 새 이미지 업로드
    if (newImages != null && !newImages.isEmpty()) {
      uploadImage(portfolio, newImages);
    }
  }

  private void deletePhysicalFile(String dbDirPath, String originalFileName) {
    try {
      // 기존의 확장자 추출 로직 유지
      String extension = "";
      if (originalFileName != null && originalFileName.contains(".")) {
        extension = originalFileName.substring(originalFileName.lastIndexOf("."));
      }

      // 디렉토리 경로에서 마지막에 저장된 파일 찾기
      Path dirPath = Paths.get(dbDirPath);

      // 해당 디렉토리에서 날짜_UUID + 확장자 패턴의 파일 찾기
      try (DirectoryStream<Path> stream = Files.newDirectoryStream(dirPath,
          "*_*" + extension)) {
        for (Path entry : stream) {
          Files.deleteIfExists(entry);
          break; // 첫 번째 매칭되는 파일만 삭제
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
