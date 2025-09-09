package sv.udb.multiworksapi.common;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import sv.udb.multiworksapi.common.exceptions.FieldValidationException;
import sv.udb.multiworksapi.common.exceptions.InvalidJwtException;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        List<ApiResponse.ApiError> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> ApiResponse.ApiError.builder()
                        .field(err.getField())
                        .message(err.getDefaultMessage())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.badRequest().body(
                ApiResponse.<Void>builder()
                        .success(false)
                        .message("Error de validación")
                        .errors(errors)
                        .build()
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {
        List<ApiResponse.ApiError> errors = ex.getConstraintViolations().stream()
                .map(err -> ApiResponse.ApiError.builder()
                        .field(err.getPropertyPath().toString())
                        .message(err.getMessage())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.badRequest().body(
                ApiResponse.<Void>builder()
                        .success(false)
                        .message("Violaciones de restricción")
                        .errors(errors)
                        .build()
        );
    }

    @ExceptionHandler(FieldValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleFieldValidation(FieldValidationException ex) {
        return ResponseEntity.badRequest().body(
                ApiResponse.<Void>builder()
                        .success(false)
                        .message("Error de validación")
                        .errors(List.of(ApiResponse.ApiError.builder()
                                .field(ex.getField())
                                .message(ex.getMessage())
                                .build()))
                        .build()
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.<Void>builder()
                        .success(false)
                        .message("Error interno del servidor")
                        .errors(List.of(ApiResponse.ApiError.builder()
                                .field("internal")
                                .message(ex.getMessage())
                                .build()))
                        .build()
        );
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.<Void>builder()
                        .success(false)
                        .message("Error inesperado")
                        .errors(List.of(ApiResponse.ApiError.builder()
                                .field("unknown")
                                .message(ex.getMessage())
                                .build()))
                        .build()
        );
    }

}
