package sv.udb.multiworksapi.repository;

import sv.udb.multiworksapi.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QuoteRepository extends JpaRepository<Quote, UUID> {
}
