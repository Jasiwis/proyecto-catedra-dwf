package sv.udb.puntoeventoapi.modules.request.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.request.dto.RequestDto;
import sv.udb.puntoeventoapi.modules.request.dto.RequestResponse;
import sv.udb.puntoeventoapi.modules.request.service.RequestService;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RequestController {
    
    private final RequestService requestService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<RequestResponse>> createRequest(
            @RequestBody RequestDto requestDto,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        ApiResponse<RequestResponse> response = requestService.createRequest(requestDto, userId, userId);
        
        return ResponseEntity.status(response.isSuccess() ? 201 : 400).body(response);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<List<RequestResponse>>> getRequestsByClient(
            @PathVariable UUID clientId) {
        
        ApiResponse<List<RequestResponse>> response = requestService.getRequestsByClient(clientId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<RequestResponse>>> getMyRequests(
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        ApiResponse<List<RequestResponse>> response = requestService.getRequestsByClient(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<RequestResponse>>> getAllRequests() {
        ApiResponse<List<RequestResponse>> response = requestService.getAllRequests();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RequestResponse>> getRequestById(@PathVariable UUID id) {
        ApiResponse<RequestResponse> response = requestService.getRequestById(id);
        
        return ResponseEntity.status(response.isSuccess() ? 200 : 404).body(response);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RequestResponse>> updateRequestStatus(
            @PathVariable UUID id,
            @RequestParam Status status) {
        
        ApiResponse<RequestResponse> response = requestService.updateRequestStatus(id, status);
        return ResponseEntity.ok(response);
    }
}
