package sv.udb.puntoeventoapi.modules.invoice.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false, unique = true)
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    private String issueDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 12, scale = 2)
    private BigDecimal taxTotal;

    @Column(precision = 12, scale = 2)
    private BigDecimal additionalCosts;

    @Column(precision = 12, scale = 2)
    private BigDecimal total;

    private UUID createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
