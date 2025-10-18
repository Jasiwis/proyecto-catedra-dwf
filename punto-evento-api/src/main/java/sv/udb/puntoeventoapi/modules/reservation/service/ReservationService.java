package sv.udb.puntoeventoapi.modules.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationDto;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationResponse;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationDetailResponse;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import sv.udb.puntoeventoapi.modules.reservation.repository.ReservationRepository;
import sv.udb.puntoeventoapi.modules.quote.entity.Quote;
import sv.udb.puntoeventoapi.modules.quote.entity.QuoteItem;
import sv.udb.puntoeventoapi.modules.quote.repository.QuoteRepository;
import sv.udb.puntoeventoapi.modules.task.repository.TaskRepository;
import sv.udb.puntoeventoapi.modules.task.entity.Task;
import sv.udb.puntoeventoapi.modules.task.dto.TaskResponse;
import sv.udb.puntoeventoapi.modules.request.entity.Request;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;

import java.math.BigDecimal;
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
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final QuoteRepository quoteRepository;
    private final TaskRepository taskRepository;
    
    public ApiResponse<ReservationResponse> createReservation(ReservationDto reservationDto, UUID createdBy) {
        try {
            // Buscar la cotización
            Quote quote = quoteRepository.findById(reservationDto.getQuoteId())
                    .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));
            
            // Verificar que la cotización esté aprobada
            if (quote.getStatus() != sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus.Aprobada) {
                return ApiResponse.error("La cotización debe estar aprobada para crear una reserva");
            }
            
            // Verificar que no exista ya una reserva para esta cotización
            if (reservationRepository.findByQuoteId(reservationDto.getQuoteId()).isPresent()) {
                return ApiResponse.error("Ya existe una reserva para esta cotización");
            }
            
            // Crear la reserva
            Reservation reservation = Reservation.builder()
                    .quote(quote)
                    .client(quote.getClient())
                    .eventName(reservationDto.getEventName())
                    .status(ReservationStatus.EN_PLANEACION)
                    .scheduledFor(reservationDto.getScheduledFor())
                    .location(reservationDto.getLocation())
                    .notes(reservationDto.getNotes())
                    .progressPercentage(reservationDto.getProgressPercentage() != null ? 
                            reservationDto.getProgressPercentage() : BigDecimal.ZERO)
                    .createdBy(createdBy)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            Reservation savedReservation = reservationRepository.save(reservation);
            log.info("Reserva creada: {}", savedReservation.getId());
            
            return ApiResponse.success(toResponse(savedReservation), "Reserva creada exitosamente");
        } catch (Exception e) {
            log.error("Error al crear reserva: {}", e.getMessage());
            return ApiResponse.error("Error al crear reserva: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<ReservationDetailResponse>> getAllReservations() {
        try {
            List<Reservation> reservations = reservationRepository.findAll();
            List<ReservationDetailResponse> responses = reservations.stream()
                    .map(this::toDetailResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Reservas obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener reservas: {}", e.getMessage());
            return ApiResponse.error("Error al obtener reservas: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<ReservationDetailResponse>> getReservationsByClient(UUID clientId) {
        try {
            List<Reservation> reservations = reservationRepository.findByClientId(clientId);
            List<ReservationDetailResponse> responses = reservations.stream()
                    .map(this::toDetailResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Reservas obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener reservas: {}", e.getMessage());
            return ApiResponse.error("Error al obtener reservas: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<ReservationDetailResponse>> getReservationsByClientFiltered(
            UUID clientId,
            Optional<String> q,
            Optional<ReservationStatus> status,
            Optional<String> dateFrom,
            Optional<String> dateTo) {
        try {
            log.info("Filtrando reservas para cliente: {}", clientId);
            List<Reservation> reservations = reservationRepository.findByClientId(clientId);
            log.info("Reservas encontradas: {}", reservations.size());

            LocalDate from = dateFrom.map(LocalDate::parse).orElse(null);
            LocalDate to = dateTo.map(LocalDate::parse).orElse(null);

            List<ReservationDetailResponse> responses = reservations.stream()
                    .filter(r -> status.map(s -> r.getStatus() == s).orElse(true))
                    .filter(r -> {
                        if (from == null && to == null) return true;
                        try {
                            if (r.getScheduledFor() == null || r.getScheduledFor().length() < 10) {
                                log.warn("Reserva {} tiene scheduledFor inválido: {}", r.getId(), r.getScheduledFor());
                                return true;
                            }
                            LocalDate ev = LocalDate.parse(r.getScheduledFor().substring(0, 10));
                            boolean geFrom = from == null || !ev.isBefore(from);
                            boolean leTo = to == null || !ev.isAfter(to);
                            return geFrom && leTo;
                        } catch (Exception ex) {
                            log.warn("Error parseando fecha de reserva {}: {}", r.getId(), ex.getMessage());
                            return true;
                        }
                    })
                    .filter(r -> q.map(text -> {
                        String t = text.toLowerCase();
                        return (r.getEventName() != null && r.getEventName().toLowerCase().contains(t))
                                || (r.getLocation() != null && r.getLocation().toLowerCase().contains(t))
                                || (r.getNotes() != null && r.getNotes().toLowerCase().contains(t));
                    }).orElse(true))
                    .map(this::toDetailResponse)
                    .collect(Collectors.toList());

            log.info("Reservas filtradas: {}", responses.size());
            return ApiResponse.success(responses, "Reservas filtradas exitosamente");
        } catch (Exception e) {
            log.error("Error al filtrar reservas para cliente {}: {}", clientId, e.getMessage(), e);
            return ApiResponse.error("Error al filtrar reservas: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<ReservationDetailResponse> getReservationById(UUID id) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            return ApiResponse.success(toDetailResponse(reservation), "Reserva obtenida exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener reserva: {}", e.getMessage());
            return ApiResponse.error("Error al obtener reserva: " + e.getMessage());
        }
    }
    
    public ApiResponse<ReservationResponse> updateReservationProgress(UUID id, BigDecimal progressPercentage) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            reservation.setProgressPercentage(progressPercentage);
            reservation.setUpdatedAt(LocalDateTime.now());
            
            // Si el progreso es 100%, marcar como finalizada
            if (progressPercentage.compareTo(new BigDecimal("100")) >= 0) {
                reservation.setStatus(ReservationStatus.FINALIZADA);
            }
            
            Reservation savedReservation = reservationRepository.save(reservation);
            log.info("Progreso de reserva actualizado: {} -> {}", id, progressPercentage);
            
            return ApiResponse.success(toResponse(savedReservation), "Progreso actualizado exitosamente");
        } catch (Exception e) {
            log.error("Error al actualizar progreso: {}", e.getMessage());
            return ApiResponse.error("Error al actualizar progreso: " + e.getMessage());
        }
    }
    
    public ApiResponse<ReservationResponse> updateReservationStatus(UUID id, ReservationStatus status) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            reservation.setStatus(status);
            reservation.setUpdatedAt(LocalDateTime.now());
            
            Reservation savedReservation = reservationRepository.save(reservation);
            log.info("Estado de reserva actualizado: {} -> {}", id, status);
            
            return ApiResponse.success(toResponse(savedReservation), "Estado actualizado exitosamente");
        } catch (Exception e) {
            log.error("Error al actualizar estado: {}", e.getMessage());
            return ApiResponse.error("Error al actualizar estado: " + e.getMessage());
        }
    }
    
    public ApiResponse<ReservationDetailResponse> publishReservation(UUID id) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            // Validar que la reservación esté en EN_PLANEACION
            if (reservation.getStatus() != ReservationStatus.EN_PLANEACION) {
                return ApiResponse.error("La reservación debe estar en estado EN_PLANEACION para ser publicada");
            }
            
            // Validar que tenga al menos una tarea
            List<Task> tasks = taskRepository.findByReservationId(id);
            if (tasks.isEmpty()) {
                return ApiResponse.error("La reservación debe tener al menos una tarea antes de ser publicada");
            }
            
            // Cambiar el estado a PROGRAMADA
            reservation.setStatus(ReservationStatus.PROGRAMADA);
            reservation.setUpdatedAt(LocalDateTime.now());
            
            Reservation savedReservation = reservationRepository.save(reservation);
            log.info("Reservación publicada: {} -> PROGRAMADA", id);
            
            return ApiResponse.success(toDetailResponse(savedReservation), "Reservación publicada exitosamente");
        } catch (Exception e) {
            log.error("Error al publicar reservación: {}", e.getMessage());
            return ApiResponse.error("Error al publicar reservación: " + e.getMessage());
        }
    }
    
    private ReservationResponse toResponse(Reservation reservation) {
        // Cargar las tareas de esta reservación
        List<Task> tasks = taskRepository.findByReservationId(reservation.getId());
        List<TaskResponse> taskResponses = tasks.stream()
                .map(this::taskToResponse)
                .collect(Collectors.toList());
        
        return ReservationResponse.builder()
                .id(reservation.getId())
                .quote(reservation.getQuote())
                .client(reservation.getClient())
                .eventName(reservation.getEventName())
                .status(reservation.getStatus())
                .scheduledFor(reservation.getScheduledFor())
                .location(reservation.getLocation())
                .notes(reservation.getNotes())
                .progressPercentage(reservation.getProgressPercentage())
                .createdBy(reservation.getCreatedBy())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .tasks(taskResponses)
                .build();
    }
    
    private TaskResponse taskToResponse(Task task) {
        // Obtener empleados asignados a esta tarea
        var assignments = task.getAssignments();
        String employeeNames = assignments != null && !assignments.isEmpty()
                ? assignments.stream()
                    .map(a -> a.getEmployee().getName())
                    .collect(Collectors.joining(", "))
                : "Sin asignar";
        
        UUID firstEmployeeId = assignments != null && !assignments.isEmpty()
                ? assignments.get(0).getEmployee().getId()
                : null;

        return TaskResponse.builder()
                .id(task.getId())
                .reservationId(task.getReservation().getId())
                .employeeId(firstEmployeeId)
                .employeeName(employeeNames)
                .serviceId(task.getServiceId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .startDatetime(task.getStartDatetime())
                .endDatetime(task.getEndDatetime())
                .completedAt(task.getCompletedAt())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
    
    private ReservationDetailResponse toDetailResponse(Reservation reservation) {
        // Información del cliente
        Client client = reservation.getClient();
        ReservationDetailResponse.ClientInfo clientInfo = ReservationDetailResponse.ClientInfo.builder()
                .id(client.getId())
                .name(client.getName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .build();
        
        // Información de la cotización
        Quote quote = reservation.getQuote();
        ReservationDetailResponse.QuoteInfo quoteInfo = ReservationDetailResponse.QuoteInfo.builder()
                .id(quote.getId())
                .eventName(quote.getEventName())
                .estimatedHours(quote.getEstimatedHours())
                .subtotal(quote.getSubtotal())
                .taxTotal(quote.getTaxTotal())
                .additionalCosts(quote.getAdditionalCosts())
                .total(quote.getTotal())
                .status(quote.getStatus().name())
                .build();
        
        // Información de la solicitud (request)
        ReservationDetailResponse.RequestInfo requestInfo = null;
        Request request = quote.getRequest();
        if (request != null) {
            requestInfo = ReservationDetailResponse.RequestInfo.builder()
                    .id(request.getId())
                    .eventName(request.getEventName())
                    .eventDate(request.getEventDate())
                    .location(request.getLocation())
                    .requestedServices(request.getRequestedServices())
                    .notes(request.getNotes())
                    .build();
        }
        
        // Servicios de la cotización
        List<ReservationDetailResponse.ServiceInfo> services = quote.getItems().stream()
                .map(item -> ReservationDetailResponse.ServiceInfo.builder()
                        .id(item.getId())
                        .description(item.getDescription())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .total(item.getTotal())
                        .build())
                .collect(Collectors.toList());
        
        // Tareas de la reservación
        List<Task> tasks = taskRepository.findByReservationId(reservation.getId());
        List<ReservationDetailResponse.TaskInfo> taskInfos = tasks.stream()
                .map(task -> {
                    var assignments = task.getAssignments();
                    String employeeNames = assignments != null && !assignments.isEmpty()
                            ? assignments.stream()
                                .map(a -> a.getEmployee().getName())
                                .collect(Collectors.joining(", "))
                            : "Sin asignar";
                    
                    return ReservationDetailResponse.TaskInfo.builder()
                            .id(task.getId())
                            .title(task.getTitle())
                            .description(task.getDescription())
                            .status(task.getStatus().name())
                            .employeeName(employeeNames)
                            .startDatetime(task.getStartDatetime())
                            .endDatetime(task.getEndDatetime())
                            .completedAt(task.getCompletedAt())
                            .build();
                })
                .collect(Collectors.toList());
        
        return ReservationDetailResponse.builder()
                .id(reservation.getId())
                .eventName(reservation.getEventName())
                .scheduledFor(reservation.getScheduledFor())
                .location(reservation.getLocation())
                .status(reservation.getStatus())
                .progressPercentage(reservation.getProgressPercentage())
                .notes(reservation.getNotes())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .client(clientInfo)
                .quote(quoteInfo)
                .request(requestInfo)
                .services(services)
                .tasks(taskInfos)
                .build();
    }
}
