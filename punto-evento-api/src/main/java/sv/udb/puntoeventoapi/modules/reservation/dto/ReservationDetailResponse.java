package sv.udb.puntoeventoapi.modules.reservation.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus;
import java.math.BigDecimal;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDetailResponse {
    
    // Información de la Reservación
    private UUID id;
    private String eventName;
    private String scheduledFor;
    private String location;
    private ReservationStatus status;
    private BigDecimal progressPercentage;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Cliente (solo datos necesarios)
    private ClientInfo client;
    
    // Cotización (solo datos necesarios)
    private QuoteInfo quote;
    
    // Solicitud (solo datos necesarios)
    private RequestInfo request;
    
    // Servicios de la cotización
    @Builder.Default
    private List<ServiceInfo> services = new ArrayList<>();
    
    // Tareas de la reservación
    @Builder.Default
    private List<TaskInfo> tasks = new ArrayList<>();
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClientInfo {
        private UUID id;
        private String name;
        private String email;
        private String phone;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuoteInfo {
        private UUID id;
        private String eventName;
        private Integer estimatedHours;
        private BigDecimal subtotal;
        private BigDecimal taxTotal;
        private BigDecimal additionalCosts;
        private BigDecimal total;
        private String status;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestInfo {
        private UUID id;
        private String eventName;
        private String eventDate;
        private String location;
        private String requestedServices;
        private String notes;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceInfo {
        private UUID id;
        private String description;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
        private BigDecimal total;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskInfo {
        private UUID id;
        private String title;
        private String description;
        private String status;
        private String employeeName;
        private LocalDateTime startDatetime;
        private LocalDateTime endDatetime;
        private LocalDateTime completedAt;
    }
}

