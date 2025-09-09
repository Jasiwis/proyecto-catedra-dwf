package sv.udb.multiworksapi.task.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.multiworksapi.common.ApiResponse;
import sv.udb.multiworksapi.common.ApiResponseUtil;
import sv.udb.multiworksapi.task.dto.TaskDto;
import sv.udb.multiworksapi.task.dto.TaskResponse;
import sv.udb.multiworksapi.task.service.TaskService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService service;

    @GetMapping("/assignments/{assignmentId}/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByAssignment(@PathVariable String assignmentId) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.getByAssignment(UUID.fromString(assignmentId))
        ));
    }

    @PostMapping("/assignments/{assignmentId}/tasks")
    public ResponseEntity<ApiResponse<TaskResponse>> create(
            @PathVariable String assignmentId,
            @RequestBody @Valid TaskDto dto
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.create(UUID.fromString(assignmentId), dto)
        ));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.getById(UUID.fromString(id))
        ));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> update(
            @PathVariable String id,
            @RequestBody @Valid TaskDto dto
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.update(UUID.fromString(id), dto)
        ));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(UUID.fromString(id));
        return ResponseEntity.ok(ApiResponseUtil.successMessage("Tarea eliminada correctamente"));
    }
}
