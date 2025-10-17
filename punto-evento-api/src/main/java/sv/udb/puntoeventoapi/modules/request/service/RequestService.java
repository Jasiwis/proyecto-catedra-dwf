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
