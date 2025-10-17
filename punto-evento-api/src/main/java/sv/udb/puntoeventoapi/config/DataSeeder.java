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
import sv.udb.puntoeventoapi.modules.quote.service.QuoteService;
import sv.udb.puntoeventoapi.modules.reservation.entity.Reservation;
import sv.udb.puntoeventoapi.modules.reservation.repository.ReservationRepository;
import sv.udb.puntoeventoapi.modules.reservation.service.ReservationService;
import sv.udb.puntoeventoapi.modules.reservation.dto.ReservationDto;
import sv.udb.puntoeventoapi.modules.task.entity.Task;
import sv.udb.puntoeventoapi.modules.task.repository.TaskRepository;
import sv.udb.puntoeventoapi.modules.assignment.entity.Assignment;
import sv.udb.puntoeventoapi.modules.assignment.repository.AssignmentRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
    private final QuoteService quoteService;
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;
    private final TaskRepository taskRepository;
    private final AssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("🌱 Iniciando seeder de datos...");
        
        User admin = createDefaultAdmin();
        User employee = createDefaultEmployee();
        createSampleClients(admin);
        createSampleEmployees(admin, employee);
        
        // Crear datos adicionales para el flujo completo
        createSampleRequests(admin);
        createSampleQuotes(admin);
        createSampleReservations(admin);
        createSampleTasks(admin);
        
        log.info("✅ Seeder de datos completado exitosamente");
    }

    private User createDefaultAdmin() {
        String adminEmail = "admin@puntoevento.com";
        
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .name("Administrador del Sistema")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .userType(UserType.ADMIN)
                    .active(true)
                    .createdAt(String.valueOf(LocalDateTime.now()))
                    .updatedAt(String.valueOf(LocalDateTime.now()))
                    .build();

            User savedAdmin = userRepository.save(admin);
            log.info("👑 Usuario administrador creado: {} ({})", adminEmail, savedAdmin.getId());
            return savedAdmin;
        } else {
            log.info("👑 Usuario administrador ya existe: {}", adminEmail);
            return userRepository.findByEmail(adminEmail).get();
        }
    }

    private User createDefaultEmployee() {
        String employeeEmail = "empleado@puntoevento.com";
        
        if (userRepository.findByEmail(employeeEmail).isEmpty()) {
            User employee = User.builder()
                    .name("Empleado Ejemplo")
                    .email(employeeEmail)
                    .password(passwordEncoder.encode("empleado123"))
                    .userType(UserType.EMPLOYEE)
                    .active(true)
                    .createdAt(String.valueOf(LocalDateTime.now()))
                    .updatedAt(String.valueOf(LocalDateTime.now()))
                    .build();

            User savedEmployee = userRepository.save(employee);
            log.info("👨‍💼 Usuario empleado creado: {} ({})", employeeEmail, savedEmployee.getId());
            return savedEmployee;
        } else {
            log.info("👨‍💼 Usuario empleado ya existe: {}", employeeEmail);
            return userRepository.findByEmail(employeeEmail).get();
        }
    }

    private void createSampleClients(User admin) {
        // Cliente Natural
        if (!clientRepository.existsByDocument("12345678-9")) {
            // Verificar si el usuario ya existe
            User savedClientUser1;
            if (userRepository.findByEmail("juan.perez@email.com").isPresent()) {
                savedClientUser1 = userRepository.findByEmail("juan.perez@email.com").get();
                log.info("👤 Usuario cliente ya existe: {}", "juan.perez@email.com");
            } else {
                // Crear usuario para el cliente
                User clientUser1 = User.builder()
                        .name("Juan Pérez González")
                        .email("juan.perez@email.com")
                        .password(passwordEncoder.encode("cliente123"))
                        .userType(UserType.CLIENT)
                        .active(true)
                        .createdAt(String.valueOf(LocalDateTime.now()))
                        .updatedAt(String.valueOf(LocalDateTime.now()))
                        .build();
                savedClientUser1 = userRepository.save(clientUser1);
                log.info("👤 Usuario cliente creado: {}", clientUser1.getEmail());
            }

            Client client1 = Client.builder()
                    .name("Juan Pérez González")
                    .document("12345678-9")
                    .personType(PersonType.Natural)
                    .phone("+503 1234-5678")
                    .email("juan.perez@email.com")
                    .address("San Salvador, El Salvador")
                    .status(Status.Activo)
                    .user(savedClientUser1)
                    .createdBy(admin.getId())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            clientRepository.save(client1);
            log.info("👤 Cliente natural creado: {} - {} (Usuario: {})", client1.getName(), client1.getDocument(), savedClientUser1.getEmail());
        }

        // Cliente Jurídico
        if (!clientRepository.existsByDocument("0614-123456-001-7")) {
            // Verificar si el usuario ya existe
            User savedClientUser2;
            if (userRepository.findByEmail("contacto@empresaejemplo.com").isPresent()) {
                savedClientUser2 = userRepository.findByEmail("contacto@empresaejemplo.com").get();
                log.info("👤 Usuario cliente ya existe: {}", "contacto@empresaejemplo.com");
            } else {
                // Crear usuario para el cliente jurídico
                User clientUser2 = User.builder()
                        .name("Empresa Ejemplo S.A. de C.V.")
                        .email("contacto@empresaejemplo.com")
                        .password(passwordEncoder.encode("empresa123"))
                        .userType(UserType.CLIENT)
                        .active(true)
                        .createdAt(String.valueOf(LocalDateTime.now()))
                        .updatedAt(String.valueOf(LocalDateTime.now()))
                        .build();
                savedClientUser2 = userRepository.save(clientUser2);
                log.info("👤 Usuario cliente creado: {}", clientUser2.getEmail());
            }

            Client client2 = Client.builder()
                    .name("Empresa Ejemplo S.A. de C.V.")
                    .document("0614-123456-001-7")
                    .personType(PersonType.Jurídica)
                    .phone("+503 2234-5678")
                    .email("contacto@empresaejemplo.com")
                    .address("Santa Tecla, La Libertad, El Salvador")
                    .status(Status.Activo)
                    .user(savedClientUser2)
                    .createdBy(admin.getId())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            clientRepository.save(client2);
            log.info("🏢 Cliente jurídico creado: {} - {} (Usuario: {})", client2.getName(), client2.getDocument(), savedClientUser2.getEmail());
        }

        // Cliente adicional
        if (!clientRepository.existsByDocument("87654321-0")) {
            // Verificar si el usuario ya existe
            User savedClientUser3;
            if (userRepository.findByEmail("maria.rodriguez@email.com").isPresent()) {
                savedClientUser3 = userRepository.findByEmail("maria.rodriguez@email.com").get();
                log.info("👤 Usuario cliente ya existe: {}", "maria.rodriguez@email.com");
            } else {
                // Crear usuario para el cliente adicional
                User clientUser3 = User.builder()
                        .name("María Rodríguez")
                        .email("maria.rodriguez@email.com")
                        .password(passwordEncoder.encode("maria123"))
                        .userType(UserType.CLIENT)
                        .active(true)
                        .createdAt(String.valueOf(LocalDateTime.now()))
                        .updatedAt(String.valueOf(LocalDateTime.now()))
                        .build();
                savedClientUser3 = userRepository.save(clientUser3);
                log.info("👤 Usuario cliente creado: {}", clientUser3.getEmail());
            }

            Client client3 = Client.builder()
                    .name("María Rodríguez")
                    .document("87654321-0")
                    .personType(PersonType.Natural)
                    .phone("+503 3234-5678")
                    .email("maria.rodriguez@email.com")
                    .address("San Miguel, El Salvador")
                    .status(Status.Activo)
                    .user(savedClientUser3)
                    .createdBy(admin.getId())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            clientRepository.save(client3);
            log.info("👤 Cliente adicional creado: {} - {} (Usuario: {})", client3.getName(), client3.getDocument(), savedClientUser3.getEmail());
        }
    }

    private void createSampleEmployees(User admin, User employeeUser) {
        // Empleado Permanente
        if (!employeeRepository.existsByDocument("11111111-1")) {
            // Verificar si el usuario ya existe
            User savedEmpUser1;
            if (userRepository.findByEmail("carlos.mendoza@puntoevento.com").isPresent()) {
                savedEmpUser1 = userRepository.findByEmail("carlos.mendoza@puntoevento.com").get();
                log.info("👨‍💼 Usuario empleado ya existe: {}", "carlos.mendoza@puntoevento.com");
            } else {
                // Crear usuario para el empleado
                User empUser1 = User.builder()
                        .name("Carlos Mendoza")
                        .email("carlos.mendoza@puntoevento.com")
                        .password(passwordEncoder.encode("carlos123"))
                        .userType(UserType.EMPLOYEE)
                        .active(true)
                        .createdAt(String.valueOf(LocalDateTime.now()))
                        .updatedAt(String.valueOf(LocalDateTime.now()))
                        .build();
                savedEmpUser1 = userRepository.save(empUser1);
                log.info("👨‍💼 Usuario empleado creado: {}", empUser1.getEmail());
            }

            Employee employee1 = Employee.builder()
                    .name("Carlos Mendoza")
                    .document("11111111-1")
                    .personType(PersonType.Natural)
                    .contractType(ContractType.Permanente)
                    .phone("+503 4234-5678")
                    .email("carlos.mendoza@puntoevento.com")
                    .address("San Salvador, El Salvador")
                    .status(Status.Activo)
                    .user(savedEmpUser1)
                    .createdBy(admin.getId())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            employeeRepository.save(employee1);
            log.info("👨‍💼 Empleado permanente creado: {} - {} (Usuario: {})", employee1.getName(), employee1.getDocument(), savedEmpUser1.getEmail());
        }

        // Empleado Por Horas
        if (!employeeRepository.existsByDocument("22222222-2")) {
            // Verificar si el usuario ya existe
            User savedEmpUser2;
            if (userRepository.findByEmail("ana.lopez@puntoevento.com").isPresent()) {
                savedEmpUser2 = userRepository.findByEmail("ana.lopez@puntoevento.com").get();
                log.info("👩‍💼 Usuario empleada ya existe: {}", "ana.lopez@puntoevento.com");
            } else {
                // Crear usuario para la empleada
                User empUser2 = User.builder()
                        .name("Ana López")
                        .email("ana.lopez@puntoevento.com")
                        .password(passwordEncoder.encode("ana123"))
                        .userType(UserType.EMPLOYEE)
                        .active(true)
                        .createdAt(String.valueOf(LocalDateTime.now()))
                        .updatedAt(String.valueOf(LocalDateTime.now()))
                        .build();
                savedEmpUser2 = userRepository.save(empUser2);
                log.info("👩‍💼 Usuario empleada creado: {}", empUser2.getEmail());
            }

            Employee employee2 = Employee.builder()
                    .name("Ana López")
                    .document("22222222-2")
                    .personType(PersonType.Natural)
                    .contractType(ContractType.PorHoras)
                    .phone("+503 5234-5678")
                    .email("ana.lopez@puntoevento.com")
                    .address("Soyapango, San Salvador, El Salvador")
                    .status(Status.Activo)
                    .user(savedEmpUser2)
                    .createdBy(admin.getId())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            employeeRepository.save(employee2);
            log.info("👩‍💼 Empleada por horas creada: {} - {} (Usuario: {})", employee2.getName(), employee2.getDocument(), savedEmpUser2.getEmail());
        }

        // Empleado adicional
        if (!employeeRepository.existsByDocument("33333333-3")) {
            // Verificar si el usuario ya existe
            User savedEmpUser3;
            if (userRepository.findByEmail("roberto.silva@puntoevento.com").isPresent()) {
                savedEmpUser3 = userRepository.findByEmail("roberto.silva@puntoevento.com").get();
                log.info("👨‍💼 Usuario empleado ya existe: {}", "roberto.silva@puntoevento.com");
            } else {
                // Crear usuario para el empleado adicional
                User empUser3 = User.builder()
                        .name("Roberto Silva")
                        .email("roberto.silva@puntoevento.com")
                        .password(passwordEncoder.encode("roberto123"))
                        .userType(UserType.EMPLOYEE)
                        .active(true)
                        .createdAt(String.valueOf(LocalDateTime.now()))
                        .updatedAt(String.valueOf(LocalDateTime.now()))
                        .build();
                savedEmpUser3 = userRepository.save(empUser3);
                log.info("👨‍💼 Usuario empleado creado: {}", empUser3.getEmail());
            }

            Employee employee3 = Employee.builder()
                    .name("Roberto Silva")
                    .document("33333333-3")
                    .personType(PersonType.Natural)
                    .contractType(ContractType.Permanente)
                    .phone("+503 6234-5678")
                    .email("roberto.silva@puntoevento.com")
                    .address("Mejicanos, San Salvador, El Salvador")
                    .status(Status.Activo)
                    .user(savedEmpUser3)
                    .createdBy(admin.getId())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            employeeRepository.save(employee3);
            log.info("👨‍💼 Empleado adicional creado: {} - {} (Usuario: {})", employee3.getName(), employee3.getDocument(), savedEmpUser3.getEmail());
        }
    }
    
    private void createSampleRequests(User admin) {
        log.info("📋 Creando solicitudes de muestra...");
        
        // Buscar clientes existentes
        List<Client> clients = clientRepository.findAll();
        if (clients.isEmpty()) {
            log.warn("⚠️ No hay clientes disponibles para crear solicitudes");
            return;
        }
        
        Client client1 = clients.get(0);
        
        // Solicitud 1
        Request request1 = Request.builder()
                .eventDate("2024-12-25")
                .location("Hotel Real Intercontinental")
                .requestedServices("Música, Catering, Mobiliario")
                .notes("Evento corporativo de fin de año")
                .status(Status.Activo)
                .client(client1)
                .createdBy(admin.getId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        requestRepository.save(request1);
        log.info("📋 Solicitud creada: {} - {}", request1.getEventDate(), request1.getLocation());
        
        // Solicitud 2 (si hay más clientes)
        if (clients.size() > 1) {
            Client client2 = clients.get(1);
            Request request2 = Request.builder()
                    .eventDate("2024-12-20")
                    .location("Centro de Convenciones")
                    .requestedServices("Sonido, Iluminación, Decoraciones")
                    .notes("Boda de María y Juan")
                    .status(Status.Activo)
                    .client(client2)
                    .createdBy(admin.getId())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            requestRepository.save(request2);
            log.info("📋 Solicitud creada: {} - {}", request2.getEventDate(), request2.getLocation());
        }
    }
    
    private void createSampleQuotes(User admin) {
        log.info("💰 Creando cotizaciones de muestra...");
        
        List<Request> requests = requestRepository.findAll();
        if (requests.isEmpty()) {
            log.warn("⚠️ No hay solicitudes disponibles para crear cotizaciones");
            return;
        }
        
        for (Request request : requests) {
            try {
                // Crear cotización desde la solicitud
                quoteService.createQuoteFromRequest(request.getId(), admin.getId());
                
                // Actualizar precios
                Quote quote = quoteRepository.findByClientId(request.getClient().getId()).stream().findFirst().orElse(null);
                if (quote != null) {
                    BigDecimal subtotal = new BigDecimal("2500.00");
                    BigDecimal taxTotal = new BigDecimal("375.00");
                    BigDecimal additionalCosts = new BigDecimal("100.00");
                    
                    quoteService.updateQuotePrices(quote.getId(), subtotal, taxTotal, additionalCosts);
                    log.info("💰 Cotización creada y actualizada: {}", quote.getId());
                }
            } catch (Exception e) {
                log.error("Error al crear cotización para solicitud {}: {}", request.getId(), e.getMessage());
            }
        }
    }
    
    private void createSampleReservations(User admin) {
        log.info("📅 Creando reservas de muestra...");
        
        List<Quote> quotes = quoteRepository.findAll();
        if (quotes.isEmpty()) {
            log.warn("⚠️ No hay cotizaciones disponibles para crear reservas");
            return;
        }
        
        // Aprobar la primera cotización y crear reserva
        Quote quote = quotes.get(0);
        try {
            // Aprobar cotización
            quoteService.approveQuote(quote.getId());
            
            // Crear reserva
            ReservationDto reservationDto = ReservationDto.builder()
                    .quoteId(quote.getId())
                    .scheduledFor("2024-12-25T18:00:00")
                    .location(quote.getClient().getAddress())
                    .notes("Evento corporativo de fin de año")
                    .progressPercentage(BigDecimal.ZERO)
                    .build();
            
            reservationService.createReservation(reservationDto, admin.getId());
            log.info("📅 Reserva creada para cotización: {}", quote.getId());
        } catch (Exception e) {
            log.error("Error al crear reserva: {}", e.getMessage());
        }
    }
    
    private void createSampleTasks(User admin) {
        log.info("📝 Creando tareas de muestra...");
        
        List<Reservation> reservations = reservationRepository.findAll();
        List<Employee> employees = employeeRepository.findAll();
        
        if (reservations.isEmpty() || employees.isEmpty()) {
            log.warn("⚠️ No hay reservas o empleados disponibles para crear tareas");
            return;
        }
        
        Reservation reservation = reservations.get(0);
        
        // Obtener empleados
        Employee employee1 = employees.get(0);
        
        // Tarea 1
        Task task1 = Task.builder()
                .reservation(reservation)
                .title("Instalación de equipo de sonido")
                .description("Configurar y probar el sistema de audio para el evento")
                .employee(employee1)
                .status(sv.udb.puntoeventoapi.modules.commons.enums.TaskStatus.PENDIENTE)
                .startDatetime(LocalDateTime.now())
                .endDatetime(LocalDateTime.now().plusDays(1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Task savedTask1 = taskRepository.save(task1);
        Assignment assignment1 = Assignment.builder()
                .title("Instalación de equipo de sonido")
                .employeeId(employee1.getId())
                .startDatetime(LocalDateTime.now())
                .endDatetime(LocalDateTime.now().plusDays(1))
                .estimatedHours(8)
                .baseCost(500.0)
                .extraPercentage(0.0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        assignmentRepository.save(assignment1);
        log.info("📝 Tarea creada y asignada: {} -> {}", task1.getTitle(), employee1.getName());
        
        // Tarea 2 (si hay más empleados)
        if (employees.size() > 1) {
            Employee employee2 = employees.get(1);
            Task task2 = Task.builder()
                    .reservation(reservation)
                    .title("Entrega de mobiliario")
                    .description("Entregar y colocar mesas y sillas para el evento")
                    .employee(employee2)
                    .status(sv.udb.puntoeventoapi.modules.commons.enums.TaskStatus.PENDIENTE)
                    .startDatetime(LocalDateTime.now())
                    .endDatetime(LocalDateTime.now().plusDays(1))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            Task savedTask2 = taskRepository.save(task2);
            
            Assignment assignment2 = Assignment.builder()
                    .title("Entrega de mobiliario")
                    .employeeId(employee2.getId())
                    .startDatetime(LocalDateTime.now())
                    .endDatetime(LocalDateTime.now().plusDays(1))
                    .estimatedHours(6)
                    .baseCost(300.0)
                    .extraPercentage(0.0)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            assignmentRepository.save(assignment2);
            log.info("📝 Tarea creada y asignada: {} -> {}", task2.getTitle(), employee2.getName());
        }
    }
}
