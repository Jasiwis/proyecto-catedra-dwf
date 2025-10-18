package sv.udb.puntoeventoapi.modules.quote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sv.udb.puntoeventoapi.modules.quote.entity.QuoteItem;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuoteItemRepository extends JpaRepository<QuoteItem, UUID> {
    
    List<QuoteItem> findByQuoteId(UUID quoteId);
    
    void deleteByQuoteId(UUID quoteId);
}

