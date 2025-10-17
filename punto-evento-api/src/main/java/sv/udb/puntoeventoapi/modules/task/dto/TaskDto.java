package sv.udb.puntoeventoapi.modules.task.dto;

import jakarta.validation.constraints.*;
import java.util.UUID;

public record TaskDto(
        @NotNull(message = "El ID de reserva es obligatorio.")
        UUID reservationId,

        @NotNull(message = "El ID de empleado es obligatorio.")
        UUID employeeId,

        @NotBlank(message = "El título es obligatorio.")
        @Size(min = 3, max = 100, message = "El título debe tener entre 3 y 100 caracteres.")
        String title,

        @Size(max = 500, message = "La descripción no debe exceder los 500 caracteres.")
        String description,

        UUID serviceId
) {
}
