BEGIN;

-- VENTA
INSERT INTO "REGLAS_CONTABLES"
(
  tipo_operacion,
  descripcion,
  subcuenta_debe,
  subcuenta_haber,
  subcuenta_impuesto,
  disponible
)
VALUES
(
  'VENTA',
  'Registro contable de venta',
  1,   -- Caja
  34,  -- Ventas
  24,  -- ISV por pagar
  true
)
ON CONFLICT DO NOTHING;


-- ===============================
-- COSTO DE VENTA
-- ===============================

INSERT INTO "REGLAS_CONTABLES"
(
  tipo_operacion,
  descripcion,
  subcuenta_debe,
  subcuenta_haber,
  disponible
)
VALUES
(
  'VENTA_COSTO',
  'Costo de mercadería vendida',
  48,  -- Costo de ventas
  7,   -- Inventario
  true
)
ON CONFLICT DO NOTHING;


-- ===============================
-- ENTRADA INVENTARIO
-- ===============================

INSERT INTO "REGLAS_CONTABLES"
(
  tipo_operacion,
  descripcion,
  subcuenta_debe,
  subcuenta_haber,
  disponible
)
VALUES
(
  'INVENTARIO_ENTRADA',
  'Compra de inventario',
  7,   -- Inventario
  19,  -- Proveedores
  true
)
ON CONFLICT DO NOTHING;


-- ===============================
-- INVENTARIO DAÑO
-- ===============================

INSERT INTO "REGLAS_CONTABLES"
(
  tipo_operacion,
  descripcion,
  subcuenta_debe,
  subcuenta_haber,
  disponible
)
VALUES
(
  'INVENTARIO_DANIO',
  'Pérdida por daño de inventario',
  53,  -- Pérdida inventario
  7,   -- Inventario
  true
)
ON CONFLICT DO NOTHING;


-- ===============================
-- CONSUMO INTERNO
-- ===============================

INSERT INTO "REGLAS_CONTABLES"
(
  tipo_operacion,
  descripcion,
  subcuenta_debe,
  subcuenta_haber,
  disponible
)
VALUES
(
  'INVENTARIO_CONSUMO_INTERNO',
  'Consumo interno de inventario',
  55,  -- Gastos varios
  7,   -- Inventario
  true
)
ON CONFLICT DO NOTHING;


-- ===============================
-- AJUSTE INVENTARIO
-- ===============================

INSERT INTO "REGLAS_CONTABLES"
(
  tipo_operacion,
  descripcion,
  subcuenta_debe,
  subcuenta_haber,
  disponible
)
VALUES
(
  'INVENTARIO_AJUSTE',
  'Ajuste de inventario',
  54,  -- Ajuste inventario
  7,   -- Inventario
  true
)
ON CONFLICT DO NOTHING;


-- ===============================
-- OTRO
-- ===============================

INSERT INTO "REGLAS_CONTABLES"
(
  tipo_operacion,
  descripcion,
  subcuenta_debe,
  subcuenta_haber,
  disponible
)
VALUES
(
  'INVENTARIO_OTRO',
  'Salida de inventario por otro motivo',
  55,  -- Gastos varios
  7,   -- Inventario
  true
)
ON CONFLICT DO NOTHING;

COMMIT;