package sv.udb.puntoeventoapi.modules.quote.entity;

import jakarta.persistence.*;
import lombok.*;
import sv.udb.puntoeventoapi.modules.commons.enums.QuoteStatus;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.request.entity.Request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quotes")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private Request request;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(nullable = false)
    private String eventName;

    @Column(name = "estimated_hours")
    private Integer estimatedHours;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private BigDecimal subtotal;
    private BigDecimal taxTotal;
    private BigDecimal additionalCosts;
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private QuoteStatus status;

    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<QuoteItem> items = new ArrayList<>();

    private UUID createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public void addItem(QuoteItem item) {
        items.add(item);
        item.setQuote(this);
    }
    
    public void removeItem(QuoteItem item) {
        items.remove(item);
        item.setQuote(null);
    }
}
