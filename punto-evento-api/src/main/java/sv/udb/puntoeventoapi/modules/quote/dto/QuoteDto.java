package sv.udb.puntoeventoapi.modules.quote.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record QuoteDto(

        UUID requestId,

        @NotNull(message = "El cliente es obligatorio.")
        UUID clientId,

        @NotBlank(message = "El nombre del evento es obligatorio.")
        String eventName,

        @NotNull(message = "Las horas estimadas son obligatorias.")
        @Positive(message = "Las horas deben ser mayores que 0.")
        Integer estimatedHours,

        @NotNull(message = "La fecha de inicio es obligatoria.")
        @FutureOrPresent(message = "La fecha de inicio no puede ser pasada.")
        LocalDate startDate,

        @NotNull(message = "La fecha de fin es obligatoria.")
        @FutureOrPresent(message = "La fecha de fin no puede ser pasada.")
        LocalDate endDate,

        @DecimalMin(value = "0.0", inclusive = true, message = "El costo adicional no puede ser negativo.")
        Double additionalCosts,

        @NotNull(message = "Debe incluir al menos un servicio.")
        @Size(min = 1, message = "Debe incluir al menos un servicio.")
        @Valid
        List<QuoteItemDto> items,

        QuoteStatus status

) {}
