# Guía de Estructura de Módulos - Punto Evento

## Estructura Reorganizada (Slice Architecture)

La aplicación ahora sigue una arquitectura de slice completa, donde cada módulo de negocio contiene todos sus elementos relacionados.

### Estructura General

```
src/main/java/sv/udb/puntoeventoapi/
├── config/                           # Configuraciones globales
│   ├── DataLoader.java              # Seeds y datos iniciales
│   ├── SecurityConfig.java          # Configuración de seguridad
│   ├── jwt/                         # Configuración JWT
│   └── security/                    # Configuración de autenticación
├── modules/                         # Módulos de negocio
│   ├── assignment/                  # Módulo de Asignaciones
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/                  # Assignment.java
│   │   ├── repository/              # AssignmentRepository.java
│   │   └── service/
│   ├── auth/                        # Módulo de Autenticación
│   │   ├── controller/
│   │   ├── dto/
│   │   └── service/
│   ├── client/                      # Módulo de Clientes
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/                  # Client.java
│   │   ├── repository/              # ClientRepository.java
│   │   └── service/
│   ├── commons/                     # Elementos compartidos
│   │   ├── annotations/             # Anotaciones personalizadas
│   │   ├── enums/                   # Enumeraciones globales
│   │   ├── exceptions/              # Excepciones personalizadas
│   │   ├── ApiResponse.java         # Respuestas API estándar
│   │   ├── ApiResponseUtil.java     # Utilidades de respuesta
│   │   └── GlobalExceptionHandler.java
│   ├── employee/                    # Módulo de Empleados
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/                  # Employee.java
│   │   ├── repository/              # EmployeeRepository.java
│   │   └── service/
│   ├── quote/                       # Módulo de Cotizaciones
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/                  # Quote.java
│   │   ├── repository/              # QuoteRepository.java
│   │   └── service/
│   ├── task/                        # Módulo de Tareas
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/                  # Task.java
│   │   ├── repository/              # TaskRepository.java
│   │   └── service/
│   └── user/                        # Módulo de Usuarios
│       ├── controller/
│       ├── dto/
│       ├── entity/                  # User.java
│       ├── repository/              # UserRepository.java
│       └── service/
└── PuntoEventoApiApplication.java   # Clase principal de la aplicación
```

## Principios de la Arquitectura de Slice

### 1. **Encapsulación por Módulo**
Cada módulo de negocio contiene:
- **Entity**: Entidad JPA correspondiente
- **Repository**: Repositorio de acceso a datos
- **Service**: Lógica de negocio
- **Controller**: Endpoints REST
- **DTOs**: Objetos de transferencia de datos

### 2. **Elementos Comunes**
La carpeta `commons` contiene únicamente:
- **Enums**: Enumeraciones compartidas entre módulos
- **Excepciones**: Excepciones personalizadas globales
- **Utilidades**: Clases de utilidad para respuestas API
- **Anotaciones**: Anotaciones personalizadas
- **Manejo de Excepciones**: Handler global

### 3. **Separación de Responsabilidades**
- **Config**: Configuraciones globales (seguridad, JWT, datos iniciales)
- **Modules**: Módulos de negocio independientes
- **Commons**: Elementos realmente compartidos

## Beneficios de esta Estructura

### ✅ **Mantenibilidad**
- Cada módulo es independiente
- Fácil localización de código relacionado
- Cambios aislados por módulo

### ✅ **Escalabilidad**
- Nuevos módulos siguen el mismo patrón
- Fácil agregar nuevas funcionalidades
- Estructura predecible

### ✅ **Legibilidad**
- Código organizado por dominio de negocio
- Estructura consistente en todos los módulos
- Fácil navegación del código

### ✅ **Testabilidad**
- Cada módulo puede ser testeado independientemente
- Dependencias claras y explícitas
- Mocking más sencillo

## Reglas de Organización

### 📁 **Por Módulo de Negocio**
```
assignment/     → Todo relacionado con asignaciones
auth/          → Todo relacionado con autenticación
client/        → Todo relacionado con clientes
employee/      → Todo relacionado con empleados
quote/         → Todo relacionado con cotizaciones
task/          → Todo relacionado con tareas
user/          → Todo relacionado con usuarios
```

### 📁 **Por Tipo de Componente**
```
controller/    → Controladores REST
dto/          → Data Transfer Objects
entity/       → Entidades JPA
repository/   → Repositorios de datos
service/      → Lógica de negocio
```

### 📁 **Commons - Solo Elementos Verdaderamente Compartidos**
```
annotations/  → Anotaciones personalizadas
enums/        → Enumeraciones globales
exceptions/   → Excepciones personalizadas
```

## Importaciones Actualizadas

Todas las importaciones han sido actualizadas para reflejar la nueva estructura:

### Antes:
```java
import sv.udb.puntoeventoapi.modules.commons.entity.User;
import sv.udb.puntoeventoapi.modules.commons.repository.UserRepository;
```

### Después:
```java
import sv.udb.puntoeventoapi.modules.user.entity.User;
import sv.udb.puntoeventoapi.modules.user.repository.UserRepository;
```

## Módulos Implementados

### 🔐 **Auth Module**
- Autenticación y autorización
- Login/Register
- Gestión de tokens JWT

### 👤 **User Module**
- Gestión de usuarios
- Roles y permisos
- CRUD completo de usuarios

### 👥 **Client Module**
- Gestión de clientes
- Validaciones de documentos
- Estados activo/inactivo

### 👨‍💼 **Employee Module**
- Gestión de empleados
- Tipos de contrato
- Estados de empleado

### 📋 **Quote Module**
- Gestión de cotizaciones
- Estados de cotización
- Relaciones con clientes

### 📝 **Assignment Module**
- Gestión de asignaciones
- Relaciones con cotizaciones
- Estados de asignación

### ✅ **Task Module**
- Gestión de tareas
- Relaciones con asignaciones
- Estados de tareas

## Configuración de Spring

La aplicación principal está configurada para escanear todos los paquetes:

```java
@SpringBootApplication(scanBasePackages = "sv.udb.puntoeventoapi")
public class PuntoEventoApiApplication {
    // ...
}
```

## Próximos Pasos

1. **Agregar nuevos módulos** siguiendo la misma estructura
2. **Implementar tests unitarios** por módulo
3. **Documentar APIs** de cada módulo
4. **Considerar agregar eventos** entre módulos si es necesario
5. **Implementar validaciones** específicas por módulo

Esta estructura proporciona una base sólida y escalable para el crecimiento futuro de la aplicación.
