package sv.udb.puntoeventoapi.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(
    name = "app.seeder.enabled", 
    havingValue = "true", 
    matchIfMissing = true
)
public class SeederConfig {
    // Esta configuración permite habilitar/deshabilitar el seeder
    // mediante la propiedad app.seeder.enabled en application.properties
}
