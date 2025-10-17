package sv.udb.puntoeventoapi.modules.invoice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.invoice.dto.InvoiceDto;
import sv.udb.puntoeventoapi.modules.invoice.dto.InvoiceResponse;
import sv.udb.puntoeventoapi.modules.invoice.service.InvoiceService;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InvoiceController {
    
    private final InvoiceService invoiceService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(
            @RequestBody InvoiceDto invoiceDto,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        ApiResponse<InvoiceResponse> response = invoiceService.createInvoice(invoiceDto, userId);
        
        return ResponseEntity.status(response.isSuccess() ? 201 : 400).body(response);
    }
    
    @PostMapping("/generate/{reservationId}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> generateInvoiceFromReservation(
            @PathVariable UUID reservationId,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        ApiResponse<InvoiceResponse> response = invoiceService.generateInvoiceFromReservation(reservationId, userId);
        
        return ResponseEntity.status(response.isSuccess() ? 201 : 400).body(response);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAllInvoices() {
        ApiResponse<List<InvoiceResponse>> response = invoiceService.getAllInvoices();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByClient(
            @PathVariable UUID clientId) {
        
        ApiResponse<List<InvoiceResponse>> response = invoiceService.getInvoicesByClient(clientId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my-invoices")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getMyInvoices(
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        ApiResponse<List<InvoiceResponse>> response = invoiceService.getInvoicesByClient(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable UUID id) {
        ApiResponse<InvoiceResponse> response = invoiceService.getInvoiceById(id);
        
        return ResponseEntity.status(response.isSuccess() ? 200 : 404).body(response);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateInvoiceStatus(
            @PathVariable UUID id,
            @RequestParam Status status) {
        
        ApiResponse<InvoiceResponse> response = invoiceService.updateInvoiceStatus(id, status);
        return ResponseEntity.ok(response);
    }
}
