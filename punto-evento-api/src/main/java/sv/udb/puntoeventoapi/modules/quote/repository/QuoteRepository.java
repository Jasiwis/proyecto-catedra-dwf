package sv.udb.puntoeventoapi.modules.quote.repository;

import sv.udb.puntoeventoapi.modules.quote.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuoteRepository extends JpaRepository<Quote, UUID> {
    List<Quote> findByClientId(UUID clientId);
}
