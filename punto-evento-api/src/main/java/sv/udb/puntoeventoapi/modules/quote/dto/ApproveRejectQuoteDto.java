package sv.udb.puntoeventoapi.modules.quote.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApproveRejectQuoteDto {
    
    @NotBlank(message = "La acción es requerida (APROBAR o RECHAZAR)")
    private String action; // "APROBAR" o "RECHAZAR"
    
    private String notes; // Notas opcionales del cliente
}

