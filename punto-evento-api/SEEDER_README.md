# 🌱 Seeder de Datos - Punto Evento

## Descripción

El sistema incluye un seeder automático que inserta datos iniciales en la base de datos al iniciar la aplicación. Esto permite tener datos de prueba y un usuario administrador por defecto.

## Configuración

### Habilitar/Deshabilitar el Seeder

El seeder se puede controlar mediante la propiedad `app.seeder.enabled` en `application.properties`:

```properties
# Habilitar seeder (por defecto: true)
app.seeder.enabled=true

# Deshabilitar seeder
app.seeder.enabled=false
```

### Variables de Entorno

También se puede controlar mediante variables de entorno:

```bash
# Habilitar seeder
export APP_SEEDER_ENABLED=true

# Deshabilitar seeder
export APP_SEEDER_ENABLED=false
```

## Datos Creados

### 👑 Usuarios Administradores

| Email | Contraseña | Tipo | Descripción |
|-------|------------|------|-------------|
| `admin@puntoevento.com` | `admin123` | ADMIN | Administrador principal del sistema |

### 👨‍💼 Usuarios Empleados

| Email | Contraseña | Tipo | Descripción |
|-------|------------|------|-------------|
| `empleado@puntoevento.com` | `empleado123` | EMPLOYEE | Usuario empleado de ejemplo |

### 👤 Clientes de Ejemplo (con Usuarios)

| Nombre | Documento | Tipo | Teléfono | Email | Contraseña |
|--------|-----------|------|----------|-------|------------|
| Juan Pérez González | 12345678-9 | Natural | +503 1234-5678 | juan.perez@email.com | cliente123 |
| Empresa Ejemplo S.A. de C.V. | 0614-123456-001-7 | Jurídica | +503 2234-5678 | contacto@empresaejemplo.com | empresa123 |
| María Rodríguez | 87654321-0 | Natural | +503 3234-5678 | maria.rodriguez@email.com | maria123 |

### 👨‍💼 Empleados de Ejemplo (con Usuarios)

| Nombre | Documento | Contrato | Teléfono | Email | Contraseña |
|--------|-----------|----------|----------|-------|------------|
| Carlos Mendoza | 11111111-1 | Permanente | +503 4234-5678 | carlos.mendoza@puntoevento.com | carlos123 |
| Ana López | 22222222-2 | Por Horas | +503 5234-5678 | ana.lopez@puntoevento.com | ana123 |
| Roberto Silva | 33333333-3 | Permanente | +503 6234-5678 | roberto.silva@puntoevento.com | roberto123 |

## Comportamiento del Seeder

### ✅ Características

- **Idempotente**: Se puede ejecutar múltiples veces sin duplicar datos
- **Verificación de existencia**: Solo crea registros si no existen
- **Transaccional**: Todos los datos se crean en una sola transacción
- **Logging detallado**: Registra cada operación realizada

### 🔄 Proceso de Ejecución

1. **Verificación de usuarios**: Busca usuarios existentes por email
2. **Creación de admin**: Crea el usuario administrador si no existe
3. **Creación de empleado**: Crea el usuario empleado si no existe
4. **Creación de clientes**: Crea clientes de ejemplo si no existen
5. **Creación de empleados**: Crea empleados de ejemplo si no existen

### 📝 Logs del Seeder

El seeder genera logs informativos con emojis para fácil identificación:

```
🌱 Iniciando seeder de datos...
👑 Usuario administrador creado: admin@puntoevento.com (uuid-here)
👨‍💼 Usuario empleado creado: empleado@puntoevento.com (uuid-here)
👤 Cliente natural creado: Juan Pérez González - 12345678-9
🏢 Cliente jurídico creado: Empresa Ejemplo S.A. de C.V. - 0614-123456-001-7
👤 Cliente adicional creado: María Rodríguez - 87654321-0
👨‍💼 Empleado permanente creado: Carlos Mendoza - 11111111-1
👩‍💼 Empleada por horas creada: Ana López - 22222222-2
👨‍💼 Empleado adicional creado: Roberto Silva - 33333333-3
✅ Seeder de datos completado exitosamente
```

## Uso en Desarrollo

### 🚀 Inicio Rápido

1. **Configurar base de datos**:
   ```bash
   docker-compose up -d postgres
   ```

2. **Ejecutar aplicación**:
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Verificar datos**:
   - Usar credenciales de admin para login
   - Verificar que existen clientes y empleados de ejemplo

### 🔧 Personalización

Para agregar más datos de ejemplo:

1. **Editar `DataSeeder.java`**:
   ```java
   private void createMoreSampleData() {
       // Agregar lógica para crear más datos
   }
   ```

2. **Llamar en el método `run()`**:
   ```java
   @Override
   @Transactional
   public void run(String... args) throws Exception {
       // ... código existente
       createMoreSampleData();
   }
   ```

## Uso en Producción

### ⚠️ Consideraciones

- **Deshabilitar en producción**: Establecer `app.seeder.enabled=false`
- **Datos sensibles**: No incluir datos reales de clientes
- **Contraseñas**: Cambiar contraseñas por defecto antes de producción

### 🛡️ Seguridad

- Las contraseñas se almacenan hasheadas con BCrypt
- Solo se crean datos si no existen previamente
- No sobrescribe datos existentes

## Troubleshooting

### ❌ Problemas Comunes

1. **Seeder no se ejecuta**:
   - Verificar que `app.seeder.enabled=true`
   - Revisar logs de la aplicación

2. **Errores de duplicación**:
   - El seeder verifica existencia, no debería ocurrir
   - Revisar logs para identificar el problema

3. **Datos no aparecen**:
   - Verificar conexión a base de datos
   - Revisar logs de transacciones

### 🔍 Debugging

Para debugging detallado, agregar logs adicionales:

```java
log.debug("Verificando existencia de usuario: {}", email);
log.debug("Creando nuevo usuario con datos: {}", userData);
```

## Extensión del Seeder

### 📊 Agregar Nuevos Módulos

Para agregar datos de otros módulos (quotes, tasks, etc.):

1. **Inyectar repositorios necesarios**:
   ```java
   private final QuoteRepository quoteRepository;
   private final TaskRepository taskRepository;
   ```

2. **Crear métodos de seeding**:
   ```java
   private void createSampleQuotes(User admin) {
       // Lógica para crear cotizaciones de ejemplo
   }
   ```

3. **Llamar en el método principal**:
   ```java
   createSampleQuotes(admin);
   ```

El seeder está diseñado para ser extensible y fácil de mantener.
