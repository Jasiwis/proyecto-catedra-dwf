package sv.udb.puntoeventoapi.modules.task.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import sv.udb.puntoeventoapi.modules.task.entity.Task;
import sv.udb.puntoeventoapi.modules.task.repository.TaskRepository;
import sv.udb.puntoeventoapi.modules.task.dto.TaskDto;
import sv.udb.puntoeventoapi.modules.task.dto.TaskResponse;
import sv.udb.puntoeventoapi.modules.reservation.repository.ReservationRepository;
import sv.udb.puntoeventoapi.modules.assignment.repository.AssignmentRepository;
import sv.udb.puntoeventoapi.modules.assignment.entity.Assignment;
import sv.udb.puntoeventoapi.modules.employee.repository.EmployeeRepository;
import sv.udb.puntoeventoapi.modules.commons.enums.TaskStatus;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final ReservationRepository reservationRepository;
    private final AssignmentRepository assignmentRepository;
    private final EmployeeRepository employeeRepository;

    public ApiResponse<TaskResponse> create(TaskDto dto, UUID createdBy) {
        try {
            // Verificar que la reserva existe
            var reservation = reservationRepository.findById(dto.reservationId())
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

            // Validar que la reservación esté en EN_PLANEACION
            if (reservation.getStatus() != sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus.EN_PLANEACION) {
                return ApiResponse.error("Solo se pueden agregar tareas cuando la reservación está en estado EN_PLANEACION");
            }

            // Validar fechas
            LocalDateTime now = LocalDateTime.now();
            
            // 1. La fecha de inicio no puede ser en el pasado
            if (dto.startDatetime().isBefore(now)) {
                return ApiResponse.error("La fecha de inicio no puede ser en el pasado");
            }

            // 2. La fecha de fin debe ser mayor o igual a la fecha de inicio
            if (dto.endDatetime().isBefore(dto.startDatetime())) {
                return ApiResponse.error("La fecha de fin debe ser mayor o igual a la fecha de inicio");
            }

            // 3. Las fechas no pueden ser posteriores a la fecha del evento
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime eventDate = LocalDateTime.parse(reservation.getScheduledFor(), formatter);
                
                if (dto.startDatetime().isAfter(eventDate)) {
                    return ApiResponse.error("La fecha de inicio no puede ser posterior a la fecha del evento");
                }
                
                if (dto.endDatetime().isAfter(eventDate)) {
                    return ApiResponse.error("La fecha de fin no puede ser posterior a la fecha del evento");
                }
            } catch (Exception e) {
                log.warn("No se pudo validar contra la fecha del evento: {}", e.getMessage());
            }

            // Validar empleado si se proporciona
            if (dto.employeeId() != null) {
                var employee = employeeRepository.findById(dto.employeeId())
                        .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
                
                if (employee.getStatus() != Status.Activo) {
                    return ApiResponse.error("El empleado no está activo");
                }
            }

            Task task = Task.builder()
                    .reservation(reservation)
                    .serviceId(dto.serviceId())
                    .title(dto.title())
                    .description(dto.description())
                    .status(TaskStatus.PENDIENTE)
                    .startDatetime(dto.startDatetime())
                    .endDatetime(dto.endDatetime())
                    .createdBy(createdBy)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Task savedTask = taskRepository.save(task);

            // Crear asignación si se proporciona un empleado
            if (dto.employeeId() != null) {
                var employee = employeeRepository.findById(dto.employeeId()).get();
                
                Assignment assignment = Assignment.builder()
                        .task(savedTask)
                        .employee(employee)
                        .assignedBy(createdBy)
                        .assignedAt(LocalDateTime.now())
                        .build();
                
                assignmentRepository.save(assignment);
                log.info("Tarea {} asignada al empleado {}", savedTask.getId(), employee.getName());
            }

            return ApiResponse.success(toResponse(savedTask), "Tarea creada exitosamente");
        } catch (Exception e) {
            log.error("Error al crear tarea: {}", e.getMessage(), e);
            return ApiResponse.error("Error al crear tarea: " + e.getMessage());
        }
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

    public ApiResponse<List<TaskResponse>> getMyTasks(UUID userId) {
        try {
            // Buscar el empleado asociado al usuario
            var employeeOpt = employeeRepository.findByUserId(userId);
            
            if (employeeOpt.isEmpty()) {
                log.warn("No se encontró empleado asociado al usuario: {}", userId);
                return ApiResponse.success(List.of(), "No hay empleado asociado a este usuario");
            }
            
            var employee = employeeOpt.get();
            log.info("Obteniendo tareas para empleado: {} (userId: {})", employee.getId(), userId);
            
            // Obtener las tareas del empleado
            return getByEmployee(employee.getId());
        } catch (Exception e) {
            log.error("Error al obtener tareas del usuario {}: {}", userId, e.getMessage(), e);
            return ApiResponse.error("Error al obtener tareas: " + e.getMessage());
        }
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

        TaskStatus previousStatus = task.getStatus();
        task.setStatus(status);
        if (status == TaskStatus.COMPLETADA) {
            task.setCompletedAt(LocalDateTime.now());
            task.setEndDatetime(LocalDateTime.now());
        }
        task.setUpdatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);
        
        // Actualizar estado de la reservación automáticamente
        updateReservationStatusBasedOnTasks(savedTask.getReservation().getId(), previousStatus, status);
        
        return ApiResponse.success(toResponse(savedTask), "Estado de tarea actualizado exitosamente");
    }
    
    /**
     * Actualiza el estado de la reservación basado en el estado de las tareas
     * - Primera tarea EN_PROCESO → Reservación EN_CURSO
     * - Todas las tareas COMPLETADA → Reservación FINALIZADA
     */
    private void updateReservationStatusBasedOnTasks(UUID reservationId, TaskStatus previousStatus, TaskStatus newStatus) {
        var reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservación no encontrada"));
        
        // Obtener todas las tareas de la reservación
        List<Task> allTasks = taskRepository.findByReservationId(reservationId);
        
        if (allTasks.isEmpty()) {
            return;
        }
        
        // Si una tarea pasa de PENDIENTE a EN_PROCESO y la reservación está en PROGRAMADA
        if (previousStatus == TaskStatus.PENDIENTE && newStatus == TaskStatus.EN_PROCESO) {
            if (reservation.getStatus() == sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus.PROGRAMADA) {
                reservation.setStatus(sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus.ENCURSO);
                reservation.setUpdatedAt(LocalDateTime.now());
                reservationRepository.save(reservation);
            }
        }
        
        // Si todas las tareas están COMPLETADA, marcar reservación como FINALIZADA
        boolean allTasksCompleted = allTasks.stream()
                .allMatch(t -> t.getStatus() == TaskStatus.COMPLETADA);
        
        if (allTasksCompleted && allTasks.size() > 0) {
            reservation.setStatus(sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus.FINALIZADA);
            reservation.setProgressPercentage(new java.math.BigDecimal("100"));
            reservation.setUpdatedAt(LocalDateTime.now());
            reservationRepository.save(reservation);
        } else {
            // Actualizar el porcentaje de progreso
            long completedTasks = allTasks.stream()
                    .filter(t -> t.getStatus() == TaskStatus.COMPLETADA)
                    .count();
            double progress = ((double) completedTasks / allTasks.size()) * 100;
            reservation.setProgressPercentage(new java.math.BigDecimal(progress));
            reservation.setUpdatedAt(LocalDateTime.now());
            reservationRepository.save(reservation);
        }
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

        // Obtener información de la reservación
        var reservation = task.getReservation();
        String clientName = reservation.getClient() != null 
                ? reservation.getClient().getName() 
                : "Cliente no disponible";

        return TaskResponse.builder()
                .id(task.getId())
                .reservationId(reservation.getId())
                .reservationEventName(reservation.getEventName())
                .reservationLocation(reservation.getLocation())
                .reservationScheduledFor(reservation.getScheduledFor())
                .clientName(clientName)
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
