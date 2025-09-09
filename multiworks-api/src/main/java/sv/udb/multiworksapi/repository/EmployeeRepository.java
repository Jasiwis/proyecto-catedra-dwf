package sv.udb.multiworksapi.repository;

import sv.udb.multiworksapi.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    boolean existsByDocument(String document);
}
