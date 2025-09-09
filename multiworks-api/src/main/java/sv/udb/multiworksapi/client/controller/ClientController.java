package sv.udb.multiworksapi.client.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.multiworksapi.common.annotations.CurrentUser;
import sv.udb.multiworksapi.entity.User;
import sv.udb.multiworksapi.client.dto.ClientDto;
import sv.udb.multiworksapi.client.dto.ClientResponse;
import sv.udb.multiworksapi.client.service.ClientService;
import sv.udb.multiworksapi.common.ApiResponse;
import sv.udb.multiworksapi.common.ApiResponseUtil;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService service;

    @PostMapping
    public ResponseEntity<ApiResponse<ClientResponse>> create(
            @RequestBody @Valid ClientDto dto,
            @CurrentUser User user
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.create(dto, user.getId())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getById(UUID.fromString(id))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponse>> update(
            @PathVariable String id,
            @RequestBody @Valid ClientDto dto,
            @CurrentUser User user
    ) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.update(UUID.fromString(id), dto, user.getId())));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<ApiResponse<ClientResponse>> toggleStatus(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.toggleStatus(UUID.fromString(id))));
    }
}
