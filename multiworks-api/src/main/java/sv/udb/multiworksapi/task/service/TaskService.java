package sv.udb.multiworksapi.task.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.udb.multiworksapi.entity.Task;
import sv.udb.multiworksapi.repository.TaskRepository;
import sv.udb.multiworksapi.task.dto.TaskDto;
import sv.udb.multiworksapi.task.dto.TaskResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repository;

    public TaskResponse create(UUID assignmentId, TaskDto dto) {
        Task task = Task.builder()
                .assignmentId(assignmentId)
                .title(dto.title())
                .description(dto.description())
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(repository.save(task));
    }

    public List<TaskResponse> getByAssignment(UUID assignmentId) {
        return repository.findByAssignmentId(assignmentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse getById(UUID id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
    }

    public TaskResponse update(UUID id, TaskDto dto) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setUpdatedAt(LocalDateTime.now());

        return toResponse(repository.save(task));
    }

    public void delete(UUID id) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        repository.delete(task);
    }

    private TaskResponse toResponse(Task t) {
        return TaskResponse.builder()
                .id(t.getId())
                .assignmentId(t.getAssignmentId())
                .title(t.getTitle())
                .description(t.getDescription())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
