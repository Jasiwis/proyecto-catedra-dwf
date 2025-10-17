package sv.udb.puntoeventoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.udb.puntoeventoapi.entity.Assignment;

import java.util.List;
import java.util.UUID;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    List<Assignment> findByQuoteId(UUID quoteId);
}
