package sv.udb.puntoeventoapi.modules.quote.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus;
import sv.udb.puntoeventoapi.modules.client.entity.Client;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quotes")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    private Integer estimatedHours;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private BigDecimal subtotal;
    private BigDecimal taxTotal;
    private BigDecimal additionalCosts;
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private QuoteStatus status;

    private UUID createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
