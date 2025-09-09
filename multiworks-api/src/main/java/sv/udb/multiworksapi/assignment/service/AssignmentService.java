package sv.udb.multiworksapi.assignment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.udb.multiworksapi.assignment.dto.AssignmentDto;
import sv.udb.multiworksapi.assignment.dto.AssignmentResponse;
import sv.udb.multiworksapi.entity.Assignment;
import sv.udb.multiworksapi.repository.AssignmentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository repository;

    public AssignmentResponse create(UUID quoteId, AssignmentDto dto) {
        if (dto.endDatetime().isBefore(dto.startDatetime()) || dto.endDatetime().isEqual(dto.startDatetime())) {
            throw new IllegalArgumentException("La fecha de fin debe ser posterior a la fecha de inicio.");
        }

        Assignment assignment = Assignment.builder()
                .quoteId(quoteId)
                .employeeId(dto.employeeId())
                .title(dto.title())
                .startDatetime(dto.startDatetime())
                .endDatetime(dto.endDatetime())
                .estimatedHours(dto.estimatedHours())
                .baseCost(dto.baseCost())
                .extraPercentage(dto.extraPercentage())
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(repository.save(assignment));
    }

    public List<AssignmentResponse> getByQuoteId(UUID quoteId) {
        return repository.findByQuoteId(quoteId).stream()
                .map(this::toResponse)
                .toList();
    }

    public AssignmentResponse getById(UUID id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));
    }

    public AssignmentResponse update(UUID id, AssignmentDto dto) {
        Assignment assignment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));

        assignment.setEmployeeId(dto.employeeId());
        assignment.setTitle(dto.title());
        assignment.setStartDatetime(dto.startDatetime());
        assignment.setEndDatetime(dto.endDatetime());
        assignment.setEstimatedHours(dto.estimatedHours());
        assignment.setBaseCost(dto.baseCost());
        assignment.setExtraPercentage(dto.extraPercentage());
        assignment.setUpdatedAt(LocalDateTime.now());

        return toResponse(repository.save(assignment));
    }

    public void delete(UUID id) {
        Assignment assignment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));
        repository.delete(assignment);
    }

    private AssignmentResponse toResponse(Assignment a) {
        return AssignmentResponse.builder()
                .id(a.getId())
                .quoteId(a.getQuoteId())
                .employeeId(a.getEmployeeId())
                .title(a.getTitle())
                .startDatetime(a.getStartDatetime())
                .endDatetime(a.getEndDatetime())
                .estimatedHours(a.getEstimatedHours())
                .baseCost(a.getBaseCost())
                .extraPercentage(a.getExtraPercentage())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
