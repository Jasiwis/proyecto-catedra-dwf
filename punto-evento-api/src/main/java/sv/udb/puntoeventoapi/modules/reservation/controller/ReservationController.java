package sv.udb.puntoeventoapi.modules.reservation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationDto;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationResponse;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationDetailResponse;
import sv.udb.puntoeventoapi.modules.reservation.service.ReservationService;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus;
import sv.udb.puntoeventoapi.modules.commons.common.annotations.CurrentUser;
import sv.udb.puntoeventoapi.modules.user.entity.User;
import sv.udb.puntoeventoapi.modules.client.service.ClientService;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {
    
    private final ReservationService reservationService;
    private final ClientService clientService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @RequestBody ReservationDto reservationDto,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        ApiResponse<ReservationResponse> response = reservationService.createReservation(reservationDto, userId);
        
        return ResponseEntity.status(response.isSuccess() ? 201 : 400).body(response);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReservationDetailResponse>>> getAllReservations() {
        ApiResponse<List<ReservationDetailResponse>> response = reservationService.getAllReservations();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<List<ReservationDetailResponse>>> getReservationsByClient(
            @PathVariable UUID clientId) {
        
        ApiResponse<List<ReservationDetailResponse>> response = reservationService.getReservationsByClient(clientId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my-reservations")
    public ResponseEntity<ApiResponse<List<ReservationDetailResponse>>> getMyReservations(
            @CurrentUser User currentUser,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo) {
        
        var client = clientService.getOrCreateByUser(currentUser);
        ApiResponse<List<ReservationDetailResponse>> response = reservationService.getReservationsByClientFiltered(
                client.getId(),
                java.util.Optional.ofNullable(q),
                java.util.Optional.ofNullable(status),
                java.util.Optional.ofNullable(dateFrom),
                java.util.Optional.ofNullable(dateTo)
        );
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationDetailResponse>> getReservationById(@PathVariable UUID id) {
        ApiResponse<ReservationDetailResponse> response = reservationService.getReservationById(id);
        
        return ResponseEntity.status(response.isSuccess() ? 200 : 404).body(response);
    }
    
    @PatchMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateProgress(
            @PathVariable UUID id,
            @RequestParam BigDecimal progressPercentage) {
        
        ApiResponse<ReservationResponse> response = reservationService.updateReservationProgress(id, progressPercentage);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam ReservationStatus status) {
        
        ApiResponse<ReservationResponse> response = reservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<ReservationDetailResponse>> publishReservation(@PathVariable UUID id) {
        ApiResponse<ReservationDetailResponse> response = reservationService.publishReservation(id);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }
}
