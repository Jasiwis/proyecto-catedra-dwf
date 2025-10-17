package sv.udb.puntoeventoapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "sv.udb.puntoeventoapi")
public class PuntoEventoApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(PuntoEventoApiApplication.class, args);
    }

}
