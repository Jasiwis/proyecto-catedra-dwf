# Punto Evento - Sistema de Gestión de Eventos

Sistema completo de gestión de eventos desarrollado como proyecto de cátedra. Incluye un backend en Spring Boot y un frontend en React con TypeScript.

## Estructura del Proyecto

```
punto-evento/
├── punto-evento-api/          # Backend - Spring Boot API
└── punto-evento-frontend/     # Frontend - React + TypeScript
```

## Tecnologías Utilizadas

### Backend (punto-evento-api)
- **Spring Boot 3.4.0** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **PostgreSQL** - Base de datos
- **JWT** - Tokens de autenticación
- **Maven** - Gestión de dependencias

### Frontend (punto-evento-frontend)
- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Ant Design** - Biblioteca de componentes UI
- **Material-UI** - Componentes adicionales
- **Tailwind CSS** - Framework de CSS
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Framer Motion** - Animaciones

## Características del Sistema

- **Autenticación JWT** - Sistema de login seguro
- **Gestión de Usuarios** - Registro y autenticación
- **Gestión de Clientes** - CRUD de clientes
- **Gestión de Empleados** - Administración de personal
- **Gestión de Tareas** - Asignación y seguimiento
- **Gestión de Cotizaciones** - Procesos de cotización
- **Gestión de Asignaciones** - Asignación de tareas a empleados

## Configuración del Proyecto

### Prerrequisitos
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.6+

### Backend (API)
1. Navegar al directorio `punto-evento-api`
2. Copiar el archivo de configuración: `cp .env.example .env`
3. Configurar las variables de entorno en `.env` según sea necesario
4. Ejecutar: `mvn spring-boot:run`

### Frontend
1. Navegar al directorio `punto-evento-frontend`
2. Instalar dependencias: `npm install`
3. Ejecutar en modo desarrollo: `npm run dev`

## Base de Datos

El proyecto incluye un archivo SQL dump en `punto-evento-api/sql/dump.sql` para inicializar la base de datos.

### Configuración de Docker
```bash
cd punto-evento-api
docker-compose up -d
```

### Variables de Entorno

El proyecto utiliza variables de entorno para la configuración. Copia `.env.example` a `.env` y ajusta los valores según tu entorno:

```bash
# Database Configuration
POSTGRES_DB=punto_evento_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret123
POSTGRES_PORT=5432

# Application Configuration
SPRING_APPLICATION_NAME=punto-evento-api
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/punto_evento_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=secret123

# JWT Configuration
JWT_SECRET=2B4D8F39A2F3C47197D55836C76C441A1B5D2E58E8ACF16C3E0A2F5B6F9D1A32
JWT_EXPIRATION=86400000
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/{id}` - Actualizar cliente
- `DELETE /api/clients/{id}` - Eliminar cliente

### Empleados
- `GET /api/employees` - Listar empleados
- `POST /api/employees` - Crear empleado
- `PUT /api/employees/{id}` - Actualizar empleado
- `DELETE /api/employees/{id}` - Eliminar empleado

### Tareas
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/{id}` - Actualizar tarea
- `DELETE /api/tasks/{id}` - Eliminar tarea

### Cotizaciones
- `GET /api/quotes` - Listar cotizaciones
- `POST /api/quotes` - Crear cotización
- `PUT /api/quotes/{id}` - Actualizar cotización
- `DELETE /api/quotes/{id}` - Eliminar cotización

### Asignaciones
- `GET /api/assignments` - Listar asignaciones
- `POST /api/assignments` - Crear asignación
- `PUT /api/assignments/{id}` - Actualizar asignación
- `DELETE /api/assignments/{id}` - Eliminar asignación

## Desarrollo

### Estructura de Paquetes (Backend)
```
sv.udb.puntoeventoapi/
├── auth/           # Autenticación
├── client/         # Gestión de clientes
├── employee/       # Gestión de empleados
├── task/           # Gestión de tareas
├── quote/          # Gestión de cotizaciones
├── assignment/     # Gestión de asignaciones
├── entity/         # Entidades JPA
├── repository/     # Repositorios de datos
├── config/         # Configuraciones
└── common/         # Utilidades comunes
```

### Estructura de Componentes (Frontend)
```
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas de la aplicación
├── api/            # Servicios de API
├── interfaces/     # Tipos TypeScript
├── context/        # Contextos de React
├── hooks/          # Custom hooks
├── utils/          # Utilidades
└── router/         # Configuración de rutas
```

## Contribución

Este es un proyecto académico desarrollado como parte de una cátedra universitaria.

## Licencia

Proyecto académico - Uso educativo únicamente.
