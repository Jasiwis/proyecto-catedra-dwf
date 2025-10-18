package sv.udb.puntoeventoapi.modules.assignment.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.puntoeventoapi.modules.task.entity.Task;
import sv.udb.puntoeventoapi.modules.employee.entity.Employee;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assignments", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"task_id", "employee_id"}))
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private UUID assignedBy;
    private LocalDateTime assignedAt;
    
    private String notes;
}
