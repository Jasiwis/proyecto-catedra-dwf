-- Script para actualizar cotizaciones existentes a estado PENDIENTE
-- Esto es necesario porque las cotizaciones antiguas tienen estado 'EnProceso'

-- Ver el estado actual de las cotizaciones
SELECT id, event_name, status, created_at 
FROM quotes 
ORDER BY created_at DESC;

-- Actualizar todas las cotizaciones que no estén aprobadas o rechazadas a PENDIENTE
UPDATE quotes 
SET status = 'Pendiente' 
WHERE status NOT IN ('Aprobada', 'Rechazada');

-- Verificar el cambio
SELECT id, event_name, status, created_at 
FROM quotes 
ORDER BY created_at DESC;

