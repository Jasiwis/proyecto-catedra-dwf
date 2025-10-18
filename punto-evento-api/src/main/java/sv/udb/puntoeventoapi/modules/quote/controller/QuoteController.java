package sv.udb.puntoeventoapi.modules.quote.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponseUtil;
import sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteDto;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteResponse;
import sv.udb.puntoeventoapi.modules.quote.dto.ApproveRejectQuoteDto;
import sv.udb.puntoeventoapi.modules.quote.service.QuoteService;
import sv.udb.puntoeventoapi.modules.user.repository.UserRepository;
import sv.udb.puntoeventoapi.modules.client.repository.ClientRepository;
import sv.udb.puntoeventoapi.modules.commons.common.annotations.CurrentUser;
import sv.udb.puntoeventoapi.modules.user.entity.User;
import sv.udb.puntoeventoapi.modules.client.service.ClientService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService service;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<ApiResponse<QuoteResponse>> create(@RequestBody @Valid QuoteDto dto) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.create(dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuoteResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuoteResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getById(UUID.fromString(id))));
    }

    @PutMapping("/finish/{id}")
    public ResponseEntity<ApiResponse<QuoteResponse>> finish(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.updateStatus(UUID.fromString(id), QuoteStatus.Finalizada)));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<QuoteResponse>> cancel(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.updateStatus(UUID.fromString(id), QuoteStatus.Cancelada)));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<List<QuoteResponse>>> getByClient(@PathVariable String clientId) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getByClient(UUID.fromString(clientId))));
    }

    @GetMapping("/my-quotes")
    public ResponseEntity<ApiResponse<List<QuoteResponse>>> getMyQuotes(
            @CurrentUser User currentUser,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus status,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo) {
        var client = clientService.getOrCreateByUser(currentUser);
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.getByClientFiltered(
                        client.getId(),
                        java.util.Optional.ofNullable(q),
                        java.util.Optional.ofNullable(status),
                        java.util.Optional.ofNullable(dateFrom),
                        java.util.Optional.ofNullable(dateTo)
                )
        ));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<ApiResponse<QuoteResponse>> approve(@PathVariable String id) {
        return ResponseEntity.ok(service.approveQuote(UUID.fromString(id)));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<ApiResponse<QuoteResponse>> reject(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.updateStatus(UUID.fromString(id), QuoteStatus.Rechazada)));
    }
    
    /**
     * Aprobar o rechazar una cotización (cliente)
     * Al aprobar se crea automáticamente una reservación
     */
    @PostMapping("/{id}/action")
    public ResponseEntity<ApiResponse<QuoteResponse>> approveOrReject(
            @PathVariable UUID id,
            @RequestBody @Valid ApproveRejectQuoteDto dto,
            @CurrentUser User currentUser) {
        
        ApiResponse<QuoteResponse> response = service.approveOrRejectQuote(id, dto, currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
