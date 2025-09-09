package sv.udb.multiworksapi.task.dto;

import jakarta.validation.constraints.*;

public record TaskDto(
        @NotBlank(message = "El título es obligatorio.")
        @Size(min = 3, max = 100, message = "El título debe tener entre 3 y 100 caracteres.")
        String title,

        @Size(max = 255, message = "La descripción no debe exceder los 255 caracteres.")
        String description
) {
}
