package sv.udb.puntoeventoapi.modules.user.dto;

import lombok.Data;
import sv.udb.puntoeventoapi.modules.commons.enums.UserType;

import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private UserType userType;
    private Boolean active;
    private String createdAt;
    private String updatedAt;
}
