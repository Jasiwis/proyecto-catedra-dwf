package sv.udb.puntoeventoapi.modules.reservation.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.quote.entity.Quote;
import java.math.BigDecimal;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    
    private UUID id;
    private Quote quote;
    private Client client;
    private String eventName;
    private ReservationStatus status;
    private String scheduledFor;
    private String location;
    private String notes;
    private BigDecimal progressPercentage;
    private UUID createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
