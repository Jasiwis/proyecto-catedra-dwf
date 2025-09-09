package sv.udb.multiworksapi.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.multiworksapi.enums.QuoteStatus;

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

    private UUID clientId;

    private Integer estimatedHours;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Double additionalCosts;

    @Enumerated(EnumType.STRING)
    private QuoteStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
