package sv.udb.puntoeventoapi.modules.reservation.repository;

import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    
    List<Reservation> findByClientId(UUID clientId);
    
    List<Reservation> findByStatus(Status status);
    
    Optional<Reservation> findByQuoteId(UUID quoteId);
    
    @Query("SELECT r FROM Reservation r WHERE r.client.user.email = :email")
    List<Reservation> findByClientEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.status = :status")
    long countByStatus(@Param("status") Status status);
    
    @Query("SELECT AVG(r.progressPercentage) FROM Reservation r WHERE r.status = :status")
    Double getAverageProgressByStatus(@Param("status") Status status);
}
