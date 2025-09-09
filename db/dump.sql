
-- Tabla de usuarios del sistema (sin manejo de roles)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    document TEXT UNIQUE NOT NULL,
    person_type TEXT CHECK (person_type IN ('Natural', 'Jurídica')) NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    status TEXT CHECK (status IN ('Activo', 'Inactivo')) DEFAULT 'Activo',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deactivated_at TIMESTAMP
);

-- Tabla de empleados
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    document TEXT UNIQUE NOT NULL,
    person_type TEXT CHECK (person_type IN ('Natural', 'Jurídica')) NOT NULL,
    contract_type TEXT CHECK (contract_type IN ('Permanente', 'Por Horas')) NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    status TEXT CHECK (status IN ('Activo', 'Inactivo')) DEFAULT 'Activo',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deactivated_at TIMESTAMP
);

-- Tabla de cotizaciones
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('En proceso', 'Finalizada', 'Cancelada')) DEFAULT 'En proceso',
    estimated_hours INTEGER,
    start_date DATE,
    end_date DATE,
    additional_costs NUMERIC DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabla de asignaciones a cotizaciones
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    estimated_hours INTEGER,
    base_cost NUMERIC,
    extra_percentage NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabla de tareas/subactividades asociadas a una asignación
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
