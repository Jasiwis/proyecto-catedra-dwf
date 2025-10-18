package sv.udb.puntoeventoapi.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import sv.udb.puntoeventoapi.modules.client.entity.Client;
import sv.udb.puntoeventoapi.modules.client.repository.ClientRepository;
import sv.udb.puntoeventoapi.modules.commons.enums.*;
import sv.udb.puntoeventoapi.modules.employee.entity.Employee;
import sv.udb.puntoeventoapi.modules.employee.repository.EmployeeRepository;
import sv.udb.puntoeventoapi.modules.user.entity.User;
import sv.udb.puntoeventoapi.modules.user.repository.UserRepository;
import sv.udb.puntoeventoapi.modules.request.entity.Request;
import sv.udb.puntoeventoapi.modules.request.repository.RequestRepository;
import sv.udb.puntoeventoapi.modules.quote.entity.Quote;
import sv.udb.puntoeventoapi.modules.quote.repository.QuoteRepository;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import sv.udb.puntoeventoapi.modules.reservation.repository.ReservationRepository;
import sv.udb.puntoeventoapi.modules.task.entity.Task;
import sv.udb.puntoeventoapi.modules.task.repository.TaskRepository;
import sv.udb.puntoeventoapi.modules.assignment.entity.Assignment;
import sv.udb.puntoeventoapi.modules.assignment.repository.AssignmentRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
    name = "app.seeder.enabled", 
    havingValue = "true", 
    matchIfMissing = true
)
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final EmployeeRepository employeeRepository;
    private final RequestRepository requestRepository;
    private final QuoteRepository quoteRepository;
    private final ReservationRepository reservationRepository;
    private final TaskRepository taskRepository;
    private final AssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("🌱 Iniciando seeder de datos mejorado...");
        
        // Verificar si ya existen datos en la base de datos
        if (userRepository.count() > 0) {
            log.info("⏭️  La base de datos ya contiene datos. Saltando seeder...");
            return;
        }
        
        // Crear los 3 usuarios principales
        User admin = createAdmin();
        User employeeUser = createEmployeeUser();
        User clientUser = createClientUser();
        
        // Crear perfil de cliente y empleado
        Client juanPerez = createClientProfile(clientUser, admin);
        Employee mainEmployee = createEmployeeProfile(employeeUser, admin);
        
        // Crear flujo completo de datos para Juan Pérez
        createCompleteWorkflow(juanPerez, mainEmployee, admin);
        
        log.info("✅ Seeder de datos completado exitosamente");
        log.info("👑 Admin: admin@puntoevento.com / admin123");
        log.info("👨‍💼 Empleado: empleado@puntoevento.com / empleado123");
        log.info("👤 Cliente: juan.perez@email.com / cliente123");
    }

    private User createAdmin() {
        User admin = User.builder()
                .name("Administrador del Sistema")
                .email("admin@puntoevento.com")
                .password(passwordEncoder.encode("admin123"))
                .userType(UserType.ADMIN)
                .active(true)
                .createdAt(String.valueOf(LocalDateTime.now()))
                .updatedAt(String.valueOf(LocalDateTime.now()))
                .build();

        User saved = userRepository.save(admin);
        log.info("👑 Usuario administrador creado: {}", admin.getEmail());
        return saved;
    }

    private User createEmployeeUser() {
        User employee = User.builder()
                .name("Empleado Principal")
                .email("empleado@puntoevento.com")
                .password(passwordEncoder.encode("empleado123"))
                .userType(UserType.EMPLOYEE)
                .active(true)
                .createdAt(String.valueOf(LocalDateTime.now()))
                .updatedAt(String.valueOf(LocalDateTime.now()))
                .build();

        User saved = userRepository.save(employee);
        log.info("👨‍💼 Usuario empleado creado: {}", employee.getEmail());
        return saved;
    }

    private User createClientUser() {
        User client = User.builder()
                .name("Juan Pérez González")
                .email("juan.perez@email.com")
                .password(passwordEncoder.encode("cliente123"))
                .userType(UserType.CLIENT)
                .active(true)
                .createdAt(String.valueOf(LocalDateTime.now()))
                .updatedAt(String.valueOf(LocalDateTime.now()))
                .build();

        User saved = userRepository.save(client);
        log.info("👤 Usuario cliente creado: {}", client.getEmail());
        return saved;
    }

    private Client createClientProfile(User user, User admin) {
        Client client = Client.builder()
                .name("Juan Pérez González")
                .document("12345678-9")
                .personType(PersonType.Natural)
                .phone("+503 7890-1234")
                .email("juan.perez@email.com")
                .address("Colonia Escalón, San Salvador, El Salvador")
                .status(Status.Activo)
                .user(user)
                .createdBy(admin.getId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Client saved = clientRepository.save(client);
        log.info("👤 Perfil de cliente creado: {}", client.getName());
        return saved;
    }

    private Employee createEmployeeProfile(User user, User admin) {
        Employee employee = Employee.builder()
                .name("Empleado Principal")
                .document("98765432-1")
                .personType(PersonType.Natural)
                .contractType(ContractType.Permanente)
                .phone("+503 7890-5678")
                .email("empleado@puntoevento.com")
                .address("San Salvador, El Salvador")
                .status(Status.Activo)
                .user(user)
                .createdBy(admin.getId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Employee saved = employeeRepository.save(employee);
        log.info("👨‍💼 Perfil de empleado creado: {}", employee.getName());
        return saved;
    }

    private void createCompleteWorkflow(Client client, Employee employee, User admin) {
        log.info("📋 Creando flujo completo de datos...");
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        
        // ================== ESCENARIO 1: RESERVACIÓN FINALIZADA ==================
        log.info("📋 Escenario 1: Evento finalizado");
        Request req1 = createRequest(
            client, admin,
            "Boda de Aniversario",
            now.plusDays(15).format(formatter.ofPattern("yyyy-MM-dd")),
            "Hotel Sheraton Presidente, San Salvador",
            "Decoración floral, Música en vivo, Catering gourmet, Fotografía profesional",
            "Celebración de 25 años de matrimonio, ambiente elegante",
            now.minusDays(45)
        );
        
        Quote quote1 = createQuote(req1, admin, QuoteStatus.Aprobada, 
            new BigDecimal("8500.00"), new BigDecimal("1105.00"), new BigDecimal("250.00"),
            now.minusDays(43));
        
        Reservation reservation1 = createReservation(
            quote1, req1, admin, 
            now.plusDays(15).format(formatter),
            ReservationStatus.FINALIZADA,
            now.minusDays(42)
        );
        
        // Tareas completadas
        createCompletedTask(reservation1, employee, admin, 
            "Montaje de decoración floral",
            "Instalación de arreglos florales en mesas y salón principal",
            now.plusDays(14).withHour(8).withMinute(0),
            now.plusDays(14).withHour(12).withMinute(0));
        
        createCompletedTask(reservation1, employee, admin,
            "Configuración de equipo de sonido",
            "Instalación y prueba de sistema de audio para música en vivo",
            now.plusDays(14).withHour(14).withMinute(0),
            now.plusDays(14).withHour(17).withMinute(0));
        
        createCompletedTask(reservation1, employee, admin,
            "Supervisión de catering",
            "Coordinación con equipo de catering y presentación de platillos",
            now.plusDays(15).withHour(18).withMinute(0),
            now.plusDays(15).withHour(22).withMinute(0));
        
        // ================== ESCENARIO 2: EVENTO EN CURSO ==================
        log.info("📋 Escenario 2: Evento en curso");
        Request req2 = createRequest(
            client, admin,
            "Conferencia Empresarial 2024",
            now.plusDays(15).format(formatter.ofPattern("yyyy-MM-dd")),
            "Centro de Convenciones CIFCO",
            "Proyector y pantalla, Sistema de audio, Coffee break, Decoración corporativa",
            "Conferencia anual de negocios con 200 asistentes",
            now.minusDays(30)
        );
        
        Quote quote2 = createQuote(req2, admin, QuoteStatus.Aprobada,
            new BigDecimal("5500.00"), new BigDecimal("715.00"), new BigDecimal("150.00"),
            now.minusDays(28));
        
        Reservation reservation2 = createReservation(
            quote2, req2, admin,
            now.plusDays(15).format(formatter),
            ReservationStatus.ENCURSO,
            now.minusDays(27)
        );
        
        // Primera tarea en proceso, otras completadas
        Task task2_1 = createTask(reservation2, employee, admin,
            "Instalación de equipos audiovisuales",
            "Montar proyectores, pantallas y sistema de audio",
            now.plusDays(14).withHour(7).withMinute(0),
            now.plusDays(14).withHour(10).withMinute(0),
            TaskStatus.COMPLETADA,
            now.minusDays(27));
        
        Task task2_2 = createTask(reservation2, employee, admin,
            "Supervisión de coffee break",
            "Coordinar servicio de café y refrigerios",
            now.plusDays(15).withHour(8).withMinute(0),
            now.plusDays(15).withHour(12).withMinute(0),
            TaskStatus.EN_PROCESO,
            now.minusDays(27));
        
        Task task2_3 = createTask(reservation2, employee, admin,
            "Desmontaje de equipos",
            "Retirar equipos audiovisuales y decoración",
            now.plusDays(15).withHour(17).withMinute(0),
            now.plusDays(15).withHour(20).withMinute(0),
            TaskStatus.PENDIENTE,
            now.minusDays(27));
        
        // ================== ESCENARIO 3: EVENTO PROGRAMADO ==================
        log.info("📋 Escenario 3: Evento programado (listo para comenzar)");
        Request req3 = createRequest(
            client, admin,
            "Fiesta de Graduación",
            now.plusDays(15).format(formatter.ofPattern("yyyy-MM-dd")),
            "Salón de Eventos Los Próceres",
            "DJ profesional, Iluminación LED, Decoración temática, Servicio de bar",
            "Fiesta de graduación universitaria con 150 invitados",
            now.minusDays(25)
        );
        
        Quote quote3 = createQuote(req3, admin, QuoteStatus.Aprobada,
            new BigDecimal("4200.00"), new BigDecimal("546.00"), new BigDecimal("100.00"),
            now.minusDays(23));
        
        Reservation reservation3 = createReservation(
            quote3, req3, admin,
            now.plusDays(15).format(formatter),
            ReservationStatus.PROGRAMADA,
            now.minusDays(22)
        );
        
        // Todas las tareas pendientes
        createTask(reservation3, employee, admin,
            "Montaje de iluminación LED",
            "Instalar sistema de iluminación en salón",
            now.plusDays(14).withHour(14).withMinute(0),
            now.plusDays(14).withHour(18).withMinute(0),
            TaskStatus.PENDIENTE,
            now.minusDays(22));
        
        createTask(reservation3, employee, admin,
            "Configuración de equipo DJ",
            "Instalación de consola DJ y prueba de sonido",
            now.plusDays(15).withHour(16).withMinute(0),
            now.plusDays(15).withHour(18).withMinute(0),
            TaskStatus.PENDIENTE,
            now.minusDays(22));
        
        createTask(reservation3, employee, admin,
            "Decoración temática",
            "Montaje de decoración y ambientación del salón",
            now.plusDays(15).withHour(10).withMinute(0),
            now.plusDays(15).withHour(16).withMinute(0),
            TaskStatus.PENDIENTE,
            now.minusDays(22));
        
        // ================== ESCENARIO 4: EN PLANEACIÓN (Admin puede agregar tareas) ==================
        log.info("📋 Escenario 4: Reservación en planeación");
        Request req4 = createRequest(
            client, admin,
            "Cumpleaños Infantil Temático",
            now.plusDays(15).format(formatter.ofPattern("yyyy-MM-dd")),
            "Casa de Eventos Happy Kids",
            "Animación infantil, Decoración de superhéroes, Inflables, Pastel personalizado",
            "Cumpleaños número 7, temática de superhéroes, 50 niños",
            now.minusDays(10)
        );
        
        Quote quote4 = createQuote(req4, admin, QuoteStatus.Aprobada,
            new BigDecimal("2800.00"), new BigDecimal("364.00"), new BigDecimal("80.00"),
            now.minusDays(8));
        
        Reservation reservation4 = createReservation(
            quote4, req4, admin,
            now.plusDays(15).format(formatter),
            ReservationStatus.EN_PLANEACION,
            now.minusDays(7)
        );
        
        // Algunas tareas iniciales
        createTask(reservation4, employee, admin,
            "Instalación de inflables",
            "Montaje de castillos inflables y juegos",
            now.plusDays(15).withHour(8).withMinute(0),
            now.plusDays(15).withHour(11).withMinute(0),
            TaskStatus.PENDIENTE,
            now.minusDays(7));
        
        createTask(reservation4, employee, admin,
            "Decoración temática de superhéroes",
            "Ambientación completa del salón con temática",
            now.plusDays(15).withHour(9).withMinute(0),
            now.plusDays(15).withHour(12).withMinute(0),
            TaskStatus.PENDIENTE,
            now.minusDays(7));
        
        // ================== ESCENARIO 5: COTIZACIÓN RECHAZADA ==================
        log.info("📋 Escenario 5: Cotización rechazada");
        Request req5 = createRequest(
            client, admin,
            "Cena Romántica Privada",
            now.plusDays(15).format(formatter.ofPattern("yyyy-MM-dd")),
            "Restaurante Vista Hermosa",
            "Música instrumental, Decoración floral, Menú gourmet",
            "Cena romántica de aniversario para 2 personas",
            now.minusDays(15)
        );
        
        createQuote(req5, admin, QuoteStatus.Rechazada,
            new BigDecimal("1500.00"), new BigDecimal("195.00"), new BigDecimal("50.00"),
            now.minusDays(13));
        
        // ================== ESCENARIO 6: COTIZACIÓN PENDIENTE ==================
        log.info("📋 Escenario 6: Cotización pendiente de aprobación");
        Request req6 = createRequest(
            client, admin,
            "Reunión Familiar Navideña",
            now.plusDays(15).format(formatter.ofPattern("yyyy-MM-dd")),
            "Rancho Los Pinos",
            "Música navideña, Catering tradicional, Decoración navideña, Árbol de Navidad",
            "Reunión familiar de fin de año, aproximadamente 80 personas",
            now.minusDays(5)
        );
        
        createQuote(req6, admin, QuoteStatus.Pendiente,
            new BigDecimal("6500.00"), new BigDecimal("845.00"), new BigDecimal("200.00"),
            now.minusDays(3));
        
        // ================== ESCENARIO 7: SOLICITUD SIN COTIZACIÓN ==================
        log.info("📋 Escenario 7: Solicitud sin cotización");
        createRequest(
            client, admin,
            "Evento Corporativo Networking",
            now.plusDays(15).format(formatter.ofPattern("yyyy-MM-dd")),
            "Hotel Crowne Plaza",
            "Coffee break, Sistema de audio, Decoración moderna",
            "Evento de networking empresarial para 100 personas",
            now.minusDays(2)
        );
        
        // ================== ESCENARIO 8: RESERVACIÓN CANCELADA ==================
        log.info("📋 Escenario 8: Evento cancelado");
        Request req8 = createRequest(
            client, admin,
            "Concierto Privado",
            now.plusDays(15).format(formatter.ofPattern("yyyy-MM-dd")),
            "Teatro Nacional",
            "Sistema de sonido profesional, Iluminación escénica, Backstage",
            "Concierto privado cancelado por motivos personales",
            now.minusDays(35)
        );
        
        Quote quote8 = createQuote(req8, admin, QuoteStatus.Aprobada,
            new BigDecimal("12000.00"), new BigDecimal("1560.00"), new BigDecimal("500.00"),
            now.minusDays(33));
        
        createReservation(
            quote8, req8, admin,
            now.plusDays(15).format(formatter),
            ReservationStatus.CANCELADA,
            now.minusDays(32)
        );
        
        log.info("✅ Flujo completo creado con 8 escenarios diferentes");
    }

    private Request createRequest(Client client, User admin, String eventName, String eventDate, 
                                  String location, String services, String notes, LocalDateTime createdAt) {
        Request request = Request.builder()
                .eventName(eventName)
                .eventDate(eventDate)
                .location(location)
                .requestedServices(services)
                .notes(notes)
                .status(Status.Activo)
                .client(client)
                .createdBy(admin.getId())
                .createdAt(createdAt)
                .updatedAt(createdAt)
                .build();
        
        Request saved = requestRepository.save(request);
        log.info("  📋 Solicitud creada: {}", eventName);
        return saved;
    }

    private Quote createQuote(Request request, User admin, QuoteStatus status,
                             BigDecimal subtotal, BigDecimal taxes, BigDecimal additional,
                             LocalDateTime createdAt) {
        Quote quote = Quote.builder()
                .request(request)
                .client(request.getClient())
                .eventName(request.getEventName())
                .subtotal(subtotal)
                .taxTotal(taxes)
                .additionalCosts(additional)
                .total(subtotal.add(taxes).add(additional))
                .status(status)
                .createdBy(admin.getId())
                .createdAt(createdAt)
                .updatedAt(createdAt)
                .build();
        
        Quote saved = quoteRepository.save(quote);
        log.info("  💰 Cotización creada: {} - Estado: {}", request.getEventName(), status);
        return saved;
    }

    private Reservation createReservation(Quote quote, Request request, User admin, String scheduledFor,
                                         ReservationStatus status, LocalDateTime createdAt) {
        Reservation reservation = Reservation.builder()
                .quote(quote)
                .client(quote.getClient())
                .eventName(quote.getEventName())
                .location(request.getLocation())
                .scheduledFor(scheduledFor)
                .status(status)
                .createdBy(admin.getId())
                .createdAt(createdAt)
                .updatedAt(createdAt)
                .build();
        
        Reservation saved = reservationRepository.save(reservation);
        log.info("  📅 Reservación creada: {} - Estado: {}", quote.getEventName(), status);
        return saved;
    }

    private Task createTask(Reservation reservation, Employee employee, User admin,
                           String title, String description,
                           LocalDateTime startDate, LocalDateTime endDate,
                           TaskStatus status, LocalDateTime createdAt) {
        Task task = Task.builder()
                .reservation(reservation)
                .title(title)
                .description(description)
                .status(status)
                .startDatetime(startDate)
                .endDatetime(endDate)
                .createdBy(admin.getId())
                .createdAt(createdAt)
                .updatedAt(createdAt)
                .build();
        
        if (status == TaskStatus.COMPLETADA) {
            task.setCompletedAt(endDate);
        }
        
        Task savedTask = taskRepository.save(task);
        
        // Asignar tarea al empleado
        Assignment assignment = Assignment.builder()
                .task(savedTask)
                .employee(employee)
                .assignedBy(admin.getId())
                .assignedAt(createdAt)
                .notes("Tarea asignada automáticamente por el sistema")
                .build();
        
        assignmentRepository.save(assignment);
        log.info("    ✓ Tarea creada y asignada: {} - Estado: {}", title, status);
        
        return savedTask;
    }

    private void createCompletedTask(Reservation reservation, Employee employee, User admin,
                                    String title, String description,
                                    LocalDateTime startDate, LocalDateTime endDate) {
        createTask(reservation, employee, admin, title, description, startDate, endDate,
                  TaskStatus.COMPLETADA, startDate.minusDays(1));
    }
}
