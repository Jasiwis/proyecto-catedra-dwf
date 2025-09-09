package sv.udb.multiworksapi.quote.dto;

import lombok.Builder;
import sv.udb.multiworksapi.enums.QuoteStatus;

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
