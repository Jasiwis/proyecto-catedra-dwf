package sv.udb.puntoeventoapi.modules.task.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.task.dto.TaskDto;
import sv.udb.puntoeventoapi.modules.task.dto.TaskResponse;
import sv.udb.puntoeventoapi.modules.task.service.TaskService;
import sv.udb.puntoeventoapi.modules.commons.enums.TaskStatus;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> create(
            @RequestBody @Valid TaskDto dto,
            @RequestParam UUID createdBy
    ) {
        return ResponseEntity.ok(taskService.create(dto, createdBy));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAll() {
        return ResponseEntity.ok(taskService.getByStatus(TaskStatus.PENDIENTE));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByReservation(@PathVariable String reservationId) {
        return ResponseEntity.ok(taskService.getByReservation(UUID.fromString(reservationId)));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByEmployee(@PathVariable String employeeId) {
        return ResponseEntity.ok(taskService.getByEmployee(UUID.fromString(employeeId)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByStatus(@PathVariable TaskStatus status) {
        return ResponseEntity.ok(taskService.getByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getById(UUID.fromString(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> update(
            @PathVariable String id,
            @RequestBody @Valid TaskDto dto
    ) {
        return ResponseEntity.ok(taskService.update(UUID.fromString(id), dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable String id,
            @RequestParam TaskStatus status
    ) {
        return ResponseEntity.ok(taskService.updateStatus(UUID.fromString(id), status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        return ResponseEntity.ok(taskService.delete(UUID.fromString(id)));
    }
}
