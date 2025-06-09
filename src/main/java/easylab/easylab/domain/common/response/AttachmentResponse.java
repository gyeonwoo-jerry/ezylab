package easylab.easylab.domain.common.response;

public record AttachmentResponse(
    Long id,
    String filePath,
    String originalFileName
) {
}
