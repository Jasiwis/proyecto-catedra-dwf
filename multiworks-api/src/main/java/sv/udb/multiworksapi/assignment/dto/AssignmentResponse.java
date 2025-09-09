package sv.udb.multiworksapi.assignment.dto;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record AssignmentResponse(
        UUID id,
        UUID quoteId,
        UUID employeeId,
        String title,
        LocalDateTime startDatetime,
        LocalDateTime endDatetime,
        Integer estimatedHours,
        Double baseCost,
        Double extraPercentage,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
