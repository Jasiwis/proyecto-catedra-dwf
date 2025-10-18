package sv.udb.puntoeventoapi.modules.employee.repository;

import sv.udb.puntoeventoapi.modules.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    boolean existsByDocument(String document);
    Optional<Employee> findByUserId(UUID userId);
}
