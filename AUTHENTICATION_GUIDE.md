# Guía del Sistema de Autenticación - Punto Evento

## Resumen de Cambios Implementados

Se ha implementado un sistema completo de autenticación con gestión de usuarios basado en roles. La aplicación ahora sigue una arquitectura de slice (modular) en el backend y incluye funcionalidades de administración de usuarios en el frontend.

## Estructura del Backend (Slice Architecture)

### Nueva Estructura de Paquetes
```
src/main/java/sv/udb/puntoeventoapi/
├── config/                    # Configuraciones globales
├── modules/                   # Módulos de negocio
│   ├── auth/                 # Autenticación y autorización
│   ├── user/                 # Gestión de usuarios (nuevo)
│   ├── client/               # Gestión de clientes
│   ├── employee/             # Gestión de empleados
│   ├── assignment/           # Gestión de asignaciones
│   ├── quote/                # Gestión de cotizaciones
│   ├── task/                 # Gestión de tareas
│   └── commons/              # Elementos compartidos
│       ├── common/           # Utilidades comunes
│       ├── entity/           # Entidades JPA
│       ├── enums/            # Enumeraciones
│       └── repository/       # Repositorios JPA
└── PuntoEventoApiApplication.java
```

## Tipos de Usuario

El sistema maneja tres tipos de usuarios:

### 1. ADMIN
- **Acceso completo** a todas las funcionalidades
- Puede **gestionar usuarios** (crear, editar, eliminar, desactivar)
- Acceso a todas las rutas administrativas

### 2. EMPLOYEE  
- Acceso a funcionalidades operativas
- Puede gestionar clientes, cotizaciones, tareas
- **No puede** gestionar usuarios

### 3. CLIENT
- Acceso limitado a funcionalidades básicas
- Puede ver sus propias cotizaciones y asignaciones
- **No puede** acceder a funciones administrativas

## Usuario Administrador por Defecto

Al iniciar la aplicación, se crea automáticamente un usuario administrador:

- **Email:** admin@puntoevento.com
- **Contraseña:** admin123
- **Tipo:** ADMIN
- **Estado:** Activo

## Endpoints de Autenticación

### Públicos (Sin autenticación)
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar nuevo cliente

### Protegidos (Requieren autenticación)
- `GET /auth/me` - Obtener información del usuario actual

### Solo Administradores
- `GET /users` - Listar todos los usuarios (con paginación)
- `GET /users/type/{userType}` - Listar usuarios por tipo
- `GET /users/{id}` - Obtener usuario por ID
- `GET /users/email/{email}` - Obtener usuario por email
- `POST /users` - Crear nuevo usuario
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario
- `PATCH /users/{id}/deactivate` - Desactivar usuario

## Funcionalidades del Frontend

### 1. Gestión de Usuarios (Solo Administradores)
- **Ubicación:** `/dashboard/users`
- **Funcionalidades:**
  - Ver lista de todos los usuarios
  - Filtrar por tipo de usuario
  - Crear nuevos usuarios
  - Editar usuarios existentes
  - Eliminar usuarios
  - Desactivar usuarios
  - Ver información detallada de cada usuario

### 2. Dashboard Mejorado
- Muestra información del usuario actual
- Incluye tipo de usuario y estado
- Acceso condicional a funciones según el rol

### 3. Navegación Basada en Roles
- El menú de navegación se adapta según el tipo de usuario
- Los administradores ven el enlace "Usuarios"
- Otros usuarios no ven funciones administrativas

### 4. Protección de Rutas
- Rutas protegidas por autenticación
- Rutas protegidas por roles específicos
- Redirección automática según permisos

## Registro de Usuarios

### Desde el Frontend Público
- Solo se pueden registrar **CLIENTs**
- El tipo de usuario se asigna automáticamente
- Requiere validación de email único

### Desde el Panel de Administración
- Los **ADMINs** pueden crear cualquier tipo de usuario
- Control completo sobre todos los campos
- Validaciones de integridad de datos

## Seguridad

### Autenticación
- JWT (JSON Web Tokens) para sesiones
- Tokens almacenados en localStorage
- Validación automática de tokens

### Autorización
- Roles basados en `UserType` enum
- Protección a nivel de endpoint y componente
- Validación de permisos en tiempo real

### Validaciones
- Emails únicos en todo el sistema
- Contraseñas con mínimo 6 caracteres
- Validación de campos obligatorios
- Sanitización de entrada de datos

## Base de Datos

### Cambios en la Tabla Users
```sql
CREATE TABLE users (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    user_type  user_type_enum NOT NULL DEFAULT 'CLIENT',
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TEXT,
    updated_at TEXT
);

CREATE TYPE user_type_enum AS ENUM ('ADMIN', 'EMPLOYEE', 'CLIENT');
```

### Usuario Admin por Defecto
```sql
INSERT INTO users (name, email, password, user_type, active, created_at, updated_at) 
VALUES (
    'Administrador', 
    'admin@puntoevento.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'ADMIN', 
    true, 
    '2024-01-01 00:00:00', 
    '2024-01-01 00:00:00'
);
```

## Instrucciones de Uso

### Para Administradores

1. **Iniciar Sesión:**
   - Usar: admin@puntoevento.com / admin123

2. **Gestionar Usuarios:**
   - Ir a "Usuarios" en el menú de navegación
   - Crear empleados y otros administradores
   - Asignar tipos de usuario apropiados

3. **Crear Empleados:**
   - Usar el formulario de creación de usuarios
   - Seleccionar tipo "Empleado"
   - Establecer credenciales seguras

### Para Empleados

1. **Acceso:**
   - Usar credenciales proporcionadas por el administrador
   - Acceso a funciones operativas del sistema

### Para Clientes

1. **Registro:**
   - Usar el formulario de registro público
   - Solo se pueden registrar como clientes

2. **Acceso:**
   - Funcionalidades limitadas según el diseño del negocio

## Notas Técnicas

### Backend
- Arquitectura modular con slice architecture
- Separación clara de responsabilidades
- Configuración de seguridad actualizada
- Seeds automáticos para usuario admin

### Frontend
- Hooks personalizados para gestión de roles
- Componentes reutilizables
- Protección de rutas basada en roles
- Interfaz adaptativa según permisos

### Base de Datos
- Enums para tipos de usuario
- Índices optimizados
- Datos de prueba incluidos

## Próximos Pasos Recomendados

1. **Configurar HTTPS** en producción
2. **Implementar recuperación de contraseñas**
3. **Agregar logs de auditoría** para acciones administrativas
4. **Implementar notificaciones** por email
5. **Agregar tests unitarios** para el sistema de autenticación
6. **Configurar políticas de contraseñas** más estrictas
