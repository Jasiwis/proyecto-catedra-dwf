package sv.udb.multiworksapi.quote.dto;

import jakarta.validation.constraints.*;
import sv.udb.multiworksapi.enums.QuoteStatus;

import java.time.LocalDate;
import java.util.UUID;

public record QuoteDto(

        @NotNull(message = "El cliente es obligatorio.")
        UUID clientId,

        @NotNull(message = "Las horas estimadas son obligatorias.")
        @Positive(message = "Las horas deben ser mayores que 0.")
        Integer estimatedHours,

        @NotNull(message = "La fecha de inicio es obligatoria.")
        @FutureOrPresent(message = "La fecha de inicio no puede ser pasada.")
        LocalDate startDate,

        @NotNull(message = "La fecha de fin es obligatoria.")
        @Future(message = "La fecha de fin debe ser futura.")
        LocalDate endDate,

        @NotNull(message = "El costo adicional es obligatorio.")
        @DecimalMin(value = "0.0", inclusive = true, message = "El costo adicional no puede ser negativo.")
        Double additionalCosts,

        QuoteStatus status

) {}
