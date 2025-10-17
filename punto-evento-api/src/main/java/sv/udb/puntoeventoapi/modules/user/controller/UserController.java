package sv.udb.puntoeventoapi.modules.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponse;
import sv.udb.puntoeventoapi.modules.commons.common.ApiResponseUtil;
import sv.udb.puntoeventoapi.modules.commons.enums.UserType;
import sv.udb.puntoeventoapi.modules.user.dto.UserDto;
import sv.udb.puntoeventoapi.modules.user.dto.UserResponse;
import sv.udb.puntoeventoapi.modules.user.dto.UserUpdateDto;
import sv.udb.puntoeventoapi.modules.user.service.UserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(ApiResponseUtil.success(userService.getAllUsers(pageable)));
    }

    @GetMapping("/type/{userType}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByType(@PathVariable UserType userType) {
        return ResponseEntity.ok(ApiResponseUtil.success(userService.getUsersByType(userType)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponseUtil.success(userService.getUserById(id)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponseUtil.success(userService.getUserByEmail(email)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserDto userDto) {
        return ResponseEntity.ok(ApiResponseUtil.success(userService.createUser(userDto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateDto userUpdateDto) {
        return ResponseEntity.ok(ApiResponseUtil.success(userService.updateUser(id, userUpdateDto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponseUtil.success(null));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(@PathVariable UUID id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponseUtil.success(null));
    }
}
