package sv.udb.puntoeventoapi.modules.invoice.repository;

import sv.udb.puntoeventoapi.modules.invoice.entity.Invoice;
import sv.udb.puntoeventoapi.modules.commons.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    
    List<Invoice> findByClientId(UUID clientId);
    
    List<Invoice> findByStatus(Status status);
    
    Optional<Invoice> findByReservationId(UUID reservationId);
    
    @Query("SELECT i FROM Invoice i WHERE i.client.user.email = :email")
    List<Invoice> findByClientEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = :status")
    long countByStatus(@Param("status") Status status);
    
    @Query("SELECT SUM(i.total) FROM Invoice i WHERE i.status = 'PAGADA'")
    BigDecimal getTotalPaidAmount();
    
    @Query("SELECT SUM(i.total) FROM Invoice i WHERE i.status = 'EMITIDA'")
    BigDecimal getTotalPendingAmount();
}
