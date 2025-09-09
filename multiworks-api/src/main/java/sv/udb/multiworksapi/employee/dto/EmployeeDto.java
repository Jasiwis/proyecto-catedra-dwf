package sv.udb.multiworksapi.employee.dto;

import jakarta.validation.constraints.*;
import sv.udb.multiworksapi.enums.ContractType;
import sv.udb.multiworksapi.enums.PersonType;
import sv.udb.multiworksapi.enums.Status;

public record EmployeeDto(
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

        @NotNull(message = "El tipo de contrato es obligatorio.")
        ContractType contractType,

        @NotBlank(message = "El número de teléfono es obligatorio.")
        @Pattern(
                regexp = "^(\\+?\\d{8,15})$",
                message = "El número de teléfono debe tener entre 8 y 15 dígitos, con o sin prefijo '+'"
        )
        String phone,

        @NotBlank(message = "El correo electrónico es obligatorio.")
        @Email(message = "El correo electrónico debe ser válido.")
        @Size(max = 150, message = "El correo electrónico no debe exceder los 150 caracteres.")
        String email,

        @NotBlank(message = "La dirección es obligatoria.")
        @Size(max = 255, message = "La dirección no debe exceder los 255 caracteres.")
        @Pattern(
                regexp = "^[\\w\\s\\.,#-]*$",
                message = "La dirección contiene caracteres no válidos."
        )
        String address,

        Status status
) {}
