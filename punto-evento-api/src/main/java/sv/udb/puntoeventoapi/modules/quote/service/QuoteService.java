package sv.udb.puntoeventoapi.modules.quote.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.quote.entity.Quote;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteDto;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteResponse;
import sv.udb.puntoeventoapi.modules.quote.repository.QuoteRepository;
import sv.udb.puntoeventoapi.modules.request.entity.Request;
import sv.udb.puntoeventoapi.modules.request.repository.RequestRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuoteService {

    private final QuoteRepository repository;
    private final RequestRepository requestRepository;

    public ApiResponse<QuoteResponse> createQuoteFromRequest(UUID requestId, UUID createdBy) {
        try {
            // Buscar la solicitud
            Request request = requestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
            
            // Verificar que la solicitud esté activa
            if (request.getStatus() != sv.udb.puntoeventoapi.modules.commons.enums.Status.Activo) {
                return ApiResponse.error("La solicitud debe estar activa para crear una cotización");
            }
            
            // Crear la cotización
            Quote quote = Quote.builder()
                    .client(request.getClient())
                    .subtotal(BigDecimal.ZERO)
                    .taxTotal(BigDecimal.ZERO)
                    .additionalCosts(BigDecimal.ZERO)
                    .total(BigDecimal.ZERO)
                    .status(QuoteStatus.Pendiente)
                    .createdBy(createdBy)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            Quote savedQuote = repository.save(quote);
            log.info("Cotización creada desde solicitud: {}", savedQuote.getId());
            
            return ApiResponse.success(toResponse(savedQuote), "Cotización creada exitosamente");
        } catch (Exception e) {
            log.error("Error al crear cotización: {}", e.getMessage());
            return ApiResponse.error("Error al crear cotización: " + e.getMessage());
        }
    }
    
    public QuoteResponse create(QuoteDto dto) {
        if (dto.startDate() != null && dto.endDate() != null && !dto.startDate().isBefore(dto.endDate())) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin.");
        }

        Quote quote = Quote.builder()
                .estimatedHours(dto.estimatedHours())
                .startDate(dto.startDate() != null ? dto.startDate().atStartOfDay() : null)
                .endDate(dto.endDate() != null ? dto.endDate().atStartOfDay() : null)
                .additionalCosts(dto.additionalCosts() != null ? BigDecimal.valueOf(dto.additionalCosts()) : BigDecimal.ZERO)
                .status(QuoteStatus.EnProceso)
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(repository.save(quote));
    }

    public List<QuoteResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public QuoteResponse getById(UUID id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));
    }

    public ApiResponse<QuoteResponse> updateQuotePrices(UUID id, BigDecimal subtotal, BigDecimal taxTotal, BigDecimal additionalCosts) {
        try {
            Quote quote = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));
            
            quote.setSubtotal(subtotal);
            quote.setTaxTotal(taxTotal);
            quote.setAdditionalCosts(additionalCosts);
            quote.setTotal(subtotal.add(taxTotal).add(additionalCosts));
            quote.setUpdatedAt(LocalDateTime.now());
            
            Quote savedQuote = repository.save(quote);
            log.info("Precios de cotización actualizados: {}", id);
            
            return ApiResponse.success(toResponse(savedQuote), "Precios actualizados exitosamente");
        } catch (Exception e) {
            log.error("Error al actualizar precios: {}", e.getMessage());
            return ApiResponse.error("Error al actualizar precios: " + e.getMessage());
        }
    }
    
    public ApiResponse<QuoteResponse> approveQuote(UUID id) {
        try {
            Quote quote = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));
            
            if (quote.getStatus() != QuoteStatus.Pendiente) {
                return ApiResponse.error("Solo se pueden aprobar cotizaciones pendientes");
            }
            
            quote.setStatus(QuoteStatus.Aprobada);
            quote.setUpdatedAt(LocalDateTime.now());
            
            Quote savedQuote = repository.save(quote);
            log.info("Cotización aprobada: {}", id);
            
            return ApiResponse.success(toResponse(savedQuote), "Cotización aprobada exitosamente");
        } catch (Exception e) {
            log.error("Error al aprobar cotización: {}", e.getMessage());
            return ApiResponse.error("Error al aprobar cotización: " + e.getMessage());
        }
    }
    
    public QuoteResponse updateStatus(UUID id, QuoteStatus status) {
        Quote quote = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));

        quote.setStatus(status);
        quote.setUpdatedAt(LocalDateTime.now());

        return toResponse(repository.save(quote));
    }

    private QuoteResponse toResponse(Quote q) {
        return QuoteResponse.builder()
                .id(q.getId())
                .client(q.getClient())
                .estimatedHours(q.getEstimatedHours())
                .startDate(q.getStartDate())
                .endDate(q.getEndDate())
                .subtotal(q.getSubtotal())
                .taxTotal(q.getTaxTotal())
                .additionalCosts(q.getAdditionalCosts())
                .total(q.getTotal())
                .status(q.getStatus())
                .createdBy(q.getCreatedBy())
                .createdAt(q.getCreatedAt())
                .updatedAt(q.getUpdatedAt())
                .build();
    }
}
