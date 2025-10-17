# 🔐 Credenciales de Prueba - Punto Evento

## 📋 Resumen de Usuarios de Prueba

Este documento contiene todas las credenciales de los usuarios creados automáticamente por el seeder para facilitar las pruebas del sistema.

---

## 👑 **USUARIOS ADMINISTRADORES**

### 🔧 Administrador Principal
| Campo | Valor |
|-------|-------|
| **Email** | `admin@puntoevento.com` |
| **Contraseña** | `admin123` |
| **Tipo** | ADMIN |
| **Descripción** | Administrador principal del sistema con acceso completo |
| **Permisos** | Gestión de usuarios, clientes, empleados, cotizaciones, etc. |

---

## 👨‍💼 **USUARIOS EMPLEADOS**

### 🏢 Empleado Genérico
| Campo | Valor |
|-------|-------|
| **Email** | `empleado@puntoevento.com` |
| **Contraseña** | `empleado123` |
| **Tipo** | EMPLOYEE |
| **Descripción** | Usuario empleado genérico para pruebas |
| **Permisos** | Acceso limitado según configuración de roles |

### 👨‍💼 Carlos Mendoza
| Campo | Valor |
|-------|-------|
| **Email** | `carlos.mendoza@puntoevento.com` |
| **Contraseña** | `carlos123` |
| **Tipo** | EMPLOYEE |
| **Documento** | 11111111-1 |
| **Contrato** | Permanente |
| **Teléfono** | +503 4234-5678 |
| **Descripción** | Empleado permanente con usuario asociado |

### 👩‍💼 Ana López
| Campo | Valor |
|-------|-------|
| **Email** | `ana.lopez@puntoevento.com` |
| **Contraseña** | `ana123` |
| **Tipo** | EMPLOYEE |
| **Documento** | 22222222-2 |
| **Contrato** | Por Horas |
| **Teléfono** | +503 5234-5678 |
| **Descripción** | Empleada por horas con usuario asociado |

### 👨‍💼 Roberto Silva
| Campo | Valor |
|-------|-------|
| **Email** | `roberto.silva@puntoevento.com` |
| **Contraseña** | `roberto123` |
| **Tipo** | EMPLOYEE |
| **Documento** | 33333333-3 |
| **Contrato** | Permanente |
| **Teléfono** | +503 6234-5678 |
| **Descripción** | Empleado permanente adicional |

---

## 👤 **USUARIOS CLIENTES**

### 👤 Juan Pérez González
| Campo | Valor |
|-------|-------|
| **Email** | `juan.perez@email.com` |
| **Contraseña** | `cliente123` |
| **Tipo** | CLIENT |
| **Documento** | 12345678-9 |
| **Tipo Persona** | Natural |
| **Teléfono** | +503 1234-5678 |
| **Dirección** | San Salvador, El Salvador |
| **Descripción** | Cliente natural con usuario asociado |

### 🏢 Empresa Ejemplo S.A. de C.V.
| Campo | Valor |
|-------|-------|
| **Email** | `contacto@empresaejemplo.com` |
| **Contraseña** | `empresa123` |
| **Tipo** | CLIENT |
| **Documento** | 0614-123456-001-7 |
| **Tipo Persona** | Jurídica |
| **Teléfono** | +503 2234-5678 |
| **Dirección** | Santa Tecla, La Libertad, El Salvador |
| **Descripción** | Cliente jurídico (empresa) con usuario asociado |

### 👤 María Rodríguez
| Campo | Valor |
|-------|-------|
| **Email** | `maria.rodriguez@email.com` |
| **Contraseña** | `maria123` |
| **Tipo** | CLIENT |
| **Documento** | 87654321-0 |
| **Tipo Persona** | Natural |
| **Teléfono** | +503 3234-5678 |
| **Dirección** | San Miguel, El Salvador |
| **Descripción** | Cliente natural adicional |

---

## 🚀 **Guía de Uso para Testing**

### 🔑 **Login Rápido**

#### Para probar como Administrador:
```
Email: admin@puntoevento.com
Contraseña: admin123
```

#### Para probar como Empleado:
```
Email: carlos.mendoza@puntoevento.com
Contraseña: carlos123
```

#### Para probar como Cliente:
```
Email: juan.perez@email.com
Contraseña: cliente123
```

### 🎯 **Casos de Prueba Sugeridos**

#### **1. Autenticación y Autorización:**
- ✅ Login con diferentes tipos de usuario
- ✅ Verificación de permisos por rol
- ✅ Acceso a rutas protegidas
- ✅ Logout y limpieza de sesión

#### **2. Gestión de Usuarios (Solo Admin):**
- ✅ Listar usuarios
- ✅ Crear nuevos usuarios
- ✅ Editar usuarios existentes
- ✅ Activar/desactivar usuarios

#### **3. Gestión de Clientes:**
- ✅ Ver perfil de cliente
- ✅ Actualizar información personal
- ✅ Ver historial de cotizaciones

#### **4. Gestión de Empleados:**
- ✅ Ver perfil de empleado
- ✅ Actualizar información laboral
- ✅ Acceso a funciones de empleado

### 🔄 **Flujo de Pruebas Recomendado**

1. **Iniciar con Admin** → Verificar acceso completo
2. **Cambiar a Empleado** → Probar permisos limitados
3. **Cambiar a Cliente** → Verificar vista de cliente
4. **Probar CRUD** → Con cada tipo de usuario
5. **Verificar relaciones** → Usuario ↔ Cliente/Empleado

---

## ⚠️ **Notas Importantes**

### 🔒 **Seguridad:**
- Estas credenciales son **SOLO PARA DESARROLLO/PRUEBAS**
- **NO usar en producción**
- Cambiar todas las contraseñas antes de desplegar

### 🗃️ **Base de Datos:**
- Los usuarios se crean automáticamente al iniciar la aplicación
- Si no existen, el seeder los creará
- Para recrear: eliminar base de datos y reiniciar

### 🔧 **Configuración:**
- El seeder se puede deshabilitar con `app.seeder.enabled=false`
- Ver `application.properties` para más opciones

---

## 📞 **Información de Contacto de Prueba**

### 📍 **Direcciones de Ejemplo:**
- **San Salvador** → Para usuarios de la capital
- **Santa Tecla** → Para empresa jurídica
- **San Miguel** → Para cliente del oriente
- **Soyapango** → Para empleada
- **Mejicanos** → Para empleado adicional

### 📱 **Teléfonos de Ejemplo:**
- Todos usan formato salvadoreño: `+503 XXXX-XXXX`
- Números secuenciales para fácil identificación
- Formato consistente en todos los registros

---

## 🔄 **Regenerar Datos de Prueba**

Si necesitas regenerar todos los datos de prueba:

1. **Detener la aplicación**
2. **Eliminar la base de datos:**
   ```bash
   docker-compose down -v
   ```
3. **Recrear la base de datos:**
   ```bash
   docker-compose up -d postgres
   ```
4. **Reiniciar la aplicación:**
   ```bash
   ./mvnw spring-boot:run
   ```

Los datos se recrearán automáticamente con las mismas credenciales.

---

## 📋 **Checklist de Testing**

- [ ] Admin puede hacer login
- [ ] Empleado puede hacer login
- [ ] Cliente puede hacer login
- [ ] Permisos funcionan correctamente
- [ ] Relaciones usuario-entidad están bien
- [ ] CRUD operations funcionan
- [ ] Logout funciona
- [ ] Sesiones se manejan correctamente

**¡Listo para probar! 🚀**
