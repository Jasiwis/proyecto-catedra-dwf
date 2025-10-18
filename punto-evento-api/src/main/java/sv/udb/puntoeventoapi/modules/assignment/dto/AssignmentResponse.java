package sv.udb.puntoeventoapi.modules.assignment.dto;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record AssignmentResponse(
        UUID id,
        UUID taskId,
        UUID employeeId,
        String employeeName,
        UUID assignedBy,
        LocalDateTime assignedAt,
        String notes
) {}
