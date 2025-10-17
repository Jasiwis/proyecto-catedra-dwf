package sv.udb.puntoeventoapi.modules.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationDto;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationResponse;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import sv.udb.puntoeventoapi.modules.reservation.repository.ReservationRepository;
import sv.udb.puntoeventoapi.modules.quote.entity.Quote;
import sv.udb.puntoeventoapi.modules.quote.repository.QuoteRepository;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final QuoteRepository quoteRepository;
    
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
                    .status(Status.Activo)
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
    public ApiResponse<List<ReservationResponse>> getAllReservations() {
        try {
            List<Reservation> reservations = reservationRepository.findAll();
            List<ReservationResponse> responses = reservations.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Reservas obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener reservas: {}", e.getMessage());
            return ApiResponse.error("Error al obtener reservas: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<ReservationResponse>> getReservationsByClient(UUID clientId) {
        try {
            List<Reservation> reservations = reservationRepository.findByClientId(clientId);
            List<ReservationResponse> responses = reservations.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Reservas obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener reservas: {}", e.getMessage());
            return ApiResponse.error("Error al obtener reservas: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<ReservationResponse> getReservationById(UUID id) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            return ApiResponse.success(toResponse(reservation), "Reserva obtenida exitosamente");
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
                reservation.setStatus(Status.Inactivo);
            }
            
            Reservation savedReservation = reservationRepository.save(reservation);
            log.info("Progreso de reserva actualizado: {} -> {}", id, progressPercentage);
            
            return ApiResponse.success(toResponse(savedReservation), "Progreso actualizado exitosamente");
        } catch (Exception e) {
            log.error("Error al actualizar progreso: {}", e.getMessage());
            return ApiResponse.error("Error al actualizar progreso: " + e.getMessage());
        }
    }
    
    public ApiResponse<ReservationResponse> updateReservationStatus(UUID id, Status status) {
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
    
    private ReservationResponse toResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .quote(reservation.getQuote())
                .client(reservation.getClient())
                .status(reservation.getStatus())
                .scheduledFor(reservation.getScheduledFor())
                .location(reservation.getLocation())
                .notes(reservation.getNotes())
                .progressPercentage(reservation.getProgressPercentage())
                .createdBy(reservation.getCreatedBy())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }
}
