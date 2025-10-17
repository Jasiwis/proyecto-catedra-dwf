package sv.udb.puntoeventoapi.modules.task.dto;

import lombok.Builder;
import sv.udb.puntoeventoapi.modules.commons.enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record TaskResponse(
        UUID id,
        UUID reservationId,
        UUID employeeId,
        String employeeName,
        UUID serviceId,
        String title,
        String description,
        TaskStatus status,
        LocalDateTime startDatetime,
        LocalDateTime endDatetime,
        LocalDateTime completedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
