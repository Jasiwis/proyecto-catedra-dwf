package sv.udb.multiworksapi.common;

import java.util.List;

public class ApiResponseUtil {

    // Para respuestas exitosas con datos
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("Operación exitosa")
                .data(data)
                .build();
    }

    // Para respuestas exitosas sin datos (por ejemplo: eliminaciones)
    public static ApiResponse<Void> successMessage(String message) {
        return ApiResponse.<Void>builder()
                .success(true)
                .message(message)
                .build();
    }

    // Para errores con múltiples campos
    public static ApiResponse<Void> error(String message, List<ApiResponse.ApiError> errors) {
        return ApiResponse.<Void>builder()
                .success(false)
                .message(message)
                .errors(errors)
                .build();
    }

    // Para error simple (único campo o error general)
    public static ApiResponse<Void> error(String message, String field, String errorMessage) {
        return error(message, List.of(ApiResponse.ApiError.builder()
                .field(field)
                .message(errorMessage)
                .build()));
    }
}
