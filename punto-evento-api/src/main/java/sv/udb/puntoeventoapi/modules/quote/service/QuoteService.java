package sv.udb.puntoeventoapi.modules.quote.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.quote.entity.Quote;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteDto;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteResponse;
import sv.udb.puntoeventoapi.modules.quote.dto.ApproveRejectQuoteDto;
import sv.udb.puntoeventoapi.modules.quote.repository.QuoteRepository;
import sv.udb.puntoeventoapi.modules.request.entity.Request;
import sv.udb.puntoeventoapi.modules.request.repository.RequestRepository;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import sv.udb.puntoeventoapi.modules.reservation.repository.ReservationRepository;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.client.repository.ClientRepository;
import sv.udb.puntoeventoapi.modules.quote.entity.QuoteItem;
import sv.udb.puntoeventoapi.modules.quote.repository.QuoteItemRepository;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteItemDto;
import sv.udb.puntoeventoapi.modules.quote.dto.QuoteItemResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Optional;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuoteService {

    private final QuoteRepository repository;
    private final RequestRepository requestRepository;
    private final ReservationRepository reservationRepository;
    private final ClientRepository clientRepository;
    private final QuoteItemRepository quoteItemRepository;

    public ApiResponse<QuoteResponse> createQuoteFromRequest(UUID requestId, UUID createdBy) {
        try {
            // Buscar la solicitud
            Request request = requestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
            
            // Verificar que la solicitud esté activa
            if (request.getStatus() != sv.udb.puntoeventoapi.modules.commons.enums.Status.Activo) {
                return ApiResponse.error("La solicitud debe estar activa para crear una cotización");
            }
            
            // Crear la cotización vinculada a la solicitud
            Quote quote = Quote.builder()
                    .request(request)
                    .client(request.getClient())
                    .eventName(request.getEventName())
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
        if (dto.startDate() != null && dto.endDate() != null && dto.startDate().isAfter(dto.endDate())) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin.");
        }

        // Buscar el cliente
        Client client = clientRepository.findById(dto.clientId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + dto.clientId()));

        // Buscar la solicitud si se proporciona
        Request request = null;
        if (dto.requestId() != null) {
            request = requestRepository.findById(dto.requestId()).orElse(null);
        }

        // Crear la cotización
        Quote quote = Quote.builder()
                .request(request)
                .client(client)
                .eventName(dto.eventName())
                .estimatedHours(dto.estimatedHours())
                .startDate(dto.startDate() != null ? dto.startDate().atStartOfDay() : null)
                .endDate(dto.endDate() != null ? dto.endDate().atStartOfDay() : null)
                .additionalCosts(dto.additionalCosts() != null ? BigDecimal.valueOf(dto.additionalCosts()) : BigDecimal.ZERO)
                .status(QuoteStatus.Pendiente) // Cambiado a Pendiente para que el cliente pueda aprobar/rechazar
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        // Crear los items de la cotización
        BigDecimal subtotalItems = BigDecimal.ZERO;
        BigDecimal taxTotalItems = BigDecimal.ZERO;
        
        for (QuoteItemDto itemDto : dto.items()) {
            QuoteItem item = QuoteItem.builder()
                    .quote(quote)
                    .description(itemDto.description())
                    .quantity(BigDecimal.valueOf(itemDto.quantity()))
                    .unitPrice(BigDecimal.valueOf(itemDto.unitPrice()))
                    .taxRate(new BigDecimal("13.00")) // 13% IVA
                    .createdAt(LocalDateTime.now())
                    .build();
            
            // Calcular subtotal y total del item
            BigDecimal itemSubtotal = item.getQuantity().multiply(item.getUnitPrice());
            BigDecimal itemTax = itemSubtotal.multiply(item.getTaxRate()).divide(new BigDecimal("100"));
            BigDecimal itemTotal = itemSubtotal.add(itemTax);
            
            item.setSubtotal(itemSubtotal);
            item.setTotal(itemTotal);
            
            quote.addItem(item);
            
            subtotalItems = subtotalItems.add(itemSubtotal);
            taxTotalItems = taxTotalItems.add(itemTax);
        }

        // Calcular totales de la cotización
        quote.setSubtotal(subtotalItems);
        quote.setTaxTotal(taxTotalItems);
        BigDecimal total = subtotalItems.add(taxTotalItems).add(quote.getAdditionalCosts());
        quote.setTotal(total);

        Quote savedQuote = repository.save(quote);
        log.info("Cotización creada con {} items. Total: ${}", savedQuote.getItems().size(), savedQuote.getTotal());

        return toResponse(savedQuote);
    }

    public List<QuoteResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public List<QuoteResponse> getByClient(UUID clientId) {
        return repository.findByClientId(clientId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<QuoteResponse> getByClientFiltered(
            UUID clientId,
            Optional<String> q,
            Optional<QuoteStatus> status,
            Optional<String> dateFrom,
            Optional<String> dateTo) {
        List<Quote> quotes = repository.findByClientId(clientId);

        LocalDate from = dateFrom.map(LocalDate::parse).orElse(null);
        LocalDate to = dateTo.map(LocalDate::parse).orElse(null);

        return quotes.stream()
                .filter(qu -> status.map(s -> qu.getStatus() == s).orElse(true))
                .filter(qu -> {
                    if (from == null && to == null) return true;
                    LocalDate ref = null;
                    if (qu.getStartDate() != null) {
                        ref = qu.getStartDate().toLocalDate();
                    } else if (qu.getCreatedAt() != null) {
                        ref = qu.getCreatedAt().toLocalDate();
                    }
                    if (ref == null) return true;
                    boolean geFrom = from == null || !ref.isBefore(from);
                    boolean leTo = to == null || !ref.isAfter(to);
                    return geFrom && leTo;
                })
                .filter(qu -> q.map(text -> {
                    String t = text.toLowerCase();
                    String clientName = qu.getClient() != null && qu.getClient().getName() != null ? qu.getClient().getName().toLowerCase() : "";
                    String eventName = qu.getEventName() != null ? qu.getEventName().toLowerCase() : "";
                    return clientName.contains(t) || eventName.contains(t);
                }).orElse(true))
                .map(this::toResponse)
                .collect(Collectors.toList());
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
    
    /**
     * Aprobar o rechazar una cotización
     * Si se aprueba, automáticamente crea una reservación
     */
    public ApiResponse<QuoteResponse> approveOrRejectQuote(UUID quoteId, ApproveRejectQuoteDto dto, UUID userId) {
        try {
            Quote quote = repository.findById(quoteId)
                    .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));
            
            String action = dto.getAction().toUpperCase();
            
            if ("APROBAR".equals(action)) {
                // Verificar que la cotización esté en estado pendiente o en proceso
                if (quote.getStatus() != QuoteStatus.Pendiente && quote.getStatus() != QuoteStatus.EnProceso) {
                    return ApiResponse.error("Solo se pueden aprobar cotizaciones pendientes o en proceso. Estado actual: " + quote.getStatus());
                }
                
                // Cambiar estado a aprobada
                quote.setStatus(QuoteStatus.Aprobada);
                quote.setUpdatedAt(LocalDateTime.now());
                Quote approvedQuote = repository.save(quote);
                
                // Auto-crear reservación
                try {
                    Reservation reservation = Reservation.builder()
                            .quote(approvedQuote)
                            .client(approvedQuote.getClient())
                            .eventName(approvedQuote.getEventName())
                            .status(ReservationStatus.EN_PLANEACION)
                            .scheduledFor(approvedQuote.getStartDate() != null ? 
                                    approvedQuote.getStartDate().toString() : LocalDateTime.now().toString())
                            .location("Por definir")
                            .notes(dto.getNotes())
                            .progressPercentage(BigDecimal.ZERO)
                            .createdBy(userId)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    
                    reservationRepository.save(reservation);
                    log.info("Reservación auto-creada para cotización aprobada: {}", reservation.getId());
                } catch (Exception e) {
                    log.error("Error al crear reservación automática: {}", e.getMessage());
                    // No fallar la aprobación si falla la creación de reservación
                }
                
                return ApiResponse.success(toResponse(approvedQuote), "Cotización aprobada y reservación creada exitosamente");
                
            } else if ("RECHAZAR".equals(action)) {
                // Verificar que la cotización esté en estado pendiente o en proceso
                if (quote.getStatus() != QuoteStatus.Pendiente && quote.getStatus() != QuoteStatus.EnProceso) {
                    return ApiResponse.error("Solo se pueden rechazar cotizaciones pendientes o en proceso. Estado actual: " + quote.getStatus());
                }
                
                // Cambiar estado a rechazada
                quote.setStatus(QuoteStatus.Rechazada);
                quote.setUpdatedAt(LocalDateTime.now());
                Quote rejectedQuote = repository.save(quote);
                
                return ApiResponse.success(toResponse(rejectedQuote), "Cotización rechazada exitosamente");
                
            } else {
                return ApiResponse.error("Acción inválida. Use 'APROBAR' o 'RECHAZAR'");
            }
            
        } catch (Exception e) {
            log.error("Error al procesar cotización: {}", e.getMessage());
            return ApiResponse.error("Error al procesar cotización: " + e.getMessage());
        }
    }
    
    /**
     * Obtener todas las cotizaciones de una solicitud específica
     */
    public ApiResponse<List<QuoteResponse>> getQuotesByRequest(UUID requestId) {
        try {
            List<Quote> quotes = repository.findByRequestId(requestId);
            List<QuoteResponse> responses = quotes.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            
            return ApiResponse.success(responses, "Cotizaciones obtenidas exitosamente");
        } catch (Exception e) {
            log.error("Error al obtener cotizaciones de solicitud: {}", e.getMessage());
            return ApiResponse.error("Error al obtener cotizaciones: " + e.getMessage());
        }
    }

    private QuoteResponse toResponse(Quote q) {
        // Convertir items a response
        List<QuoteItemResponse> itemsResponse = new ArrayList<>();
        if (q.getItems() != null && !q.getItems().isEmpty()) {
            itemsResponse = q.getItems().stream()
                    .map(this::toItemResponse)
                    .collect(Collectors.toList());
        }
        
        return QuoteResponse.builder()
                .id(q.getId())
                .requestId(q.getRequest() != null ? q.getRequest().getId() : null)
                .client(q.getClient())
                .eventName(q.getEventName())
                .estimatedHours(q.getEstimatedHours())
                .startDate(q.getStartDate())
                .endDate(q.getEndDate())
                .subtotal(q.getSubtotal())
                .taxTotal(q.getTaxTotal())
                .additionalCosts(q.getAdditionalCosts())
                .total(q.getTotal())
                .status(q.getStatus())
                .items(itemsResponse)
                .createdBy(q.getCreatedBy())
                .createdAt(q.getCreatedAt())
                .updatedAt(q.getUpdatedAt())
                .build();
    }
    
    private QuoteItemResponse toItemResponse(QuoteItem item) {
        return QuoteItemResponse.builder()
                .id(item.getId())
                .serviceId(item.getServiceId())
                .serviceName(null) // Por ahora no tenemos catálogo de servicios
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .taxRate(item.getTaxRate())
                .subtotal(item.getSubtotal())
                .total(item.getTotal())
                .build();
    }
}
