-- ============================================================================
--  PUNTO EVENTO • Estructura base (ENUMS en MAYÚSCULAS, sin extensiones)
--  Crea la base de datos completa al iniciar el contenedor
-- ============================================================================

-- =========================
-- ENUMS
-- =========================
CREATE TYPE user_type_enum AS ENUM ('ADMIN', 'EMPLOYEE', 'CLIENT');
CREATE TYPE person_type_enum AS ENUM ('NATURAL', 'JURIDICA');
CREATE TYPE contract_type_enum AS ENUM ('PERMANENTE', 'PORHORAS');
CREATE TYPE active_status_enum AS ENUM ('ACTIVO', 'INACTIVO');
CREATE TYPE quote_status_enum AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA');
CREATE TYPE reservation_status_enum AS ENUM ('EN_PLANEACION', 'PROGRAMADA', 'ENCURSO', 'FINALIZADA', 'CANCELADA');
CREATE TYPE task_status_enum AS ENUM ('PENDIENTE', 'ENPROCESO', 'COMPLETADA', 'CANCELADA');
CREATE TYPE invoice_status_enum AS ENUM ('EMITIDA', 'PAGADA', 'ANULADA');

-- =========================
-- USUARIOS / PERSONAS
-- =========================
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

CREATE INDEX idx_users_user_type ON users(user_type);

CREATE TABLE clients (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT NOT NULL,
    document       TEXT NOT NULL UNIQUE,
    person_type    person_type_enum NOT NULL,
    phone          TEXT,
    email          TEXT,
    address        TEXT,
    status         active_status_enum NOT NULL DEFAULT 'ACTIVO',
    user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
    created_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP,
    deactivated_at TIMESTAMP
);

CREATE TABLE employees (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT NOT NULL,
    document       TEXT NOT NULL UNIQUE,
    person_type    person_type_enum NOT NULL,
    contract_type  contract_type_enum NOT NULL,
    phone          TEXT,
    email          TEXT,
    address        TEXT,
    status         active_status_enum NOT NULL DEFAULT 'ACTIVO',
    user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
    created_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP,
    deactivated_at TIMESTAMP
);


-- =========================
-- AUDITORÍA / HISTORIAL
-- =========================
CREATE TABLE event_history (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type   TEXT NOT NULL,
    entity_id     UUID NOT NULL,
    action        TEXT NOT NULL,
    prev_status   TEXT,
    new_status    TEXT,
    metadata      JSONB,
    created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_history_entity ON event_history(entity_type, entity_id);

-- =========================
-- CATÁLOGO DE SERVICIOS
-- =========================
CREATE TABLE service_catalog (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                 TEXT UNIQUE NOT NULL,
    name                 TEXT NOT NULL,
    description          TEXT,
    default_unit_price   NUMERIC(12,2) NOT NULL DEFAULT 0,
    requires_assignment  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP
);

-- =========================
-- SOLICITUDES
-- =========================
CREATE TABLE requests (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id          UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    event_name         TEXT NOT NULL,
    event_date         TEXT NOT NULL,
    location           TEXT NOT NULL,
    requested_services TEXT NOT NULL,
    notes              TEXT,
    status             active_status_enum NOT NULL DEFAULT 'ACTIVO',
    created_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP
);

-- =========================
-- COTIZACIONES
-- =========================
CREATE TABLE quotes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id       UUID REFERENCES requests(id) ON DELETE SET NULL,
    client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    event_name       TEXT NOT NULL,
    status           quote_status_enum NOT NULL DEFAULT 'PENDIENTE',
    start_date       DATE,
    end_date         DATE,
    subtotal         NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_total        NUMERIC(12,2) NOT NULL DEFAULT 0,
    additional_costs NUMERIC(12,2) NOT NULL DEFAULT 0,
    total            NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP
);

CREATE TABLE quote_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id    UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    service_id  UUID REFERENCES service_catalog(id) ON DELETE SET NULL,
    description TEXT,
    quantity    NUMERIC(12,2) NOT NULL DEFAULT 1,
    unit_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_rate    NUMERIC(5,2)  NOT NULL DEFAULT 0,
    subtotal    NUMERIC(12,2) NOT NULL DEFAULT 0,
    total       NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP
);

-- =========================
-- RESERVAS
-- =========================
CREATE TABLE reservations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id      UUID UNIQUE NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    event_name    TEXT NOT NULL,
    status        reservation_status_enum NOT NULL DEFAULT 'PROGRAMADA',
    scheduled_for TEXT,
    location      TEXT NOT NULL,
    notes         TEXT,
    progress_pct  NUMERIC(5,2) NOT NULL DEFAULT 0,
    created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP
);

CREATE TABLE reservation_services (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    service_id     UUID NOT NULL REFERENCES service_catalog(id) ON DELETE RESTRICT,
    quantity       NUMERIC(12,2) NOT NULL DEFAULT 1
);

-- =========================
-- TAREAS
-- =========================
CREATE TABLE tasks (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    service_id     UUID REFERENCES service_catalog(id) ON DELETE SET NULL,
    title          TEXT NOT NULL,
    description    TEXT,
    start_datetime TIMESTAMP,
    end_datetime   TIMESTAMP,
    status         task_status_enum NOT NULL DEFAULT 'PENDIENTE',
    completed_at   TIMESTAMP,
    created_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP
);

-- =========================
-- ASIGNACIONES (Muchos a Muchos: Tasks <-> Employees)
-- =========================
CREATE TABLE assignments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes       TEXT,
    UNIQUE(task_id, employee_id)
);

CREATE INDEX idx_assignments_task ON assignments(task_id);
CREATE INDEX idx_assignments_employee ON assignments(employee_id);

CREATE TABLE task_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    prev_status task_status_enum,
    new_status  task_status_enum,
    changed_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    notes       TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- FACTURACIÓN
-- =========================
CREATE TABLE invoices (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id   UUID UNIQUE NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    issue_date       TEXT NOT NULL,
    status           invoice_status_enum NOT NULL DEFAULT 'EMITIDA',
    subtotal         NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_total        NUMERIC(12,2) NOT NULL DEFAULT 0,
    additional_costs NUMERIC(12,2) NOT NULL DEFAULT 0,
    total            NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP
);

CREATE TABLE invoice_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    service_id  UUID REFERENCES service_catalog(id) ON DELETE SET NULL,
    description TEXT,
    quantity    NUMERIC(12,2) NOT NULL DEFAULT 1,
    unit_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_rate    NUMERIC(5,2)  NOT NULL DEFAULT 0,
    subtotal    NUMERIC(12,2) NOT NULL DEFAULT 0,
    total       NUMERIC(12,2) NOT NULL DEFAULT 0
);