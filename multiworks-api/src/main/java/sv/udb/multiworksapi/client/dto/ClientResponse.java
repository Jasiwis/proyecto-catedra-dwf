package sv.udb.multiworksapi.client.dto;

import lombok.Builder;
import sv.udb.multiworksapi.enums.PersonType;
import sv.udb.multiworksapi.enums.Status;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record ClientResponse(
        UUID id,
        String name,
        String document,
        PersonType personType,
        String phone,
        String email,
        String address,
        Status status,
        UUID createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime deactivatedAt
) {}
