package sv.udb.puntoeventoapi.modules.assignment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.assignment.dto.AssignmentDto;
import sv.udb.puntoeventoapi.modules.assignment.dto.AssignmentResponse;
import sv.udb.puntoeventoapi.modules.assignment.service.AssignmentService;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponseUtil;
import sv.udb.puntoeventoapi.modules.commons.common.annotations.CurrentUser;
import sv.udb.puntoeventoapi.modules.user.entity.User;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService service;

    @GetMapping("/tasks/{taskId}/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getByTask(@PathVariable String taskId) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getByTaskId(UUID.fromString(taskId))));
    }
    
    @GetMapping("/employees/{employeeId}/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getByEmployee(@PathVariable String employeeId) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getByEmployeeId(UUID.fromString(employeeId))));
    }

    @PostMapping("/tasks/{taskId}/assignments")
    public ResponseEntity<ApiResponse<AssignmentResponse>> create(
            @PathVariable String taskId,
            @RequestBody @Valid AssignmentDto dto,
            @CurrentUser User currentUser
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.create(UUID.fromString(taskId), dto, currentUser.getId())
        ));
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.getById(UUID.fromString(id))
        ));
    }

    @PutMapping("/assignments/{id}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> update(
            @PathVariable String id,
            @RequestBody @Valid AssignmentDto dto
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.update(UUID.fromString(id), dto)
        ));
    }

    @DeleteMapping("/assignments/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(UUID.fromString(id));
        return ResponseEntity.ok(ApiResponseUtil.successMessage("Asignación eliminada"));
    }
}
