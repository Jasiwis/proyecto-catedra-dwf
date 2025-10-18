package sv.udb.puntoeventoapi.modules.quote.dto;

import lombok.Builder;
import sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus;
import sv.udb.puntoeventoapi.modules.client.entity.Client;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Builder
public record QuoteResponse(
        UUID id,
        UUID requestId,
        Client client,
        String eventName,
        Integer estimatedHours,
        LocalDateTime startDate,
        LocalDateTime endDate,
        BigDecimal subtotal,
        BigDecimal taxTotal,
        BigDecimal additionalCosts,
        BigDecimal total,
        QuoteStatus status,
        List<QuoteItemResponse> items,
        UUID createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
