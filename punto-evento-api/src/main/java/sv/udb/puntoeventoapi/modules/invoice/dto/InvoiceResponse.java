package sv.udb.puntoeventoapi.modules.invoice.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import java.math.BigDecimal;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    
    private UUID id;
    private Reservation reservation;
    private Client client;
    private String issueDate;
    private Status status;
    private BigDecimal subtotal;
    private BigDecimal taxTotal;
    private BigDecimal additionalCosts;
    private BigDecimal total;
    private UUID createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
