package sv.udb.multiworksapi.quote.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.multiworksapi.common.ApiResponse;
import sv.udb.multiworksapi.common.ApiResponseUtil;
import sv.udb.multiworksapi.enums.QuoteStatus;
import sv.udb.multiworksapi.quote.dto.QuoteDto;
import sv.udb.multiworksapi.quote.dto.QuoteResponse;
import sv.udb.multiworksapi.quote.service.QuoteService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService service;

    @PostMapping
    public ResponseEntity<ApiResponse<QuoteResponse>> create(@RequestBody @Valid QuoteDto dto) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.create(dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuoteResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuoteResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.getById(UUID.fromString(id))));
    }

    @PutMapping("/finish/{id}")
    public ResponseEntity<ApiResponse<QuoteResponse>> finish(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.updateStatus(UUID.fromString(id), QuoteStatus.Finalizada)));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<QuoteResponse>> cancel(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseUtil.success(service.updateStatus(UUID.fromString(id), QuoteStatus.Cancelada)));
    }
}
