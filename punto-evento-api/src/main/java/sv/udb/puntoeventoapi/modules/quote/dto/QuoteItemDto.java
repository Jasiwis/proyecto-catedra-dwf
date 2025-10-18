package sv.udb.puntoeventoapi.modules.quote.dto;

import jakarta.validation.constraints.*;

import java.util.UUID;

public record QuoteItemDto(
        
        UUID serviceId,
        
        @NotBlank(message = "La descripción del servicio es obligatoria.")
        String description,
        
        @NotNull(message = "La cantidad es obligatoria.")
        @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor que 0.")
        Double quantity,
        
        @NotNull(message = "El precio unitario es obligatorio.")
        @DecimalMin(value = "0.0", message = "El precio unitario no puede ser negativo.")
        Double unitPrice
) {}

