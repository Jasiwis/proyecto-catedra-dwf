package sv.udb.puntoeventoapi.modules.invoice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.udb.puntoeventoapi.modules.invoice.dto.InvoiceDto;
import sv.udb.puntoeventoapi.modules.invoice.dto.InvoiceResponse;
import sv.udb.puntoeventoapi.modules.invoice.entity.Invoice;
import sv.udb.puntoeventoapi.modules.invoice.repository.InvoiceRepository;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import sv.udb.puntoeventoapi.modules.reservation.repository.ReservationRepository;
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
public class InvoiceService {
    
    private final InvoiceRepository invoiceRepository;
    private final ReservationRepository reservationRepository;
    
    public ApiResponse<InvoiceResponse> createInvoice(InvoiceDto invoiceDto, UUID createdBy) {
        try {
            // Buscar la reserva
            Reservation reservation = reservationRepository.findById(invoiceDto.getReservationId())
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            // Verificar que la reserva esté finalizada
            if (reservation.getStatus() != sv.udb.puntoeventoapi.modules.commons.enums.Status.Inactivo) {
                return ApiResponse.error("La reserva debe estar finalizada para generar la factura");
            }
            
            // Verificar que no exista ya una factura para esta reserva
            if (invoiceRepository.findByReservationId(invoiceDto.getReservationId()).isPresent()) {
                return ApiResponse.error("Ya existe una factura para esta reserva");
            }
            
            // Crear la factura
            Invoice invoice = Invoice.builder()
                    .reservation(reservation)
                    .client(reservation.getClient())
                    .issueDate(invoiceDto.getIssueDate())
                    .status(Status.Activo)
                    .subtotal(invoiceDto.getSubtotal())
                    .taxTotal(invoiceDto.getTaxTotal())
                    .additionalCosts(invoiceDto.getAdditionalCosts())
                    .total(invoiceDto.getTotal())
                    .createdBy(createdBy)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            Invoice savedInvoice = invoiceRepository.save(invoice);
            log.info("Factura creada: {}", savedInvoice.getId());
            
            return ApiResponse.success(toResponse(savedInvoice), "Factura creada exitosamente");
        } catch (Exception e) {
            log.error("Error al crear factura: {}", e.getMessage());
            return ApiResponse.error("Error al crear factura: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<InvoiceResponse>> getAllInvoices() {
        try {
            List<Invoice> invoices = invoiceRepository.findAll();
            List<InvoiceResponse> responses = invoices.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Facturas obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener facturas: {}", e.getMessage());
            return ApiResponse.error("Error al obtener facturas: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<InvoiceResponse>> getInvoicesByClient(UUID clientId) {
        try {
            List<Invoice> invoices = invoiceRepository.findByClientId(clientId);
            List<InvoiceResponse> responses = invoices.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Facturas obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener facturas: {}", e.getMessage());
            return ApiResponse.error("Error al obtener facturas: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<InvoiceResponse> getInvoiceById(UUID id) {
        try {
            Invoice invoice = invoiceRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
            
            return ApiResponse.success(toResponse(invoice), "Factura obtenida exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener factura: {}", e.getMessage());
            return ApiResponse.error("Error al obtener factura: " + e.getMessage());
        }
    }
    
    public ApiResponse<InvoiceResponse> updateInvoiceStatus(UUID id, Status status) {
        try {
            Invoice invoice = invoiceRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
            
            invoice.setStatus(status);
            invoice.setUpdatedAt(LocalDateTime.now());
            
            Invoice savedInvoice = invoiceRepository.save(invoice);
            log.info("Estado de factura actualizado: {} -> {}", id, status);
            
            return ApiResponse.success(toResponse(savedInvoice), "Estado actualizado exitosamente");
        } catch (Exception e) {
            log.error("Error al actualizar estado: {}", e.getMessage());
            return ApiResponse.error("Error al actualizar estado: " + e.getMessage());
        }
    }
    
    public ApiResponse<InvoiceResponse> generateInvoiceFromReservation(UUID reservationId, UUID createdBy) {
        try {
            // Buscar la reserva
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            // Verificar que la reserva esté finalizada
            if (reservation.getStatus() != sv.udb.puntoeventoapi.modules.commons.enums.Status.Inactivo) {
                return ApiResponse.error("La reserva debe estar finalizada para generar la factura");
            }
            
            // Verificar que no exista ya una factura
            if (invoiceRepository.findByReservationId(reservationId).isPresent()) {
                return ApiResponse.error("Ya existe una factura para esta reserva");
            }
            
            // Obtener los totales de la cotización asociada
            BigDecimal subtotal = reservation.getQuote().getSubtotal();
            BigDecimal taxTotal = reservation.getQuote().getTaxTotal();
            BigDecimal additionalCosts = reservation.getQuote().getAdditionalCosts();
            BigDecimal total = reservation.getQuote().getTotal();
            
            // Crear la factura
            Invoice invoice = Invoice.builder()
                    .reservation(reservation)
                    .client(reservation.getClient())
                    .issueDate(LocalDateTime.now().toString())
                    .status(Status.Activo)
                    .subtotal(subtotal)
                    .taxTotal(taxTotal)
                    .additionalCosts(additionalCosts)
                    .total(total)
                    .createdBy(createdBy)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            Invoice savedInvoice = invoiceRepository.save(invoice);
            log.info("Factura generada automáticamente: {}", savedInvoice.getId());
            
            return ApiResponse.success(toResponse(savedInvoice), "Factura generada exitosamente");
        } catch (Exception e) {
            log.error("Error al generar factura: {}", e.getMessage());
            return ApiResponse.error("Error al generar factura: " + e.getMessage());
        }
    }
    
    private InvoiceResponse toResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .reservation(invoice.getReservation())
                .client(invoice.getClient())
                .issueDate(invoice.getIssueDate())
                .status(invoice.getStatus())
                .subtotal(invoice.getSubtotal())
                .taxTotal(invoice.getTaxTotal())
                .additionalCosts(invoice.getAdditionalCosts())
                .total(invoice.getTotal())
                .createdBy(invoice.getCreatedBy())
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt())
                .build();
    }
}
