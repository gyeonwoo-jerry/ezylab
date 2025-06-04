package easylab.easylab.domain.common.response;

import lombok.Builder;

@Builder
public record ImageResponse(
    Long id,
    String url
) {
}
