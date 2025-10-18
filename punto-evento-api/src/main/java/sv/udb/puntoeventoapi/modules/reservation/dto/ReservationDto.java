package sv.udb.puntoeventoapi.modules.reservation.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    
    @NotNull(message = "El ID de la cotización es requerido")
    private UUID quoteId;
    
    @NotBlank(message = "El nombre del evento es requerido")
    private String eventName;
    
    @NotBlank(message = "La fecha programada es requerida")
    private String scheduledFor;
    
    @NotBlank(message = "La ubicación es requerida")
    private String location;
    
    private String notes;
    
    private BigDecimal progressPercentage;
}
