package sv.udb.puntoeventoapi.modules.task.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.UUID;

public record TaskDto(
        @NotNull(message = "El ID de reserva es obligatorio.")
        UUID reservationId,

        @NotBlank(message = "El título es obligatorio.")
        @Size(min = 3, max = 100, message = "El título debe tener entre 3 y 100 caracteres.")
        String title,

        @Size(max = 500, message = "La descripción no debe exceder los 500 caracteres.")
        String description,

        UUID serviceId,

        // Empleado asignado
        UUID employeeId,

        // Fechas de inicio y fin
        @NotNull(message = "La fecha de inicio es obligatoria.")
        LocalDateTime startDatetime,

        @NotNull(message = "La fecha de fin es obligatoria.")
        LocalDateTime endDatetime
) {
}
