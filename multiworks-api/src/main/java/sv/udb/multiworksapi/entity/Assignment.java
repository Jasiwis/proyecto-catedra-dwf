package sv.udb.multiworksapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assignments")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID quoteId;
    private UUID employeeId;

    private String title;

    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;

    private Integer estimatedHours;
    private Double baseCost;
    private Double extraPercentage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
