package sv.udb.multiworksapi.assignment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.multiworksapi.assignment.dto.AssignmentDto;
import sv.udb.multiworksapi.assignment.dto.AssignmentResponse;
import sv.udb.multiworksapi.assignment.service.AssignmentService;
import sv.udb.multiworksapi.common.ApiResponse;
import sv.udb.multiworksapi.common.ApiResponseUtil;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService service;

    @GetMapping("/quotes/{quoteId}/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getByQuote(@PathVariable String quoteId) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getByQuoteId(UUID.fromString(quoteId))));
    }

    @PostMapping("/quotes/{quoteId}/assignments")
    public ResponseEntity<ApiResponse<AssignmentResponse>> create(
            @PathVariable String quoteId,
            @RequestBody @Valid AssignmentDto dto
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.create(UUID.fromString(quoteId), dto)
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
