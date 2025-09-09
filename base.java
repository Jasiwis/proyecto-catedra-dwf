import java.io.File;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

//Atributos
class User {
    private final UUID id;
    private String name;
    private String email;
    private String password;
    private final Role role;
    private final Date createdAt;
    private Date updatedAt;

    public User(UUID id, String name, String email, String password, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = new Date();
    }

    public void updateData(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.updatedAt = new Date();
    }
    
    public UUID getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public Role getRole() {
        return role;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    @Override
    public String toString() {
        return "ID: " + id + "\nNombre: " + name + "\nEmail: " + email + "\nRol: " + role;
    }
}

//Roles de un usuario
enum Role {
    ADMIN, CLIENT, EMPLOYEE;
}

interface Manageable {
    void updateData(String name, String phone, String email, String address);
    void deactivate();
}

abstract class Person implements Manageable {
    protected final UUID id;
    protected String name;
    protected String document;
    protected String type;
    protected String phone;
    protected String email;
    protected String address;
    protected String status;
    protected final User createdBy;
    protected final Date createdAt;
    protected Date updatedAt;
    protected Date deactivatedAt;

    public Person(UUID id, String name, String document, String type, String phone, String email, String address, User createdBy) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.type = type;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.status = "Activo";
        this.createdBy = createdBy;
        this.createdAt = new Date();
    }

    @Override
    public void deactivate() {
        this.status = "Inactivo";
        this.deactivatedAt = new Date();
    }
    
    public UUID getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public String getDocument() {
        return document;
    }
    
    public String getType() {
        return type;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getAddress() {
        return address;
    }
    
    public String getStatus() {
        return status;
    }
    
    public User getCreatedBy() {
        return createdBy;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public Date getDeactivatedAt() {
        return deactivatedAt;
    }
    
    @Override
    public String toString() {
        return "ID: " + id + "\nNombre: " + name + "\nDocumento: " + document + 
               "\nTipo: " + type + "\nTeléfono: " + phone + "\nEmail: " + email + 
               "\nDirección: " + address + "\nEstado: " + status;
    }
}
//Clase Client que extiende person
class Client extends Person {
    public Client(UUID id, String name, String document, String type, String phone, String email, String address, User createdBy) {
        super(id, name, document, type, phone, email, address, createdBy);
    }

    @Override
    public void updateData(String name, String phone, String email, String address) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.updatedAt = new Date();
    }
}

class Employee extends Person {
    private final String hiringType;

    public Employee(UUID id, String name, String document, String type, String hiringType, String phone, String email, String address, User createdBy) {
        super(id, name, document, type, phone, email, address, createdBy);
        this.hiringType = hiringType;
    }

    @Override
    public void updateData(String name, String phone, String email, String address) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.updatedAt = new Date();
    }
    
    public String getHiringType() {
        return hiringType;
    }
    
    @Override
    public String toString() {
        return super.toString() + "\nTipo de Contratación: " + hiringType;
    }
}

class QuotationAttachment {
    private final UUID id;
    private final Quotation quotation;
    private final String fileName;
    private final String filePath;
    private final String fileType;
    private final long fileSize;
    private final Date uploadDate;
    private final User uploadedBy;
    private String description;

    public QuotationAttachment(UUID id, Quotation quotation, String fileName, String filePath, 
                              String fileType, long fileSize, User uploadedBy) {
        this.id = id;
        this.quotation = quotation;
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.uploadDate = new Date();
        this.uploadedBy = uploadedBy;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public UUID getId() {
        return id;
    }
    
    public Quotation getQuotation() {
        return quotation;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public long getFileSize() {
        return fileSize;
    }
    
    public Date getUploadDate() {
        return uploadDate;
    }
    
    public User getUploadedBy() {
        return uploadedBy;
    }
    
    public String getDescription() {
        return description;
    }
    
    public File getFile() {
        return new File(filePath);
    }
    
    @Override
    public String toString() {
        return "ID: " + id + "\nNombre de archivo: " + fileName + 
               "\nTipo: " + fileType + "\nTamaño: " + (fileSize / 1024) + " KB" +
               "\nDescripción: " + (description != null ? description : "Sin descripción");
    }
}

class Quotation {
    private final UUID id;
    private final Client client;
    private String status;
    private final Date tentativeStartDate;
    private final Date tentativeEndDate;
    private BigDecimal totalCost;
    private final List<Assignment> assignments;
    private final List<QuotationAttachment> attachments;
    private final String title;
    private String description;

    public Quotation(UUID id, Client client, Date tentativeStartDate, Date tentativeEndDate, String title) {
        this.id = id;
        this.client = client;
        this.status = "En Progreso";
        this.tentativeStartDate = tentativeStartDate;
        this.tentativeEndDate = tentativeEndDate;
        this.totalCost = BigDecimal.ZERO;
        this.assignments = new ArrayList<>();
        this.attachments = new ArrayList<>();
        this.title = title;
    }

    public void addAssignment(Assignment assignment) {
        this.assignments.add(assignment);
        recalculateCost();
    }

    public String finalizeQuotation() {
        if (!assignments.isEmpty()) {
            this.status = "Finalizada";
            return "Cotización finalizada con éxito";
        }
        return "No se puede finalizar: no hay asignaciones";
    }
    
    public void addAttachment(QuotationAttachment attachment) {
        this.attachments.add(attachment);
    }
    
    public List<QuotationAttachment> getAttachments() {
        return new ArrayList<>(attachments);
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    private void recalculateCost() {
        this.totalCost = assignments.stream()
                .map(Assignment::getTotalCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public UUID getId() {
        return id;
    }
    
    public Client getClient() {
        return client;
    }
    
    public String getStatus() {
        return status;
    }
    
    public Date getTentativeStartDate() {
        return tentativeStartDate;
    }
    
    public Date getTentativeEndDate() {
        return tentativeEndDate;
    }
    
    public BigDecimal getTotalCost() {
        return totalCost;
    }
    
    public List<Assignment> getAssignments() {
        return new ArrayList<>(assignments);
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getDescription() {
        return description;
    }
    
    @Override
    public String toString() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        return "ID: " + id + 
               "\nTítulo: " + title + 
               "\nCliente: " + client.getName() + 
               "\nEstado: " + status + 
               "\nFecha Inicio Tentativa: " + dateFormat.format(tentativeStartDate) + 
               "\nFecha Fin Tentativa: " + dateFormat.format(tentativeEndDate) + 
               "\nCosto Total: $" + totalCost + 
               "\nDescripción: " + (description != null ? description : "Sin descripción") + 
               "\nAsignaciones: " + assignments.size() + 
               "\nAdjuntos: " + attachments.size();
    }
}

class Assignment {
    private final UUID id;
    private final Quotation quotation;
    private final Employee worker;
    private final String area;
    private final BigDecimal hourlyRate;
    private final Date startDate;
    private final Date endDate;
    private final int estimatedHours;
    private final BigDecimal baseCost;
    private final BigDecimal extraIncrement;
    private final String title;
    private String taskDescription;
    private List<String> taskList;

    public Assignment(UUID id, Quotation quotation, Employee worker, String area, BigDecimal hourlyRate, 
                     Date startDate, Date endDate, int estimatedHours, BigDecimal extraIncrement, 
                     String title) {
        this.id = id;
        this.quotation = quotation;
        this.worker = worker;
        this.area = area;
        this.hourlyRate = hourlyRate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.estimatedHours = estimatedHours;
        this.extraIncrement = extraIncrement;
        this.baseCost = hourlyRate.multiply(BigDecimal.valueOf(estimatedHours));
        this.title = title;
        this.taskList = new ArrayList<>();
    }

    public BigDecimal getTotalCost() {
        return baseCost.add(baseCost.multiply(extraIncrement.divide(BigDecimal.valueOf(100))));
    }
    
    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }
    
    public void addTask(String task) {
        if (taskList == null) {
            taskList = new ArrayList<>();
        }
        taskList.add(task);
    }
    
    public List<String> getTaskList() {
        return new ArrayList<>(taskList);
    }
    
    public UUID getId() {
        return id;
    }
    
    public Quotation getQuotation() {
        return quotation;
    }
    
    public Employee getWorker() {
        return worker;
    }
    
    public String getArea() {
        return area;
    }
    
    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }
    
    public Date getStartDate() {
        return startDate;
    }
    
    public Date getEndDate() {
        return endDate;
    }
    
    public int getEstimatedHours() {
        return estimatedHours;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getTaskDescription() {
        return taskDescription;
    }
    
    @Override
    public String toString() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        StringBuilder sb = new StringBuilder();
        sb.append("ID: ").append(id)
          .append("\nTítulo: ").append(title)
          .append("\nEmpleado: ").append(worker.getName())
          .append("\nÁrea: ").append(area)
          .append("\nTarifa por Hora: $").append(hourlyRate)
          .append("\nFecha Inicio: ").append(dateFormat.format(startDate))
          .append("\nFecha Fin: ").append(dateFormat.format(endDate))
          .append("\nHoras Estimadas: ").append(estimatedHours)
          .append("\nCosto Base: $").append(baseCost)
          .append("\nIncremento Extra: ").append(extraIncrement).append("%")
          .append("\nCosto Total: $").append(getTotalCost())
          .append("\nDescripción: ").append(taskDescription != null ? taskDescription : "Sin descripción");
        
        if (taskList != null && !taskList.isEmpty()) {
            sb.append("\nTareas:");
            for (int i = 0; i < taskList.size(); i++) {
                sb.append("\n  ").append(i + 1).append(". ").append(taskList.get(i));
            }
        }
        
        return sb.toString();
    }
}

class SistemaGestion {
    private final Scanner scanner;
    private final List<User> users;
    private final List<Client> clients;
    private final List<Employee> employees;
    private final List<Quotation> quotations;
    private final User currentUser; // Marcado como final para resolver la advertencia
    private final SimpleDateFormat dateFormat;
    
    public SistemaGestion() {
        scanner = new Scanner(System.in);
        users = new ArrayList<>();
        clients = new ArrayList<>();
        employees = new ArrayList<>();
        quotations = new ArrayList<>();
        dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        
        // Crear usuario administrador por defecto
        User admin = new User(UUID.randomUUID(), "Administrador", "admin@sistema.com", "admin123", Role.ADMIN);
        users.add(admin);
        currentUser = admin;
    }
    
    public void iniciar() {
        boolean salir = false;
        
        while (!salir) {
            mostrarMenuPrincipal();
            int opcion = leerOpcion();
            
            switch (opcion) {
                case 1 -> gestionarUsuarios();
                case 2 -> gestionarClientes();
                case 3 -> gestionarEmpleados();
                case 4 -> gestionarCotizaciones();
                case 0 -> {
                    salir = true;
                    System.out.println("¡Gracias por usar el Sistema de Gestión de Cotizaciones!");
                }
                default -> System.out.println("Opción no válida. Intente nuevamente.");
            }
        }
    }
    
    private void mostrarMenuPrincipal() {
        System.out.println("\n===== SISTEMA DE GESTIÓN DE COTIZACIONES =====");
        System.out.println("Usuario actual: " + currentUser.getName() + " (" + currentUser.getRole() + ")");
        System.out.println("1. Gestión de Usuarios");
        System.out.println("2. Gestión de Clientes");
        System.out.println("3. Gestión de Empleados");
        System.out.println("4. Gestión de Cotizaciones");
        System.out.println("0. Salir");
        System.out.print("Seleccione una opción: ");
    }
    
    private int leerOpcion() {
        try {
            return Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            return -1;
        }
    }
    
    // ===== GESTIÓN DE USUARIOS =====
    
    private void gestionarUsuarios() {
        boolean volver = false;
        
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE USUARIOS =====");
            System.out.println("1. Listar Usuarios");
            System.out.println("2. Crear Usuario");
            System.out.println("3. Modificar Usuario");
            System.out.println("4. Buscar Usuario");
            System.out.println("0. Volver al Menú Principal");
            System.out.print("Seleccione una opción: ");
            
            int opcion = leerOpcion();
            
            switch (opcion) {
                case 1 -> listarUsuarios();
                case 2 -> crearUsuario();
                case 3 -> modificarUsuario();
                case 4 -> buscarUsuario();
                case 0 -> volver = true;
                default -> System.out.println("Opción no válida. Intente nuevamente.");
            }
        }
    }
    
    private void listarUsuarios() {
        System.out.println("\n===== LISTA DE USUARIOS =====");
        if (users.isEmpty()) {
            System.out.println("No hay usuarios registrados.");
            return;
        }
        
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            System.out.println((i + 1) + ". " + user.getName() + " - " + user.getEmail() + " (" + user.getRole() + ")");
        }
    }
    
    private void crearUsuario() {
        System.out.println("\n===== CREAR NUEVO USUARIO =====");
        
        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();
        
        System.out.print("Email: ");
        String email = scanner.nextLine();
        
        System.out.print("Contraseña: ");
        String password = scanner.nextLine();
        
        System.out.println("Rol:");
        System.out.println("1. ADMIN");
        System.out.println("2. CLIENT");
        System.out.println("3. EMPLOYEE");
        System.out.print("Seleccione un rol: ");
        int rolOpcion = leerOpcion();
        
        Role rol = switch (rolOpcion) {
            case 1 -> Role.ADMIN;
            case 2 -> Role.CLIENT;
            case 3 -> Role.EMPLOYEE;
            default -> {
                System.out.println("Opción no válida. Se asignará rol CLIENT por defecto.");
                yield Role.CLIENT;
            }
        };
        
        User nuevoUsuario = new User(UUID.randomUUID(), nombre, email, password, rol);
        users.add(nuevoUsuario);
        
        System.out.println("Usuario creado exitosamente.");
    }
    
    private void modificarUsuario() {
        listarUsuarios();
        
        if (users.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de usuario a modificar (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= users.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        User usuario = users.get(indice);
        
        System.out.println("\n===== MODIFICAR USUARIO =====");
        System.out.println("Usuario actual: " + usuario.getName() + " - " + usuario.getEmail());
        
        System.out.print("Nuevo nombre (dejar en blanco para mantener actual): ");
        String nombre = scanner.nextLine();
        if (nombre.isEmpty()) {
            nombre = usuario.getName();
        }
        
        System.out.print("Nuevo email (dejar en blanco para mantener actual): ");
        String email = scanner.nextLine();
        if (email.isEmpty()) {
            email = usuario.getEmail();
        }
        
        System.out.print("Nueva contraseña (dejar en blanco para mantener actual): ");
        String password = scanner.nextLine();
        if (password.isEmpty()) {
            password = usuario.getPassword();
        }
        
        usuario.updateData(nombre, email, password);
        System.out.println("Usuario actualizado exitosamente.");
    }
    
    private void buscarUsuario() {
        System.out.println("\n===== BUSCAR USUARIO =====");
        System.out.print("Ingrese nombre o email para buscar: ");
        String busqueda = scanner.nextLine().toLowerCase();
        
        List<User> resultados = new ArrayList<>();
        
        for (User user : users) {
            if (user.getName().toLowerCase().contains(busqueda) || 
                user.getEmail().toLowerCase().contains(busqueda)) {
                resultados.add(user);
            }
        }
        
        if (resultados.isEmpty()) {
            System.out.println("No se encontraron usuarios que coincidan con la búsqueda.");
            return;
        }
        
        System.out.println("\nResultados de la búsqueda:");
        for (int i = 0; i < resultados.size(); i++) {
            User user = resultados.get(i);
            System.out.println((i + 1) + ". " + user.getName() + " - " + user.getEmail() + " (" + user.getRole() + ")");
        }
    }
    
    // ===== GESTIÓN DE CLIENTES =====
    
    private void gestionarClientes() {
        boolean volver = false;
        
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE CLIENTES =====");
            System.out.println("1. Listar Clientes");
            System.out.println("2. Crear Cliente");
            System.out.println("3. Modificar Cliente");
            System.out.println("4. Desactivar Cliente");
            System.out.println("5. Ver Detalles de Cliente");
            System.out.println("0. Volver al Menú Principal");
            System.out.print("Seleccione una opción: ");
            
            int opcion = leerOpcion();
            
            switch (opcion) {
                case 1 -> listarClientes();
                case 2 -> crearCliente();
                case 3 -> modificarCliente();
                case 4 -> desactivarCliente();
                case 5 -> verDetallesCliente();
                case 0 -> volver = true;
                default -> System.out.println("Opción no válida. Intente nuevamente.");
            }
        }
    }
    
    private void listarClientes() {
        System.out.println("\n===== LISTA DE CLIENTES =====");
        if (clients.isEmpty()) {
            System.out.println("No hay clientes registrados.");
            return;
        }
        
        for (int i = 0; i < clients.size(); i++) {
            Client client = clients.get(i);
            System.out.println((i + 1) + ". " + client.getName() + " - " + client.getDocument() + " (" + client.getStatus() + ")");
        }
    }
    
    private void crearCliente() {
        System.out.println("\n===== CREAR NUEVO CLIENTE =====");
        
        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();
        
        System.out.print("Documento: ");
        String documento = scanner.nextLine();
        
        System.out.print("Tipo (Natural/Jurídico): ");
        String tipo = scanner.nextLine();
        
        System.out.print("Teléfono: ");
        String telefono = scanner.nextLine();
        
        System.out.print("Email: ");
        String email = scanner.nextLine();
        
        System.out.print("Dirección: ");
        String direccion = scanner.nextLine();
        
        Client nuevoCliente = new Client(UUID.randomUUID(), nombre, documento, tipo, telefono, email, direccion, currentUser);
        clients.add(nuevoCliente);
        
        System.out.println("Cliente creado exitosamente.");
    }
    
    private void modificarCliente() {
        listarClientes();
        
        if (clients.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de cliente a modificar (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= clients.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        Client cliente = clients.get(indice);
        
        System.out.println("\n===== MODIFICAR CLIENTE =====");
        System.out.println("Cliente actual: " + cliente.getName() + " - " + cliente.getDocument());
        
        System.out.print("Nuevo nombre (dejar en blanco para mantener actual): ");
        String nombre = scanner.nextLine();
        if (nombre.isEmpty()) {
            nombre = cliente.getName();
        }
        
        System.out.print("Nuevo teléfono (dejar en blanco para mantener actual): ");
        String telefono = scanner.nextLine();
        if (telefono.isEmpty()) {
            telefono = cliente.getPhone();
        }
        
        System.out.print("Nuevo email (dejar en blanco para mantener actual): ");
        String email = scanner.nextLine();
        if (email.isEmpty()) {
            email = cliente.getEmail();
        }
        
        System.out.print("Nueva dirección (dejar en blanco para mantener actual): ");
        String direccion = scanner.nextLine();
        if (direccion.isEmpty()) {
            direccion = cliente.getAddress();
        }
        
        cliente.updateData(nombre, telefono, email, direccion);
        System.out.println("Cliente actualizado exitosamente.");
    }
    
    private void desactivarCliente() {
        listarClientes();
        
        if (clients.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de cliente a desactivar (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= clients.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        Client cliente = clients.get(indice);
        
        if ("Inactivo".equals(cliente.getStatus())) {
            System.out.println("Este cliente ya está desactivado.");
            return;
        }
        
        System.out.print("¿Está seguro de desactivar al cliente " + cliente.getName() + "? (S/N): ");
        String confirmacion = scanner.nextLine();
        
        if (confirmacion.equalsIgnoreCase("S")) {
            cliente.deactivate();
            System.out.println("Cliente desactivado exitosamente.");
        } else {
            System.out.println("Operación cancelada.");
        }
    }
    
    private void verDetallesCliente() {
        listarClientes();
        
        if (clients.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de cliente para ver detalles (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= clients.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        Client cliente = clients.get(indice);
        
        System.out.println("\n===== DETALLES DEL CLIENTE =====");
        System.out.println(cliente);
        
        // Mostrar cotizaciones asociadas
        List<Quotation> cotizacionesCliente = new ArrayList<>();
        for (Quotation q : quotations) {
            if (q.getClient().getId().equals(cliente.getId())) {
                cotizacionesCliente.add(q);
            }
        }
        
        if (!cotizacionesCliente.isEmpty()) {
            System.out.println("\nCotizaciones asociadas:");
            for (int i = 0; i < cotizacionesCliente.size(); i++) {
                Quotation q = cotizacionesCliente.get(i);
                System.out.println((i + 1) + ". " + q.getTitle() + " - Estado: " + q.getStatus());
            }
        } else {
            System.out.println("\nEste cliente no tiene cotizaciones asociadas.");
        }
    }
    
    // ===== GESTIÓN DE EMPLEADOS =====
    
    private void gestionarEmpleados() {
        boolean volver = false;
        
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE EMPLEADOS =====");
            System.out.println("1. Listar Empleados");
            System.out.println("2. Crear Empleado");
            System.out.println("3. Modificar Empleado");
            System.out.println("4. Desactivar Empleado");
            System.out.println("5. Ver Detalles de Empleado");
            System.out.println("0. Volver al Menú Principal");
            System.out.print("Seleccione una opción: ");
            
            int opcion = leerOpcion();
            
            switch (opcion) {
                case 1 -> listarEmpleados();
                case 2 -> crearEmpleado();
                case 3 -> modificarEmpleado();
                case 4 -> desactivarEmpleado();
                case 5 -> verDetallesEmpleado();
                case 0 -> volver = true;
                default -> System.out.println("Opción no válida. Intente nuevamente.");
            }
        }
    }
    
    private void listarEmpleados() {
        System.out.println("\n===== LISTA DE EMPLEADOS =====");
        if (employees.isEmpty()) {
            System.out.println("No hay empleados registrados.");
            return;
        }
        
        for (int i = 0; i < employees.size(); i++) {
            Employee employee = employees.get(i);
            System.out.println((i + 1) + ". " + employee.getName() + " - " + employee.getDocument() + " (" + employee.getStatus() + ")");
        }
    }
    
    private void crearEmpleado() {
        System.out.println("\n===== CREAR NUEVO EMPLEADO =====");
        
        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();
        
        System.out.print("Documento: ");
        String documento = scanner.nextLine();
        
        System.out.print("Tipo (Natural/Jurídico): ");
        String tipo = scanner.nextLine();
        
        System.out.print("Tipo de Contratación (Permanente/Temporal/Freelance): ");
        String tipoContratacion = scanner.nextLine();
        
        System.out.print("Teléfono: ");
        String telefono = scanner.nextLine();
        
        System.out.print("Email: ");
        String email = scanner.nextLine();
        
        System.out.print("Dirección: ");
        String direccion = scanner.nextLine();
        
        Employee nuevoEmpleado = new Employee(UUID.randomUUID(), nombre, documento, tipo, tipoContratacion, telefono, email, direccion, currentUser);
        employees.add(nuevoEmpleado);
        
        System.out.println("Empleado creado exitosamente.");
    }
    
    private void modificarEmpleado() {
        listarEmpleados();
        
        if (employees.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de empleado a modificar (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= employees.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        Employee empleado = employees.get(indice);
        
        System.out.println("\n===== MODIFICAR EMPLEADO =====");
        System.out.println("Empleado actual: " + empleado.getName() + " - " + empleado.getDocument());
        
        System.out.print("Nuevo nombre (dejar en blanco para mantener actual): ");
        String nombre = scanner.nextLine();
        if (nombre.isEmpty()) {
            nombre = empleado.getName();
        }
        
        System.out.print("Nuevo teléfono (dejar en blanco para mantener actual): ");
        String telefono = scanner.nextLine();
        if (telefono.isEmpty()) {
            telefono = empleado.getPhone();
        }
        
        System.out.print("Nuevo email (dejar en blanco para mantener actual): ");
        String email = scanner.nextLine();
        if (email.isEmpty()) {
            email = empleado.getEmail();
        }
        
        System.out.print("Nueva dirección (dejar en blanco para mantener actual): ");
        String direccion = scanner.nextLine();
        if (direccion.isEmpty()) {
            direccion = empleado.getAddress();
        }
        
        empleado.updateData(nombre, telefono, email, direccion);
        System.out.println("Empleado actualizado exitosamente.");
    }
    
    private void desactivarEmpleado() {
        listarEmpleados();
        
        if (employees.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de empleado a desactivar (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= employees.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        Employee empleado = employees.get(indice);
        
        if ("Inactivo".equals(empleado.getStatus())) {
            System.out.println("Este empleado ya está desactivado.");
            return;
        }
        
        System.out.print("¿Está seguro de desactivar al empleado " + empleado.getName() + "? (S/N): ");
        String confirmacion = scanner.nextLine();
        
        if (confirmacion.equalsIgnoreCase("S")) {
            empleado.deactivate();
            System.out.println("Empleado desactivado exitosamente.");
        } else {
            System.out.println("Operación cancelada.");
        }
    }
    
    private void verDetallesEmpleado() {
        listarEmpleados();
        
        if (employees.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de empleado para ver detalles (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= employees.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        Employee empleado = employees.get(indice);
        
        System.out.println("\n===== DETALLES DEL EMPLEADO =====");
        System.out.println(empleado);
        
        // Mostrar asignaciones asociadas
        List<Assignment> asignacionesEmpleado = new ArrayList<>();
        for (Quotation q : quotations) {
            for (Assignment a : q.getAssignments()) {
                if (a.getWorker().getId().equals(empleado.getId())) {
                    asignacionesEmpleado.add(a);
                }
            }
        }
        
        if (!asignacionesEmpleado.isEmpty()) {
            System.out.println("\nAsignaciones asociadas:");
            for (int i = 0; i < asignacionesEmpleado.size(); i++) {
                Assignment a = asignacionesEmpleado.get(i);
                System.out.println((i + 1) + ". " + a.getTitle() + " - Cotización: " + a.getQuotation().getTitle());
            }
        } else {
            System.out.println("\nEste empleado no tiene asignaciones asociadas.");
        }
    }
    
    // ===== GESTIÓN DE COTIZACIONES =====
    
    private void gestionarCotizaciones() {
        boolean volver = false;
        
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE COTIZACIONES =====");
            System.out.println("1. Listar Cotizaciones");
            System.out.println("2. Crear Cotización");
            System.out.println("3. Ver Detalles de Cotización");
            System.out.println("4. Agregar Asignación a Cotización");
            System.out.println("5. Agregar Adjunto a Cotización");
            System.out.println("6. Finalizar Cotización");
            System.out.println("0. Volver al Menú Principal");
            System.out.print("Seleccione una opción: ");
            
            int opcion = leerOpcion();
            
            switch (opcion) {
                case 1 -> listarCotizaciones();
                case 2 -> crearCotizacion();
                case 3 -> verDetallesCotizacion();
                case 4 -> agregarAsignacion();
                case 5 -> agregarAdjunto();
                case 6 -> finalizarCotizacion();
                case 0 -> volver = true;
                default -> System.out.println("Opción no válida. Intente nuevamente.");
            }
        }
    }
    
    private void listarCotizaciones() {
        System.out.println("\n===== LISTA DE COTIZACIONES =====");
        if (quotations.isEmpty()) {
            System.out.println("No hay cotizaciones registradas.");
            return;
        }
        
        for (int i = 0; i < quotations.size(); i++) {
            Quotation quotation = quotations.get(i);
            System.out.println((i + 1) + ". " + quotation.getTitle() + " - Cliente: " + 
                              quotation.getClient().getName() + " - Estado: " + quotation.getStatus());
        }
    }
    
    private void crearCotizacion() {
        if (clients.isEmpty()) {
            System.out.println("No hay clientes registrados. Debe crear al menos un cliente primero.");
            return;
        }
        
        System.out.println("\n===== CREAR NUEVA COTIZACIÓN =====");
        
        // Seleccionar cliente
        listarClientes();
        System.out.print("\nSeleccione el número de cliente para la cotización: ");
        int indiceCliente = leerOpcion() - 1;
        
        if (indiceCliente < 0 || indiceCliente >= clients.size()) {
            System.out.println("Índice de cliente no válido. Operación cancelada.");
            return;
        }
        
        Client cliente = clients.get(indiceCliente);
        
        // Ingresar datos de la cotización
        System.out.print("Título de la cotización: ");
        String titulo = scanner.nextLine();
        
        System.out.print("Descripción (opcional): ");
        String descripcion = scanner.nextLine();
        
        // Fechas tentativas
        Date fechaInicio = null;
        while (fechaInicio == null) {
            System.out.print("Fecha de inicio tentativa (dd/MM/yyyy): ");
            String fechaStr = scanner.nextLine();
            try {
                fechaInicio = dateFormat.parse(fechaStr);
            } catch (ParseException e) {
                System.out.println("Formato de fecha incorrecto. Use dd/MM/yyyy.");
            }
        }
        
        Date fechaFin = null;
        while (fechaFin == null) {
            System.out.print("Fecha de finalización tentativa (dd/MM/yyyy): ");
            String fechaStr = scanner.nextLine();
            try {
                fechaFin = dateFormat.parse(fechaStr);
                if (fechaFin.before(fechaInicio)) {
                    System.out.println("La fecha de finalización debe ser posterior a la fecha de inicio.");
                    fechaFin = null;
                }
            } catch (ParseException e) {
                System.out.println("Formato de fecha incorrecto. Use dd/MM/yyyy.");
            }
        }
        
        // Crear la cotización
        Quotation nuevaCotizacion = new Quotation(UUID.randomUUID(), cliente, fechaInicio, fechaFin, titulo);
        if (!descripcion.isEmpty()) {
            nuevaCotizacion.setDescription(descripcion);
        }
        
        quotations.add(nuevaCotizacion);
        System.out.println("Cotización creada exitosamente.");
    }
    
    private void verDetallesCotizacion() {
        listarCotizaciones();
        
        if (quotations.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de cotización para ver detalles (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= quotations.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        Quotation cotizacion = quotations.get(indice);
        
        System.out.println("\n===== DETALLES DE LA COTIZACIÓN =====");
        System.out.println(cotizacion);
        
        // Mostrar asignaciones
        List<Assignment> asignaciones = cotizacion.getAssignments();
        if (!asignaciones.isEmpty()) {
            System.out.println("\nAsignaciones:");
            for (int i = 0; i < asignaciones.size(); i++) {
                Assignment a = asignaciones.get(i);
                System.out.println("\n" + (i + 1) + ". " + a.getTitle());
                System.out.println("   Empleado: " + a.getWorker().getName());
                System.out.println("   Área: " + a.getArea());
                System.out.println("   Horas estimadas: " + a.getEstimatedHours());
                System.out.println("   Costo: $" + a.getTotalCost());
            }
        }
        
        // Mostrar adjuntos
        List<QuotationAttachment> adjuntos = cotizacion.getAttachments();
        if (!adjuntos.isEmpty()) {
            System.out.println("\nAdjuntos:");
            for (int i = 0; i < adjuntos.size(); i++) {
                QuotationAttachment a = adjuntos.get(i);
                System.out.println((i + 1) + ". " + a.getFileName() + " - " + a.getDescription());
            }
        }
    }
    
    private void agregarAsignacion() {
        if (quotations.isEmpty()) {
            System.out.println("No hay cotizaciones registradas. Debe crear al menos una cotización primero.");
            return;
        }
        
        if (employees.isEmpty()) {
            System.out.println("No hay empleados registrados. Debe crear al menos un empleado primero.");
            return;
        }
        
        // Seleccionar cotización
        listarCotizaciones();
        System.out.print("\nSeleccione el número de cotización para agregar asignación: ");
        int indiceCotizacion = leerOpcion() - 1;
        
        if (indiceCotizacion < 0 || indiceCotizacion >= quotations.size()) {
            System.out.println("Índice de cotización no válido. Operación cancelada.");
            return;
        }
        
        Quotation cotizacion = quotations.get(indiceCotizacion);
        
        if ("Finalizada".equals(cotizacion.getStatus())) {
            System.out.println("No se pueden agregar asignaciones a una cotización finalizada.");
            return;
        }
        
        // Seleccionar empleado
        listarEmpleados();
        System.out.print("\nSeleccione el número de empleado para la asignación: ");
        int indiceEmpleado = leerOpcion() - 1;
        
        if (indiceEmpleado < 0 || indiceEmpleado >= employees.size()) {
            System.out.println("Índice de empleado no válido. Operación cancelada.");
            return;
        }
        
        Employee empleado = employees.get(indiceEmpleado);
        
        // Ingresar datos de la asignación
        System.out.print("Título de la actividad: ");
        String titulo = scanner.nextLine();
        
        System.out.print("Área: ");
        String area = scanner.nextLine();
        
        BigDecimal tarifaHora = null;
        while (tarifaHora == null) {
            System.out.print("Tarifa por hora ($): ");
            try {
                tarifaHora = new BigDecimal(scanner.nextLine());
                if (tarifaHora.compareTo(BigDecimal.ZERO) <= 0) {
                    System.out.println("La tarifa debe ser mayor que cero.");
                    tarifaHora = null;
                }
            } catch (NumberFormatException e) {
                System.out.println("Ingrese un valor numérico válido.");
            }
        }
        
        // Fechas de la asignación
        Date fechaInicio = null;
        while (fechaInicio == null) {
            System.out.print("Fecha de inicio (dd/MM/yyyy): ");
            String fechaStr = scanner.nextLine();
            try {
                fechaInicio = dateFormat.parse(fechaStr);
                if (fechaInicio.before(cotizacion.getTentativeStartDate())) {
                    System.out.println("La fecha de inicio no puede ser anterior a la fecha tentativa de inicio de la cotización.");
                    fechaInicio = null;
                }
            } catch (ParseException e) {
                System.out.println("Formato de fecha incorrecto. Use dd/MM/yyyy.");
            }
        }
        
        Date fechaFin = null;
        while (fechaFin == null) {
            System.out.print("Fecha de finalización (dd/MM/yyyy): ");
            String fechaStr = scanner.nextLine();
            try {
                fechaFin = dateFormat.parse(fechaStr);
                if (fechaFin.before(fechaInicio)) {
                    System.out.println("La fecha de finalización debe ser posterior a la fecha de inicio.");
                    fechaFin = null;
                } else if (fechaFin.after(cotizacion.getTentativeEndDate())) {
                    System.out.println("La fecha de finalización no puede ser posterior a la fecha tentativa de finalización de la cotización.");
                    fechaFin = null;
                }
            } catch (ParseException e) {
                System.out.println("Formato de fecha incorrecto. Use dd/MM/yyyy.");
            }
        }
        
        int horasEstimadas = 0;
        boolean horasValidas = false;
        while (!horasValidas) {
            System.out.print("Horas estimadas: ");
            try {
                horasEstimadas = Integer.parseInt(scanner.nextLine());
                if (horasEstimadas <= 0) {
                    System.out.println("Las horas estimadas deben ser mayores que cero.");
                } else {
                    horasValidas = true;
                }
            } catch (NumberFormatException e) {
                System.out.println("Ingrese un valor numérico válido.");
            }
        }
        
        BigDecimal incrementoExtra = null;
        while (incrementoExtra == null) {
            System.out.print("Incremento extra (%): ");
            try {
                incrementoExtra = new BigDecimal(scanner.nextLine());
                if (incrementoExtra.compareTo(BigDecimal.ZERO) < 0) {
                    System.out.println("El incremento no puede ser negativo.");
                    incrementoExtra = null;
                }
            } catch (NumberFormatException e) {
                System.out.println("Ingrese un valor numérico válido.");
            }
        }
        
        // Crear la asignación
        Assignment nuevaAsignacion = new Assignment(
            UUID.randomUUID(), 
            cotizacion, 
            empleado, 
            area, 
            tarifaHora, 
            fechaInicio, 
            fechaFin, 
            horasEstimadas, 
            incrementoExtra,
            titulo
        );
        
        // Descripción y tareas
        System.out.print("Descripción de la actividad: ");
        String descripcion = scanner.nextLine();
        if (!descripcion.isEmpty()) {
            nuevaAsignacion.setTaskDescription(descripcion);
        }
        
        boolean agregarTareas = true;
        while (agregarTareas) {
            System.out.print("Agregar tarea (dejar en blanco para terminar): ");
            String tarea = scanner.nextLine();
            if (tarea.isEmpty()) {
                agregarTareas = false;
            } else {
                nuevaAsignacion.addTask(tarea);
            }
        }
        
        cotizacion.addAssignment(nuevaAsignacion);
        System.out.println("Asignación agregada exitosamente.");
        System.out.println("Costo total de la cotización actualizado: $" + cotizacion.getTotalCost());
    }
    
    private void agregarAdjunto() {
        if (quotations.isEmpty()) {
            System.out.println("No hay cotizaciones registradas. Debe crear al menos una cotización primero.");
            return;
        }
        
        // Seleccionar cotización
        listarCotizaciones();
        System.out.print("\nSeleccione el número de cotización para agregar adjunto: ");
        int indiceCotizacion = leerOpcion() - 1;
        
        if (indiceCotizacion < 0 || indiceCotizacion >= quotations.size()) {
            System.out.println("Índice de cotización no válido. Operación cancelada.");
            return;
        }
        
        Quotation cotizacion = quotations.get(indiceCotizacion);
        
        // Ingresar datos del adjunto
        System.out.print("Nombre del archivo: ");
        String nombreArchivo = scanner.nextLine();
        
        System.out.print("Ruta del archivo: ");
        String rutaArchivo = scanner.nextLine();
        
        System.out.print("Tipo de archivo (ej. application/pdf): ");
        String tipoArchivo = scanner.nextLine();
        
        long tamanoArchivo = 0;
        boolean tamanoValido = false;
        while (!tamanoValido) {
            System.out.print("Tamaño del archivo (KB): ");
            try {
                tamanoArchivo = Long.parseLong(scanner.nextLine()) * 1024; // Convertir KB a bytes
                if (tamanoArchivo <= 0) {
                    System.out.println("El tamaño debe ser mayor que cero.");
                } else {
                    tamanoValido = true;
                }
            } catch (NumberFormatException e) {
                System.out.println("Ingrese un valor numérico válido.");
            }
        }
        
        System.out.print("Descripción del adjunto: ");
        String descripcion = scanner.nextLine();
        
        // Crear el adjunto
        QuotationAttachment nuevoAdjunto = new QuotationAttachment(
            UUID.randomUUID(),
            cotizacion,
            nombreArchivo,
            rutaArchivo,
            tipoArchivo,
            tamanoArchivo,
            currentUser
        );
        
        if (!descripcion.isEmpty()) {
            nuevoAdjunto.setDescription(descripcion);
        }
        
        cotizacion.addAttachment(nuevoAdjunto);
        System.out.println("Adjunto agregado exitosamente.");
    }
    
    private void finalizarCotizacion() {
        listarCotizaciones();
        
        if (quotations.isEmpty()) {
            return;
        }
        
        System.out.print("\nSeleccione el número de cotización a finalizar (0 para cancelar): ");
        int indice = leerOpcion() - 1;
        
        if (indice < 0 || indice >= quotations.size()) {
            System.out.println("Operación cancelada o índice no válido.");
            return;
        }
        
        Quotation cotizacion = quotations.get(indice);
        
        if ("Finalizada".equals(cotizacion.getStatus())) {
            System.out.println("Esta cotización ya está finalizada.");
            return;
        }
        
        String resultado = cotizacion.finalizeQuotation();
        System.out.println(resultado);
    }
}

public class base {
    public static void main(String[] args) {
        // Ejemplo básico para mostrar funcionalidad
        User admin = new User(UUID.randomUUID(), "Administrador", "admin@email.com", "contraseña123", Role.ADMIN);
        
        Client cliente = new Client(UUID.randomUUID(), "Empresa X", "123456", "Jurídico", "123456789", "empresa@email.com", "Calle Falsa 123", admin);
        
        Employee empleado = new Employee(UUID.randomUUID(), "Juan Pérez", "654321", "Natural", "Permanente", "987654321", "juan@email.com", "Avenida Siempreviva", admin);

        Quotation cotizacion = new Quotation(UUID.randomUUID(), cliente, new Date(), new Date(), "Configuración de Infraestructura de Red");
        cotizacion.setDescription("Configuración completa de red para el nuevo edificio de oficinas");
        
        Assignment asignacion = new Assignment(
            UUID.randomUUID(), 
            cotizacion, 
            empleado, 
            "Redes", 
            new BigDecimal(10), 
            new Date(), 
            new Date(), 
            40, 
            new BigDecimal(10),
            "Configuración de Red"
        );
        
        asignacion.setTaskDescription("Configurar e instalar equipos de red");
        asignacion.addTask("Instalar router y switches");
        asignacion.addTask("Configurar firewall");
        asignacion.addTask("Configurar acceso VPN");
        asignacion.addTask("Probar conectividad de red");
        
        cotizacion.addAssignment(asignacion);
        
        QuotationAttachment adjunto = new QuotationAttachment(
            UUID.randomUUID(),
            cotizacion,
            "diagrama_red.pdf",
            "/adjuntos/diagrama_red.pdf",
            "application/pdf",
            1024 * 1024, 
            admin
        );
        adjunto.setDescription("Diagrama de red para la nueva oficina");
        cotizacion.addAttachment(adjunto);
        
        // Finalizar cotización
        String resultado = cotizacion.finalizeQuotation();
        
        // Imprimir información
        System.out.println("Cotización: " + cotizacion.getTitle());
        System.out.println("Estado: " + cotizacion.getStatus());
        System.out.println("Costo Total: $" + cotizacion.getTotalCost());
        System.out.println("\nAsignaciones:");
        
        for (Assignment a : cotizacion.getAssignments()) {
            System.out.println("- " + a.getTitle() + " (" + a.getEstimatedHours() + " horas)");
            System.out.println("  Descripción: " + a.getTaskDescription());
            System.out.println("  Tareas:");
            for (String tarea : a.getTaskList()) {
                System.out.println("    * " + tarea);
            }
        }
        
        System.out.println("\nAdjuntos:");
        for (QuotationAttachment att : cotizacion.getAttachments()) {
            System.out.println("- " + att.getFileName());
        }
        
        System.out.println("\nResultado: " + resultado);
        
        // Iniciar el sistema de gestión por consola
        System.out.println("\n\n===== INICIANDO SISTEMA DE GESTIÓN =====");
        System.out.println("Presione Enter para continuar...");
        new Scanner(System.in).nextLine();
        
        SistemaGestion sistema = new SistemaGestion();
        sistema.iniciar();
    }
}
