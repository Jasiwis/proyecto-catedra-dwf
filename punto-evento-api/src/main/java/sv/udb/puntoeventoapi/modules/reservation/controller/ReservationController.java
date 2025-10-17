package sv.udb.puntoeventoapi.modules.reservation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationDto;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationResponse;
import sv.udb.puntoeventoapi.modules.reservation.service.ReservationService;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {
    
    private final ReservationService reservationService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @RequestBody ReservationDto reservationDto,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        ApiResponse<ReservationResponse> response = reservationService.createReservation(reservationDto, userId);
        
        return ResponseEntity.status(response.isSuccess() ? 201 : 400).body(response);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getAllReservations() {
        ApiResponse<List<ReservationResponse>> response = reservationService.getAllReservations();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getReservationsByClient(
            @PathVariable UUID clientId) {
        
        ApiResponse<List<ReservationResponse>> response = reservationService.getReservationsByClient(clientId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my-reservations")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMyReservations(
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        ApiResponse<List<ReservationResponse>> response = reservationService.getReservationsByClient(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservationById(@PathVariable UUID id) {
        ApiResponse<ReservationResponse> response = reservationService.getReservationById(id);
        
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
            @RequestParam Status status) {
        
        ApiResponse<ReservationResponse> response = reservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok(response);
    }
}
