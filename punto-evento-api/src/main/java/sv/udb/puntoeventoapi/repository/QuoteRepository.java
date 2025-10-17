package sv.udb.puntoeventoapi.repository;

import sv.udb.puntoeventoapi.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QuoteRepository extends JpaRepository<Quote, UUID> {
}
