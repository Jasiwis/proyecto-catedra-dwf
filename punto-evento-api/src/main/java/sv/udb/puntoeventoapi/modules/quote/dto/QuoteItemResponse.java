package sv.udb.puntoeventoapi.modules.quote.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record QuoteItemResponse(
        UUID id,
        UUID serviceId,
        String serviceName,
        String description,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal taxRate,
        BigDecimal subtotal,
        BigDecimal total
) {}

