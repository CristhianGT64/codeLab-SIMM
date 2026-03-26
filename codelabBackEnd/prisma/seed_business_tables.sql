-- Active: 1771999720213@@127.0.0.1@5432@erpSIMM
BEGIN;

-- Seed generado a partir del dump 20-03-2026.sql
-- Requiere que primero se ejecute el seed_required actualizado.

-- 1) Catálogos de facturación
INSERT INTO public."TipoCliente" (id, nombre) VALUES
  (100, 'Mayorista'),
  (1, 'Natural'),
  (2, 'Jurídico'),
  (101, 'Contado')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre;

INSERT INTO public."TiposDocumentos" (id_tipo_documento, numero, nombre, disponible) VALUES
  (1, 1, 'Factura', true)
ON CONFLICT (id_tipo_documento) DO UPDATE SET
  numero = EXCLUDED.numero,
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible;

INSERT INTO public."Cai" (codigo, fecha_inicio, fecha_fin, activo, id_cai) VALUES
  ('F8A3E2-4D5C6B-7E8F9A-0B1C2D-3E4F5A-6B', '2026-01-01 00:00:00', '2026-03-18 00:00:00', true, 1),
  ('A7D3F2-8B9E5C-1F0A6D-2E7B1C-3D8F4A-9B', '2026-03-19 00:00:00', '2026-12-31 23:59:59', true, 2),
  ('C1B3E9-4F6D2A-0A8E7C-5B4D1F-9A6C3B-2E', '2026-03-19 06:00:00', '2026-03-19 06:00:00', true, 10),
  ('D5A7F8-3C6E1B-0F2D9C-4A1E7B-5D3C8A-9B', '2026-03-20 05:35:52.367', '2026-04-01 06:00:00', true, 11)
ON CONFLICT (id_cai) DO UPDATE SET
  codigo = EXCLUDED.codigo,
  fecha_inicio = EXCLUDED.fecha_inicio,
  fecha_fin = EXCLUDED.fecha_fin,
  activo = EXCLUDED.activo;

INSERT INTO public."RangoEmision" (final_rango, id_cai, id_rango_emision, inicio_rango) VALUES
  (5, 1, 1, 1),
  (10, 2, 2, 6),
  (15, 10, 10, 11),
  (20, 11, 11, 16)
ON CONFLICT (id_rango_emision) DO UPDATE SET
  final_rango = EXCLUDED.final_rango,
  id_cai = EXCLUDED.id_cai,
  inicio_rango = EXCLUDED.inicio_rango;

-- 2) Estructura de facturación
INSERT INTO public."Establecimientos" (id_establecimiento, numero, nombre, "sucursalId", disponible) VALUES
  (1, 1, 'Establecimiento Principal', 2, true)
ON CONFLICT (id_establecimiento) DO UPDATE SET
  numero = EXCLUDED.numero,
  nombre = EXCLUDED.nombre,
  "sucursalId" = EXCLUDED."sucursalId",
  disponible = EXCLUDED.disponible;

INSERT INTO public.establecimiento_tipo_documeto (id_establecimiento_tipo_documento, id_establecimiento, id_tipo_documento) VALUES
  (1, 1, 1)
ON CONFLICT (id_establecimiento_tipo_documento) DO UPDATE SET
  id_establecimiento = EXCLUDED.id_establecimiento,
  id_tipo_documento = EXCLUDED.id_tipo_documento;

INSERT INTO public."PuntosEmision" (id_punto_emision, numero, id_tipo_documento, id_establecimiento, id_rango_emision, disponible) VALUES
  (1, 1, 1, 1, 1, true)
ON CONFLICT (id_punto_emision) DO UPDATE SET
  numero = EXCLUDED.numero,
  id_tipo_documento = EXCLUDED.id_tipo_documento,
  id_establecimiento = EXCLUDED.id_establecimiento,
  id_rango_emision = EXCLUDED.id_rango_emision,
  disponible = EXCLUDED.disponible;

INSERT INTO public."NumeroFactura" (id, numero_formateado, correlativo, id_cai, id_establecimiento, id_punto_emision, id_tipo_documento) VALUES
  (1, '001-001-01-00000001', 1, 1, 1, 1, 1),
  (2, '001-001-01-00000002', 2, 1, 1, 1, 1),
  (3, '001-001-01-00000003', 3, 1, 1, 1, 1),
  (4, '001-001-01-00000004', 4, 1, 1, 1, 1),
  (5, '001-001-01-00000005', 5, 1, 1, 1, 1),
  (6, '001-001-01-00000006', 6, 2, 1, 1, 1),
  (7, '001-001-01-00000007', 7, 2, 1, 1, 1),
  (8, '001-001-01-00000008', 8, 2, 1, 1, 1),
  (9, '001-001-01-00000009', 9, 2, 1, 1, 1),
  (10, '001-001-01-00000010', 10, 2, 1, 1, 1),
  (11, '001-001-01-00000011', 11, 10, 1, 1, 1),
  (12, '001-001-01-00000012', 12, 10, 1, 1, 1),
  (13, '001-001-01-00000013', 13, 10, 1, 1, 1),
  (14, '001-001-01-00000014', 14, 10, 1, 1, 1),
  (15, '001-001-01-00000015', 15, 10, 1, 1, 1),
  (16, '001-001-01-00000016', 16, 11, 1, 1, 1)
ON CONFLICT (id) DO UPDATE SET
  numero_formateado = EXCLUDED.numero_formateado,
  correlativo = EXCLUDED.correlativo,
  id_cai = EXCLUDED.id_cai,
  id_establecimiento = EXCLUDED.id_establecimiento,
  id_punto_emision = EXCLUDED.id_punto_emision,
  id_tipo_documento = EXCLUDED.id_tipo_documento;

 
-- 3) Clientes y proveedores
INSERT INTO public."Cliente" (id, nombre_completo, identificacion, telefono, correo, direccion, "tipoClienteId") VALUES
  (1, 'Cliente Demo', 0801199000001, '9999-0001', 'cliente.demo@correo.com', 'Tegucigalpa', 1),
  (2, 'Milton Alvarado', 0801200304734, '+50422322700', 'milton@gmail.com', 'En la casa', 101)
ON CONFLICT (id) DO UPDATE SET
  nombre_completo = EXCLUDED.nombre_completo,
  identificacion = EXCLUDED.identificacion,
  telefono = EXCLUDED.telefono,
  correo = EXCLUDED.correo,
  direccion = EXCLUDED.direccion,
  "tipoClienteId" = EXCLUDED."tipoClienteId";

INSERT INTO public."Proveedor" (id, nombre, telefono, correo, direccion, disponible) VALUES
  (100, 'Importadora Global', '2555-0000', 'importadora@global.hn', 'Puerto Cortes', true),
  (101, 'Distribuidora Local', '2666-0000', 'distrib@local.hn', 'La Ceiba', true),
  (1, 'Proveedor Demo', '2222-0000', 'proveedor.demo@correo.com', 'Comayaguela', true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono,
  correo = EXCLUDED.correo,
  direccion = EXCLUDED.direccion,
  disponible = EXCLUDED.disponible;

-- 4) Configuración comercial y relaciones
INSERT INTO public.configuracion_sistema (id, metodo_valuacion_inventario, moneda_funcional) VALUES
  (1, 'FIFO', 'HNL')
ON CONFLICT (id) DO UPDATE SET
  metodo_valuacion_inventario = EXCLUDED.metodo_valuacion_inventario,
  moneda_funcional = EXCLUDED.moneda_funcional;

INSERT INTO public.producto_proveedor ("productoId", "proveedorId") VALUES
  (1, 1),
  (2, 1),
  (100, 100),
  (101, 101),
  (102, 100)
ON CONFLICT ("productoId", "proveedorId") DO NOTHING;

-- 5) Operación comercial
INSERT INTO public."Venta" (id, total, estado, "createdAt", "clienteId", "usuarioId", "sucursalId") VALUES
  (1, 28.00, 'completada', NULL, NULL, 2, 2),
  (2, 328.00, 'completada', NULL, NULL, 2, 2)
ON CONFLICT (id) DO UPDATE SET
  total = EXCLUDED.total,
  estado = EXCLUDED.estado,
  "createdAt" = EXCLUDED."createdAt",
  "clienteId" = EXCLUDED."clienteId",
  "usuarioId" = EXCLUDED."usuarioId",
  "sucursalId" = EXCLUDED."sucursalId";

INSERT INTO public."DetalleVenta" (id, cantidad, precio_unitario, subtotal, "ventaId", "productoId") VALUES
  (1, 1, 28.00, 28.00, 1, 101),
  (2, 1, 28.00, 28.00, 2, 101),
  (3, 2, 150.00, 300.00, 2, 100)
ON CONFLICT (id) DO UPDATE SET
  cantidad = EXCLUDED.cantidad,
  precio_unitario = EXCLUDED.precio_unitario,
  subtotal = EXCLUDED.subtotal,
  "ventaId" = EXCLUDED."ventaId",
  "productoId" = EXCLUDED."productoId";

-- Sin registros en public."Facturas" al 20-03-2026.

INSERT INTO public."MovimientoInventario" (id, tipo, cantidad, referencia_tipo, referencia_id, created_at, "productoId", "sucursalId", "usuarioId", costo_total, costo_unitario, detalle_motivo, estado, fecha_movimiento, metodo_valuacion_aplicado, motivo_salida, observaciones, "proveedorId", stock_resultante, subtipo_entrada) VALUES
  (1, 'entrada', 10, 'SEED', 1, '2026-03-11 09:00:00', 1, 2, 2, NULL, NULL, NULL, 'completado', '2026-03-11 09:00:00', NULL, NULL, 'Ingreso inicial por carga semilla', 1, 10, 'PRODUCTO_NUEVO'),
  (2, 'salida', 1, 'VENTA', 1, '2026-03-11 10:00:00', 1, 2, 2, NULL, NULL, NULL, 'completado', '2026-03-11 10:00:00', NULL, 'VENTA', 'Salida por venta demo', NULL, 9, NULL)
ON CONFLICT (id) DO UPDATE SET
  tipo = EXCLUDED.tipo,
  cantidad = EXCLUDED.cantidad,
  referencia_tipo = EXCLUDED.referencia_tipo,
  referencia_id = EXCLUDED.referencia_id,
  created_at = EXCLUDED.created_at,
  "productoId" = EXCLUDED."productoId",
  "sucursalId" = EXCLUDED."sucursalId",
  "usuarioId" = EXCLUDED."usuarioId",
  costo_total = EXCLUDED.costo_total,
  costo_unitario = EXCLUDED.costo_unitario,
  detalle_motivo = EXCLUDED.detalle_motivo,
  estado = EXCLUDED.estado,
  fecha_movimiento = EXCLUDED.fecha_movimiento,
  metodo_valuacion_aplicado = EXCLUDED.metodo_valuacion_aplicado,
  motivo_salida = EXCLUDED.motivo_salida,
  observaciones = EXCLUDED.observaciones,
  "proveedorId" = EXCLUDED."proveedorId",
  stock_resultante = EXCLUDED.stock_resultante,
  subtipo_entrada = EXCLUDED.subtipo_entrada;

-- Ajuste de secuencias
SELECT setval('public."TipoCliente_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."TipoCliente"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."TipoCliente"), false)
);
SELECT setval('public."TiposDocumentos_id_tipo_documento_seq"',
  COALESCE((SELECT MAX(id_tipo_documento) FROM public."TiposDocumentos"), 1),
  COALESCE((SELECT MAX(id_tipo_documento) IS NOT NULL FROM public."TiposDocumentos"), false)
);
SELECT setval('public."Cai_id_cai_seq"',
  COALESCE((SELECT MAX(id_cai) FROM public."Cai"), 1),
  COALESCE((SELECT MAX(id_cai) IS NOT NULL FROM public."Cai"), false)
);
SELECT setval('public."RangoEmision_id_rango_emision_seq"',
  COALESCE((SELECT MAX(id_rango_emision) FROM public."RangoEmision"), 1),
  COALESCE((SELECT MAX(id_rango_emision) IS NOT NULL FROM public."RangoEmision"), false)
);
SELECT setval('public."Establecimientos_id_establecimiento_seq"',
  COALESCE((SELECT MAX(id_establecimiento) FROM public."Establecimientos"), 1),
  COALESCE((SELECT MAX(id_establecimiento) IS NOT NULL FROM public."Establecimientos"), false)
);
SELECT setval('public.establecimiento_tipo_documeto_id_establecimiento_tipo_docum_seq',
  COALESCE((SELECT MAX(id_establecimiento_tipo_documento) FROM public.establecimiento_tipo_documeto), 1),
  COALESCE((SELECT MAX(id_establecimiento_tipo_documento) IS NOT NULL FROM public.establecimiento_tipo_documeto), false)
);
SELECT setval('public."PuntosEmision_id_punto_emision_seq"',
  COALESCE((SELECT MAX(id_punto_emision) FROM public."PuntosEmision"), 1),
  COALESCE((SELECT MAX(id_punto_emision) IS NOT NULL FROM public."PuntosEmision"), false)
);
SELECT setval('public."NumeroFactura_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."NumeroFactura"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."NumeroFactura"), false)
);
SELECT setval('public."Cliente_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Cliente"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Cliente"), false)
);
SELECT setval('public."Proveedor_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Proveedor"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Proveedor"), false)
);
SELECT setval('public.configuracion_sistema_id_seq',
  COALESCE((SELECT MAX(id) FROM public.configuracion_sistema), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public.configuracion_sistema), false)
);
SELECT setval('public."Venta_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Venta"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Venta"), false)
);
SELECT setval('public."DetalleVenta_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."DetalleVenta"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."DetalleVenta"), false)
);
SELECT setval('public."Facturas_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Facturas"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Facturas"), false)
);
SELECT setval('public."MovimientoInventario_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."MovimientoInventario"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."MovimientoInventario"), false)
);

COMMIT;
