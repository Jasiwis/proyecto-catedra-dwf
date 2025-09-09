package sv.udb.multiworksapi.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.multiworksapi.enums.ContractType;
import sv.udb.multiworksapi.enums.PersonType;
import sv.udb.multiworksapi.enums.Status;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Column(unique = true, nullable = false)
    private String document;

    @Enumerated(EnumType.STRING)
    private PersonType personType;

    @Enumerated(EnumType.STRING)
    private ContractType contractType;

    private String phone;
    private String email;
    private String address;

    @Enumerated(EnumType.STRING)
    private Status status;

    private UUID createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deactivatedAt;
}
