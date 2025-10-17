package sv.udb.puntoeventoapi.repository;

import sv.udb.puntoeventoapi.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByAssignmentId(UUID assignmentId);
}
