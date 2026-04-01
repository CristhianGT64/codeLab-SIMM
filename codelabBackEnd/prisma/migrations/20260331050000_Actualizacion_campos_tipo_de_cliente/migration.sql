-- Actualización de campos del modelo TipoCliente (HU-1.8)
-- Ampliar columna "nombre" a VARCHAR(200)
ALTER TABLE "TipoCliente" ALTER COLUMN "nombre" TYPE VARCHAR(200);

-- Agregar campo de descripción
ALTER TABLE "TipoCliente" ADD COLUMN IF NOT EXISTS "descripcion" VARCHAR(255);

-- Agregar campo de condición de pago
ALTER TABLE "TipoCliente" ADD COLUMN IF NOT EXISTS "condicion_pago" VARCHAR(100);

-- Agregar campo disponible (activo/inactivo)
ALTER TABLE "TipoCliente" ADD COLUMN IF NOT EXISTS "disponible" BOOLEAN NOT NULL DEFAULT true;

-- Agregar campo de fecha de creación
ALTER TABLE "TipoCliente" ADD COLUMN IF NOT EXISTS "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
