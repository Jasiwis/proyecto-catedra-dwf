package sv.udb.puntoeventoapi.modules.assignment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.udb.puntoeventoapi.modules.assignment.dto.AssignmentDto;
import sv.udb.puntoeventoapi.modules.assignment.dto.AssignmentResponse;
import sv.udb.puntoeventoapi.modules.assignment.entity.Assignment;
import sv.udb.puntoeventoapi.modules.assignment.repository.AssignmentRepository;
import sv.udb.puntoeventoapi.modules.task.repository.TaskRepository;
import sv.udb.puntoeventoapi.modules.employee.repository.EmployeeRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository repository;
    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public AssignmentResponse create(UUID taskId, AssignmentDto dto, UUID createdBy) {
        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        var employee = employeeRepository.findById(dto.employeeId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        Assignment assignment = Assignment.builder()
                .task(task)
                .employee(employee)
                .assignedBy(createdBy)
                .assignedAt(LocalDateTime.now())
                .notes(dto.notes())
                .build();

        return toResponse(repository.save(assignment));
    }

    public List<AssignmentResponse> getByTaskId(UUID taskId) {
        return repository.findByTaskId(taskId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AssignmentResponse> getByEmployeeId(UUID employeeId) {
        return repository.findByEmployeeId(employeeId).stream()
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

        if (dto.employeeId() != null && !assignment.getEmployee().getId().equals(dto.employeeId())) {
            var employee = employeeRepository.findById(dto.employeeId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            assignment.setEmployee(employee);
        }

        assignment.setNotes(dto.notes());

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
                .taskId(a.getTask() != null ? a.getTask().getId() : null)
                .employeeId(a.getEmployee() != null ? a.getEmployee().getId() : null)
                .employeeName(a.getEmployee() != null ? a.getEmployee().getName() : null)
                .assignedBy(a.getAssignedBy())
                .assignedAt(a.getAssignedAt())
                .notes(a.getNotes())
                .build();
    }
}
