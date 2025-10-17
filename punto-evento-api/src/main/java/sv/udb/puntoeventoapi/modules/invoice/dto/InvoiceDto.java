package sv.udb.puntoeventoapi.modules.invoice.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDto {
    
    @NotNull(message = "El ID de la reserva es requerido")
    private UUID reservationId;
    
    @NotBlank(message = "La fecha de emisión es requerida")
    private String issueDate;
    
    @DecimalMin(value = "0.0", message = "El subtotal debe ser mayor o igual a 0")
    private BigDecimal subtotal;
    
    @DecimalMin(value = "0.0", message = "Los impuestos deben ser mayor o igual a 0")
    private BigDecimal taxTotal;
    
    @DecimalMin(value = "0.0", message = "Los costos adicionales deben ser mayor o igual a 0")
    private BigDecimal additionalCosts;
    
    @DecimalMin(value = "0.0", message = "El total debe ser mayor o igual a 0")
    private BigDecimal total;
}
