package sv.udb.puntoeventoapi.modules.task.repository;

import sv.udb.puntoeventoapi.modules.task.entity.Task;
import sv.udb.puntoeventoapi.modules.commons.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByReservationId(UUID reservationId);
    List<Task> findByEmployeeId(UUID employeeId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByReservationIdAndStatus(UUID reservationId, TaskStatus status);
}
