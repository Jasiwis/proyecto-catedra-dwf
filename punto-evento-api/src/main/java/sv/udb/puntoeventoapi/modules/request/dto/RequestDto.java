package sv.udb.puntoeventoapi.modules.request.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto {
    
    @NotBlank(message = "La fecha del evento es requerida")
    private String eventDate;
    
    @NotBlank(message = "La ubicación es requerida")
    private String location;
    
    @NotNull(message = "Los servicios son requeridos")
    private List<String> requestedServices;
    
    private String notes;
}
