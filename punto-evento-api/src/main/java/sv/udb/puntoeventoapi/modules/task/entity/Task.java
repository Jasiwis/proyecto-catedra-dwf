package sv.udb.puntoeventoapi.modules.task.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.puntoeventoapi.modules.commons.enums.TaskStatus;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import sv.udb.puntoeventoapi.modules.assignment.entity.Assignment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tasks")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    private UUID serviceId;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Assignment> assignments;

    private String title;

    private String description;

    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private UUID createdBy;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
