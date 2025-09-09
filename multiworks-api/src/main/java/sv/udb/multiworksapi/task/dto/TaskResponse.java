package sv.udb.multiworksapi.task.dto;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record TaskResponse(
        UUID id,
        UUID assignmentId,
        String title,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
