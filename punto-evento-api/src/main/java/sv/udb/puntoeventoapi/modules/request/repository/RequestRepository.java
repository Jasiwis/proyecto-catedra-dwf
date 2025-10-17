package sv.udb.puntoeventoapi.modules.request.repository;

import sv.udb.puntoeventoapi.modules.request.entity.Request;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface RequestRepository extends JpaRepository<Request, UUID> {
    
    List<Request> findByClientId(UUID clientId);
    
    List<Request> findByStatus(Status status);
    
    @Query("SELECT r FROM Request r WHERE r.client.user.email = :email")
    List<Request> findByClientEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(r) FROM Request r WHERE r.status = :status")
    long countByStatus(@Param("status") Status status);
}
