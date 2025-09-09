package sv.udb.multiworksapi.quote.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.udb.multiworksapi.enums.QuoteStatus;
import sv.udb.multiworksapi.entity.Quote;
import sv.udb.multiworksapi.quote.dto.QuoteDto;
import sv.udb.multiworksapi.quote.dto.QuoteResponse;
import sv.udb.multiworksapi.repository.QuoteRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuoteService {

    private final QuoteRepository repository;

    public QuoteResponse create(QuoteDto dto) {
        if (dto.startDate() != null && dto.endDate() != null && !dto.startDate().isBefore(dto.endDate())) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin.");
        }

        Quote quote = Quote.builder()
                .clientId(dto.clientId())
                .estimatedHours(dto.estimatedHours())
                .startDate(dto.startDate() != null ? dto.startDate().atStartOfDay() : null)
                .endDate(dto.endDate() != null ? dto.endDate().atStartOfDay() : null)
                .additionalCosts(dto.additionalCosts() != null ? dto.additionalCosts() : 0.0)
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
                .clientId(q.getClientId())
                .estimatedHours(q.getEstimatedHours())
                .startDate(q.getStartDate())
                .endDate(q.getEndDate())
                .additionalCosts(q.getAdditionalCosts())
                .status(q.getStatus())
                .createdAt(q.getCreatedAt())
                .updatedAt(q.getUpdatedAt())
                .build();
    }
}
