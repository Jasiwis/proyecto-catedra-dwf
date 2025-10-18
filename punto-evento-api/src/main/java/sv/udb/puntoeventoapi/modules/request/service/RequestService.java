package sv.udb.puntoeventoapi.modules.request.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.udb.puntoeventoapi.modules.request.dto.RequestDto;
import sv.udb.puntoeventoapi.modules.request.dto.RequestResponse;
import sv.udb.puntoeventoapi.modules.request.entity.Request;
import sv.udb.puntoeventoapi.modules.request.repository.RequestRepository;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.client.repository.ClientRepository;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RequestService {
    
    private final RequestRepository requestRepository;
    private final ClientRepository clientRepository;
    
    public ApiResponse<RequestResponse> createRequest(RequestDto requestDto, UUID clientId, UUID createdBy) {
        try {
            // Buscar el cliente
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            
            // Crear la solicitud
            Request request = Request.builder()
                    .eventName(requestDto.getEventName())
                    .eventDate(requestDto.getEventDate())
                    .location(requestDto.getLocation())
                    .requestedServices(String.join(",", requestDto.getRequestedServices()))
                    .notes(requestDto.getNotes())
                    .status(Status.Activo)
                    .client(client)
                    .createdBy(createdBy)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            Request savedRequest = requestRepository.save(request);
            log.info("Solicitud creada: {}", savedRequest.getId());
            
            return ApiResponse.success(toResponse(savedRequest), "Solicitud creada exitosamente");
        } catch (Exception e) {
            log.error("Error al crear solicitud: {}", e.getMessage());
            return ApiResponse.error("Error al crear solicitud: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<RequestResponse>> getRequestsByClient(UUID clientId) {
        try {
            List<Request> requests = requestRepository.findByClientId(clientId);
            List<RequestResponse> responses = requests.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Solicitudes obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener solicitudes: {}", e.getMessage());
            return ApiResponse.error("Error al obtener solicitudes: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<RequestResponse>> getRequestsByClientFiltered(
            UUID clientId,
            Optional<String> q,
            Optional<Status> status,
            Optional<String> dateFrom,
            Optional<String> dateTo) {
        try {
            List<Request> requests = requestRepository.findByClientId(clientId);

            LocalDate from = dateFrom.map(LocalDate::parse).orElse(null);
            LocalDate to = dateTo.map(LocalDate::parse).orElse(null);

            List<RequestResponse> responses = requests.stream()
                    .filter(r -> status.map(s -> r.getStatus() == s).orElse(true))
                    .filter(r -> {
                        if (from == null && to == null) return true;
                        try {
                            LocalDate ev = LocalDate.parse(r.getEventDate());
                            boolean geFrom = from == null || !ev.isBefore(from);
                            boolean leTo = to == null || !ev.isAfter(to);
                            return geFrom && leTo;
                        } catch (Exception ex) {
                            return true;
                        }
                    })
                    .filter(r -> q.map(text -> {
                        String t = text.toLowerCase();
                        return (r.getEventName() != null && r.getEventName().toLowerCase().contains(t))
                                || (r.getLocation() != null && r.getLocation().toLowerCase().contains(t))
                                || (r.getRequestedServices() != null && r.getRequestedServices().toLowerCase().contains(t))
                                || (r.getNotes() != null && r.getNotes().toLowerCase().contains(t));
                    }).orElse(true))
                    .map(this::toResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success(responses, "Solicitudes filtradas exitosamente");
        } catch (Exception e) {
            log.error("Error al filtrar solicitudes: {}", e.getMessage());
            return ApiResponse.error("Error al filtrar solicitudes: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<RequestResponse>> getAllRequests() {
        try {
            List<Request> requests = requestRepository.findAll();
            List<RequestResponse> responses = requests.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Solicitudes obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener solicitudes: {}", e.getMessage());
            return ApiResponse.error("Error al obtener solicitudes: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<RequestResponse> getRequestById(UUID id) {
        try {
            Request request = requestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
            
            return ApiResponse.success(toResponse(request), "Solicitud obtenida exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener solicitud: {}", e.getMessage());
            return ApiResponse.error("Error al obtener solicitud: " + e.getMessage());
        }
    }
    
    public ApiResponse<RequestResponse> updateRequestStatus(UUID id, Status status) {
        try {
            Request request = requestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
            
            request.setStatus(status);
            request.setUpdatedAt(LocalDateTime.now());
            
            Request savedRequest = requestRepository.save(request);
            log.info("Estado de solicitud actualizado: {} -> {}", id, status);
            
            return ApiResponse.success(toResponse(savedRequest), "Estado actualizado exitosamente");
        } catch (Exception e) {
            log.error("Error al actualizar estado: {}", e.getMessage());
            return ApiResponse.error("Error al actualizar estado: " + e.getMessage());
        }
    }
    
    private RequestResponse toResponse(Request request) {
        return RequestResponse.builder()
                .id(request.getId())
                .eventName(request.getEventName())
                .eventDate(request.getEventDate())
                .location(request.getLocation())
                .requestedServices(request.getRequestedServices())
                .notes(request.getNotes())
                .status(request.getStatus())
                .client(request.getClient())
                .createdBy(request.getCreatedBy())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
