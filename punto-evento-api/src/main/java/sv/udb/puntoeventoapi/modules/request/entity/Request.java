package sv.udb.puntoeventoapi.modules.request.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.user.entity.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "requests")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String eventName;

    @Column(nullable = false)
    private String eventDate;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String requestedServices; // JSON string con servicios solicitados

    private String notes;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private sv.udb.puntoeventoapi.modules.client.entity.Client client;

    private UUID createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
