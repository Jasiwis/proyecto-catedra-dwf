package sv.udb.puntoeventoapi.modules.client.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.udb.puntoeventoapi.modules.client.dto.ClientDto;
import sv.udb.puntoeventoapi.modules.client.dto.ClientResponse;
import sv.udb.puntoeventoapi.modules.commons.common.exceptions.FieldValidationException;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.client.repository.ClientRepository;
import sv.udb.puntoeventoapi.modules.commons.enums.PersonType;
import sv.udb.puntoeventoapi.modules.user.entity.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository repository;

    public ClientResponse create(ClientDto dto, UUID createdBy) {
        if (repository.existsByDocument(dto.document())) {
            throw new FieldValidationException("document", "Documento ya registrado");
        }

        var now = LocalDateTime.now();

        Client client = Client.builder()
                .name(dto.name())
                .document(dto.document())
                .personType(dto.personType())
                .phone(dto.phone())
                .email(dto.email())
                .address(dto.address())
                .status(dto.status() != null ? dto.status() : Status.Activo)
                .createdBy(createdBy)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return toResponse(repository.save(client));
    }

    public List<ClientResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ClientResponse getById(UUID id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public ClientResponse update(UUID id, ClientDto dto, UUID updatedBy) {
        Client client = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (!client.getDocument().equals(dto.document()) && repository.existsByDocument(dto.document())) {
            throw new FieldValidationException("document", "Documento ya registrado");
        }

        client.setName(dto.name());
        client.setDocument(dto.document());
        client.setPersonType(dto.personType());
        client.setPhone(dto.phone());
        client.setEmail(dto.email());
        client.setAddress(dto.address());
        client.setStatus(dto.status() != null ? dto.status() : client.getStatus());
        client.setUpdatedAt(LocalDateTime.now());

        return toResponse(repository.save(client));
    }

    public ClientResponse toggleStatus(UUID id) {
        Client client = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        boolean isActive = client.getStatus() == Status.Activo;

        client.setStatus(isActive ? Status.Inactivo : Status.Activo);
        client.setUpdatedAt(LocalDateTime.now());

        if (isActive) {
            client.setDeactivatedAt(LocalDateTime.now());
        } else {
            client.setDeactivatedAt(null);
        }

        return toResponse(repository.save(client));
    }

    private ClientResponse toResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .name(client.getName())
                .document(client.getDocument())
                .personType(client.getPersonType())
                .phone(client.getPhone())
                .email(client.getEmail())
                .address(client.getAddress())
                .status(client.getStatus())
                .createdBy(client.getCreatedBy())
                .createdAt(client.getCreatedAt())
                .updatedAt(client.getUpdatedAt())
                .deactivatedAt(client.getDeactivatedAt())
                .build();
    }

    public Client getOrCreateByUser(User user) {
        return repository.findByUser_Id(user.getId()).orElseGet(() -> {
            var now = LocalDateTime.now();
            // Generar un documento único basado en el email o timestamp para evitar UUID muy largo
            String document = "AUTO-" + System.currentTimeMillis();
            Client client = Client.builder()
                    .name(user.getName() != null ? user.getName() : user.getEmail())
                    .document(document)
                    .personType(PersonType.Natural)
                    .phone("")
                    .email(user.getEmail())
                    .address("")
                    .status(Status.Activo)
                    .createdBy(user.getId())
                    .createdAt(now)
                    .updatedAt(now)
                    .user(user)
                    .build();
            return repository.save(client);
        });
    }
}
