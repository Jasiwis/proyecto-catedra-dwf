# 🔐 Verificar Rol de Usuario en la Base de Datos

## Problema Resuelto

**El error 403 Forbidden** se debía a que el `JwtAuthenticationFilter` no estaba configurando correctamente las **authorities (roles)** del usuario autenticado.

### ✅ Corrección Aplicada

**Archivo:** `JwtAuthenticationFilter.java`

```java
// ❌ ANTES (Sin roles - causaba 403):
var auth = new UsernamePasswordAuthenticationToken(
    user, null, null  // No authorities!
);

// ✅ AHORA (Con roles correctos):
SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getUserType().name());
var auth = new UsernamePasswordAuthenticationToken(
    user, 
    null, 
    Collections.singletonList(authority)  // Roles incluidos!
);
```

---

## 📋 Verificar tu Usuario en PostgreSQL

### Opción 1: Usando psql (Terminal)

```bash
# Conectar a la base de datos
psql -U postgres -d punto_evento_db

# Ver todos los usuarios
SELECT id, name, email, user_type, active FROM users;

# Ver tu usuario específico (reemplaza con tu email)
SELECT id, name, email, user_type, active 
FROM users 
WHERE email = 'tu_email@ejemplo.com';
```

### Opción 2: Usando DBeaver, pgAdmin o cualquier cliente SQL

```sql
-- Ver todos los usuarios
SELECT 
    id, 
    name, 
    email, 
    user_type, 
    active,
    created_at,
    updated_at
FROM users
ORDER BY created_at DESC;

-- Ver solo administradores
SELECT * FROM users WHERE user_type = 'ADMIN';

-- Ver solo empleados
SELECT * FROM users WHERE user_type = 'EMPLOYEE';

-- Ver solo clientes
SELECT * FROM users WHERE user_type = 'CLIENT';
```

### Opción 3: Desde Docker

```bash
# Listar contenedores
docker ps

# Conectar al contenedor de PostgreSQL
docker exec -it punto-evento-db psql -U postgres -d punto_evento_db

# Ejecutar consultas
SELECT * FROM users;
```

---

## 🔧 Cambiar el Rol de un Usuario

Si necesitas cambiar el rol de un usuario existente a ADMIN:

```sql
-- Actualizar usuario a ADMIN (reemplaza con tu email)
UPDATE users 
SET user_type = 'ADMIN', 
    updated_at = NOW()::TEXT
WHERE email = 'tu_email@ejemplo.com';

-- Verificar el cambio
SELECT id, name, email, user_type, active FROM users WHERE email = 'tu_email@ejemplo.com';
```

---

## 📊 Roles Disponibles en el Sistema

| Enum en Java | Valor en DB | Authority en Spring | Descripción |
|--------------|-------------|-------------------|-------------|
| `UserType.ADMIN` | `ADMIN` | `ROLE_ADMIN` | Administrador del sistema |
| `UserType.EMPLOYEE` | `EMPLOYEE` | `ROLE_EMPLOYEE` | Empleado |
| `UserType.CLIENT` | `CLIENT` | `ROLE_CLIENT` | Cliente |

---

## 🚀 Probar el Acceso

### 1. Iniciar sesión y obtener el token

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu_email@ejemplo.com",
    "password": "tu_password"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "userType": "ADMIN",
      "active": true
    }
  }
}
```

### 2. Acceder al endpoint de usuarios con el token

```bash
# Reemplaza YOUR_TOKEN con el token obtenido
curl -X GET http://localhost:8080/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Si eres ADMIN, deberías obtener:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "...",
      "email": "...",
      "userType": "ADMIN",
      "active": true
    },
    ...
  ]
}
```

**Si NO eres ADMIN, obtendrás:**
```json
{
  "success": false,
  "message": "No autorizado",
  "errors": [
    {
      "field": "authorization",
      "message": "No autorizado"
    }
  ]
}
```

---

## 🐛 Solución de Problemas

### Problema: "Aún da 403 después de los cambios"

**Posibles causas:**

1. **El backend no se ha reiniciado:**
   ```bash
   # Detener el backend
   # Compilar de nuevo
   cd punto-evento-api
   ./mvnw clean compile
   # Iniciar de nuevo
   ./mvnw spring-boot:run
   ```

2. **Token antiguo en el frontend:**
   - Cierra sesión en el frontend
   - Inicia sesión de nuevo para obtener un nuevo token con las authorities correctas

3. **Usuario no es ADMIN:**
   ```sql
   -- Verificar el rol
   SELECT email, user_type FROM users WHERE email = 'tu_email@ejemplo.com';
   
   -- Si no es ADMIN, actualizarlo
   UPDATE users SET user_type = 'ADMIN' WHERE email = 'tu_email@ejemplo.com';
   ```

4. **Base de datos no actualizada:**
   ```bash
   # Recrear la base de datos con el dump.sql actualizado
   psql -U postgres -d punto_evento_db < sql/dump.sql
   ```

---

## ✅ Verificación Final

Una vez aplicados los cambios y reiniciado el backend:

1. ✅ El `JwtAuthenticationFilter` incluye las authorities (ROLE_ADMIN, etc.)
2. ✅ El `SecurityConfig` requiere `hasRole("ADMIN")` para `/users/**`
3. ✅ Tu usuario en la BD tiene `user_type = 'ADMIN'`
4. ✅ Has cerrado sesión y vuelto a iniciar sesión
5. ✅ El nuevo token incluye las authorities correctas

**¡Ahora deberías poder acceder a la gestión de usuarios sin problemas! 🎉**

