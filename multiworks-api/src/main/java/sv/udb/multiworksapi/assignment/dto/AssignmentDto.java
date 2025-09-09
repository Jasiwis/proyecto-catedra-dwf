package sv.udb.multiworksapi.assignment.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentDto(

        @NotNull(message = "El empleado es obligatorio")
        UUID employeeId,

        @NotBlank(message = "El título es obligatorio")
        @Size(min = 3, max = 100, message = "El título debe tener entre 3 y 100 caracteres")
        String title,

        @NotNull(message = "Fecha de inicio requerida")
        @FutureOrPresent(message = "La fecha de inicio no puede ser en el pasado")
        LocalDateTime startDatetime,

        @NotNull(message = "Fecha de fin requerida")
        @Future(message = "La fecha de fin debe ser futura")
        LocalDateTime endDatetime,

        @NotNull(message = "Debe proporcionar una estimación de horas")
        @Positive(message = "Las horas deben ser mayores que 0")
        Integer estimatedHours,

        @NotNull(message = "Debe proporcionar un costo base")
        @DecimalMin(value = "0.0", inclusive = false, message = "El costo base debe ser mayor que 0")
        Double baseCost,

        @NotNull(message = "Debe proporcionar un porcentaje extra")
        @DecimalMin(value = "0.0", message = "El porcentaje extra no puede ser negativo")
        @DecimalMax(value = "100.0", message = "El porcentaje extra no puede superar el 100%")
        Double extraPercentage

) {}
