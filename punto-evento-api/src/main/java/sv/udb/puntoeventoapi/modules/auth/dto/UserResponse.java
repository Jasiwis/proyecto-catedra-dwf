package sv.udb.puntoeventoapi.modules.auth.dto;

import lombok.*;
import sv.udb.puntoeventoapi.modules.commons.enums.UserType;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private UserType userType;
    private Boolean active;
    private String createdAt;
    private String updatedAt;
}
