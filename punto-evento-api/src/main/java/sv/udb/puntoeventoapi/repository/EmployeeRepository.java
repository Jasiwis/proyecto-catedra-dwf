package sv.udb.puntoeventoapi.repository;

import sv.udb.puntoeventoapi.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    boolean existsByDocument(String document);
}
