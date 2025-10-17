package sv.udb.puntoeventoapi.quote.dto;

import lombok.Builder;
import sv.udb.puntoeventoapi.enums.QuoteStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record QuoteResponse(
        UUID id,
        UUID clientId,
        Integer estimatedHours,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Double additionalCosts,
        QuoteStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
