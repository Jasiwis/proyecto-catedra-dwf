package sv.udb.puntoeventoapi.modules.request.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.request.dto.RequestDto;
import sv.udb.puntoeventoapi.modules.request.dto.RequestResponse;
import sv.udb.puntoeventoapi.modules.request.service.RequestService;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.commons.common.annotations.CurrentUser;
import sv.udb.puntoeventoapi.modules.user.entity.User;
import sv.udb.puntoeventoapi.modules.user.repository.UserRepository;
import sv.udb.puntoeventoapi.modules.client.repository.ClientRepository;
import sv.udb.puntoeventoapi.modules.client.service.ClientService;
import sv.udb.puntoeventoapi.modules.quote.service.QuoteService;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RequestController {
    
    private final RequestService requestService;
    private final ClientRepository clientRepository;
    private final ClientService clientService;
    private final QuoteService quoteService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<RequestResponse>> createRequest(
            @RequestBody RequestDto requestDto,
            @CurrentUser User currentUser) {
        
        var client = clientService.getOrCreateByUser(currentUser);

        ApiResponse<RequestResponse> response = requestService.createRequest(requestDto, client.getId(), currentUser.getId());
        
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
            @CurrentUser User currentUser,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo) {
        
        var client = clientService.getOrCreateByUser(currentUser);

        ApiResponse<List<RequestResponse>> response = requestService.getRequestsByClientFiltered(
                client.getId(),
                java.util.Optional.ofNullable(q),
                java.util.Optional.ofNullable(status),
                java.util.Optional.ofNullable(dateFrom),
                java.util.Optional.ofNullable(dateTo)
        );
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
    
    /**
     * Obtener todas las cotizaciones de una solicitud específica
     */
    @GetMapping("/{id}/quotes")
    public ResponseEntity<ApiResponse<List<QuoteResponse>>> getQuotesByRequest(@PathVariable UUID id) {
        ApiResponse<List<QuoteResponse>> response = quoteService.getQuotesByRequest(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crear una cotización desde una solicitud (solo admins)
     */
    @PostMapping("/{id}/create-quote")
    public ResponseEntity<ApiResponse<QuoteResponse>> createQuoteFromRequest(
            @PathVariable UUID id,
            @CurrentUser User currentUser) {
        
        ApiResponse<QuoteResponse> response = quoteService.createQuoteFromRequest(id, currentUser.getId());
        return ResponseEntity.status(response.isSuccess() ? 201 : 400).body(response);
    }
}
