// EmployeeResponse.java
package sv.udb.puntoeventoapi.modules.employee.dto;

import lombok.Builder;
import sv.udb.puntoeventoapi.modules.commons.enums.ContractType;
import sv.udb.puntoeventoapi.modules.commons.enums.PersonType;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record EmployeeResponse(
        UUID id,
        String name,
        String document,
        PersonType personType,
        ContractType contractType,
        String phone,
        String email,
        String address,
        Status status,
        UUID createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime deactivatedAt
) {}
