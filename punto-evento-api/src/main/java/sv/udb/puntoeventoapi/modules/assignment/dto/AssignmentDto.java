package sv.udb.puntoeventoapi.modules.assignment.dto;

import jakarta.validation.constraints.*;
import java.util.UUID;

public record AssignmentDto(

        @NotNull(message = "El empleado es obligatorio")
        UUID employeeId,

        String notes

) {}
