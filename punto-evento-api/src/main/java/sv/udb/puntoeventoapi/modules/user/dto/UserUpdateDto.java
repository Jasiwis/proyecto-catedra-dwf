package sv.udb.puntoeventoapi.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;
import sv.udb.puntoeventoapi.modules.commons.enums.UserType;

@Data
public class UserUpdateDto {
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    @Email(message = "El formato del email no es válido")
    private String email;

    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    private UserType userType;
    private Boolean active;
}
