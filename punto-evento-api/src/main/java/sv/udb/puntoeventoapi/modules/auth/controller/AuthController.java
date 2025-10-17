package sv.udb.puntoeventoapi.modules.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.auth.dto.*;
import sv.udb.puntoeventoapi.modules.auth.service.AuthService;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponseUtil;
import sv.udb.puntoeventoapi.modules.commons.common.annotations.CurrentUser;
import sv.udb.puntoeventoapi.modules.user.entity.User;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterDto dto) {
        return ResponseEntity.ok(ApiResponseUtil.success(authService.register(dto)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginDto dto) {
        return ResponseEntity.ok(ApiResponseUtil.success(authService.login(dto)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(@CurrentUser User user) {
        return ResponseEntity.ok(ApiResponseUtil.success(authService.getMe(user)));
    }
}
