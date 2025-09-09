package sv.udb.multiworksapi.client.dto;

import jakarta.validation.constraints.*;
import sv.udb.multiworksapi.enums.PersonType;
import sv.udb.multiworksapi.enums.Status;

public record ClientDto(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres.")
        @Pattern(regexp = "^[A-Za-zÁÉÍÓÚÑáéíóúñ\\s']+$", message = "El nombre solo puede contener letras y espacios.")
        String name,

        @NotBlank(message = "El documento es obligatorio.")
        @Size(min = 6, max = 20, message = "El documento debe tener entre 6 y 20 caracteres.")
        @Pattern(regexp = "^[A-Za-z0-9]+$", message = "El documento solo puede contener letras y números.")
        String document,

        @NotNull(message = "El tipo de persona es obligatorio.")
        PersonType personType,

        @Pattern(
                regexp = "^(\\+?\\d{8,15})?$",
                message = "El número de teléfono debe tener entre 8 y 15 dígitos, con o sin prefijo '+'"
        )
        @NotNull(message = "El telefono es obligatorio.")
        String phone,

        @Email(message = "El correo electrónico debe ser válido.")
        @Size(max = 150, message = "El correo electrónico no debe exceder los 150 caracteres.")
        String email,

        @Size(max = 255, message = "La dirección no debe exceder los 255 caracteres.")
        @Pattern(
                regexp = "^[\\w\\s\\.,#-]*$",
                message = "La dirección contiene caracteres no válidos."
        )
        @NotNull(message = "La direccion es obligatoria.")
        String address,

        Status status
) {}
