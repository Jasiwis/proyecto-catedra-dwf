package sv.udb.multiworksapi.employee.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.multiworksapi.common.ApiResponse;
import sv.udb.multiworksapi.common.ApiResponseUtil;
import sv.udb.multiworksapi.common.annotations.*;
import sv.udb.multiworksapi.employee.dto.EmployeeDto;
import sv.udb.multiworksapi.employee.dto.EmployeeResponse;
import sv.udb.multiworksapi.employee.service.EmployeeService;
import sv.udb.multiworksapi.entity.User;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(
            @RequestBody @Valid EmployeeDto dto,
            @CurrentUser User user
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.create(dto, user.getId())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getById(UUID.fromString(id))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> update(
            @PathVariable String id,
            @RequestBody @Valid EmployeeDto dto,
            @CurrentUser User user
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.update(UUID.fromString(id), dto, user.getId())
        ));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> toggleStatus(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                service.toggleStatus(UUID.fromString(id))
        ));
    }
}
