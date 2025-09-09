package sv.udb.multiworksapi.repository;

import sv.udb.multiworksapi.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClientRepository extends JpaRepository<Client, UUID> {
    boolean existsByDocument(String document);
}
