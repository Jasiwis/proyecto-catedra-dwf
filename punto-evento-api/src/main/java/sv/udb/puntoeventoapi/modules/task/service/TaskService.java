package sv.udb.puntoeventoapi.modules.task.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.udb.puntoeventoapi.modules.task.entity.Task;
import sv.udb.puntoeventoapi.modules.task.repository.TaskRepository;
import sv.udb.puntoeventoapi.modules.task.dto.TaskDto;
import sv.udb.puntoeventoapi.modules.task.dto.TaskResponse;
import sv.udb.puntoeventoapi.modules.reservation.repository.ReservationRepository;
import sv.udb.puntoeventoapi.modules.assignment.repository.AssignmentRepository;
import sv.udb.puntoeventoapi.modules.commons.enums.TaskStatus;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ReservationRepository reservationRepository;
    private final AssignmentRepository assignmentRepository;

    public ApiResponse<TaskResponse> create(TaskDto dto, UUID createdBy) {
        // Verificar que la reserva existe
        var reservation = reservationRepository.findById(dto.reservationId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Task task = Task.builder()
                .reservation(reservation)
                .serviceId(dto.serviceId())
                .title(dto.title())
                .description(dto.description())
                .status(TaskStatus.PENDIENTE)
                .startDatetime(LocalDateTime.now())
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Task savedTask = taskRepository.save(task);
        return ApiResponse.success(toResponse(savedTask), "Tarea creada exitosamente");
    }

    public ApiResponse<List<TaskResponse>> getByReservation(UUID reservationId) {
        List<Task> tasks = taskRepository.findByReservationId(reservationId);
        List<TaskResponse> responses = tasks.stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.success(responses, "Tareas obtenidas exitosamente");
    }

    public ApiResponse<List<TaskResponse>> getByEmployee(UUID employeeId) {
        // Obtener todas las asignaciones del empleado
        var assignments = assignmentRepository.findByEmployeeId(employeeId);
        
        // Obtener las tareas de esas asignaciones
        List<Task> tasks = assignments.stream()
                .map(assignment -> assignment.getTask())
                .distinct()
                .collect(Collectors.toList());
        
        List<TaskResponse> responses = tasks.stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.success(responses, "Tareas del empleado obtenidas exitosamente");
    }

    public ApiResponse<List<TaskResponse>> getByStatus(TaskStatus status) {
        List<Task> tasks = taskRepository.findByStatus(status);
        List<TaskResponse> responses = tasks.stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.success(responses, "Tareas por estado obtenidas exitosamente");
    }

    public ApiResponse<TaskResponse> getById(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        return ApiResponse.success(toResponse(task), "Tarea obtenida exitosamente");
    }

    public ApiResponse<TaskResponse> update(UUID id, TaskDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        // Verificar que la reserva existe si se está cambiando
        if (!task.getReservation().getId().equals(dto.reservationId())) {
            var reservation = reservationRepository.findById(dto.reservationId())
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            task.setReservation(reservation);
        }

        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setServiceId(dto.serviceId());
        task.setUpdatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);
        return ApiResponse.success(toResponse(savedTask), "Tarea actualizada exitosamente");
    }

    public ApiResponse<TaskResponse> updateStatus(UUID id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        task.setStatus(status);
        if (status == TaskStatus.COMPLETADA) {
            task.setCompletedAt(LocalDateTime.now());
            task.setEndDatetime(LocalDateTime.now());
        }
        task.setUpdatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);
        return ApiResponse.success(toResponse(savedTask), "Estado de tarea actualizado exitosamente");
    }

    public ApiResponse<Void> delete(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        taskRepository.delete(task);
        return ApiResponse.success(null, "Tarea eliminada exitosamente");
    }

    private TaskResponse toResponse(Task task) {
        // Obtener empleados asignados a esta tarea
        var assignments = task.getAssignments();
        String employeeNames = assignments != null && !assignments.isEmpty()
                ? assignments.stream()
                    .map(a -> a.getEmployee().getName())
                    .collect(Collectors.joining(", "))
                : "Sin asignar";
        
        UUID firstEmployeeId = assignments != null && !assignments.isEmpty()
                ? assignments.get(0).getEmployee().getId()
                : null;

        return TaskResponse.builder()
                .id(task.getId())
                .reservationId(task.getReservation().getId())
                .employeeId(firstEmployeeId)
                .employeeName(employeeNames)
                .serviceId(task.getServiceId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .startDatetime(task.getStartDatetime())
                .endDatetime(task.getEndDatetime())
                .completedAt(task.getCompletedAt())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
