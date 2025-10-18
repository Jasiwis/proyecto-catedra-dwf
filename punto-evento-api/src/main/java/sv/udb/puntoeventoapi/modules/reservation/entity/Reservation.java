package sv.udb.puntoeventoapi.modules.reservation.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.puntoeventoapi.modules.commons.enums.ReservationStatus;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.quote.entity.Quote;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "quote_id", nullable = false, unique = true)
    private Quote quote;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(nullable = false)
    private String eventName;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    private String scheduledFor;
    private String location;

    private String notes;

    @Column(precision = 5, scale = 2)
    private BigDecimal progressPercentage;

    private UUID createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
