-- Active: 1771999720213@@127.0.0.1@5432@erpSIMM
BEGIN;

-- Seed generado a partir del dump 26-03-2026.sql
-- Requiere que primero se ejecute el seed_required actualizado.

-- 1) Catálogos de facturación
INSERT INTO public."TipoCliente" (id, nombre, descripcion, condicion_pago, disponible) VALUES
  (100, 'Mayorista', 'Cliente que compra en grandes volúmenes', 'Crédito 30 días', true),
  (1, 'Minorista', 'Cliente que compra al detalle', 'Contado', true),
  (2, 'Crédito', 'Cliente con línea de crédito aprobada', 'Crédito 15 días', true),
  (101, 'Contado', 'Cliente que paga al momento de la compra', 'Contado', true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  condicion_pago = EXCLUDED.condicion_pago,
  disponible = EXCLUDED.disponible;

INSERT INTO public."TiposDocumentos" (id_tipo_documento, numero, nombre, disponible) VALUES
  (1, 1, 'Factura', true)
ON CONFLICT (id_tipo_documento) DO UPDATE SET
  numero = EXCLUDED.numero,
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible;

INSERT INTO public."Cai" (codigo, fecha_inicio, fecha_fin, activo, id_cai, id_tipo_documento) VALUES
  ('F8A3E2-4D5C6B-7E8F9A-0B1C2D-3E4F5A-6B', '2026-01-01 00:00:00', '2026-03-18 00:00:00', true, 1, 1),
  ('A7D3F2-8B9E5C-1F0A6D-2E7B1C-3D8F4A-9B', '2026-03-19 00:00:00', '2026-12-31 23:59:59', true, 2, 1),
  ('C1B3E9-4F6D2A-0A8E7C-5B4D1F-9A6C3B-2E', '2026-03-19 06:00:00', '2026-03-19 06:00:00', true, 10, 1),
  ('D5A7F8-3C6E1B-0F2D9C-4A1E7B-5D3C8A-9B', '2026-03-20 05:35:52.367', '2026-04-01 06:00:00', true, 11, 1),
  ('RRRRRR-RRRRRR-RRRRRR-RRRRRR-RRRRRR-RR', '2026-03-25 06:00:00', '2026-08-31 06:00:00', true, 12, 1)
ON CONFLICT (id_cai) DO UPDATE SET
  codigo = EXCLUDED.codigo,
  fecha_inicio = EXCLUDED.fecha_inicio,
  fecha_fin = EXCLUDED.fecha_fin,
  activo = EXCLUDED.activo,
  id_tipo_documento = EXCLUDED.id_tipo_documento;

INSERT INTO public."RangoEmision" (final_rango, id_cai, id_rango_emision, inicio_rango) VALUES
  (5, 1, 1, 1),
  (10, 2, 2, 6),
  (15, 10, 10, 11),
  (20, 11, 11, 16),
  (30, 12, 12, 21)
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

INSERT INTO public.establecimiento_tipo_documeto (id_establecimiento_tipo_documento, id_establecimiento, id_tipo_documento, disponible) VALUES
  (1, 1, 1, false)
ON CONFLICT (id_establecimiento_tipo_documento) DO UPDATE SET
  id_establecimiento = EXCLUDED.id_establecimiento,
  id_tipo_documento = EXCLUDED.id_tipo_documento,
  disponible = EXCLUDED.disponible;

INSERT INTO public."PuntosEmision" (id_punto_emision, numero, id_tipo_documento, id_establecimiento, id_rango_emision, disponible) VALUES
  (1, 1, 1, 1, 12, true)
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
  (16, '001-001-01-00000016', 16, 11, 1, 1, 1),
  (17, '001-001-01-00000017', 17, 11, 1, 1, 1),
  (18, '001-001-01-00000018', 18, 11, 1, 1, 1),
  (19, '001-001-01-00000019', 19, 11, 1, 1, 1),
  (20, '001-001-01-00000020', 20, 11, 1, 1, 1),
  (21, '001-001-01-00000021', 21, 12, 1, 1, 1),
  (22, '001-001-01-00000022', 22, 12, 1, 1, 1),
  (23, '001-001-01-00000023', 23, 12, 1, 1, 1),
  (24, '001-001-01-00000024', 24, 12, 1, 1, 1),
  (25, '001-001-01-00000025', 25, 12, 1, 1, 1),
  (26, '001-001-01-00000026', 26, 12, 1, 1, 1)
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
  (2, 328.00, 'completada', NULL, NULL, 2, 2),
  (3, 28.00, 'completada', '2026-03-26 01:23:41.8', NULL, 2, 2),
  (4, 172.50, 'completada', '2026-03-26 01:27:25.184', NULL, 2, 2),
  (5, 28.00, 'completada', '2026-03-26 01:39:00.38', NULL, 2, 2),
  (6, 1035.00, 'completada', '2026-03-26 01:39:06.351', NULL, 2, 2),
  (7, 2300.00, 'pendiente', '2026-03-26 01:39:36.827', NULL, 2, 2),
  (8, 172.50, 'completada', '2026-03-26 01:42:07.401', NULL, 2, 2),
  (9, 172.50, 'pendiente', '2026-03-26 01:45:52.217', NULL, 2, 2),
  (10, 28.00, 'completada', '2026-03-26 01:53:06.918', NULL, 2, 2),
  (11, 109.25, 'completada', '2026-03-26 01:55:50.67', NULL, 2, 2),
  (12, 51.75, 'completada', '2026-03-26 03:05:52.778', NULL, 2, 2),
  (13, 28.00, 'completada', '2026-03-26 03:47:50.768', NULL, 2, 2),
  (14, 1486.00, 'completada', '2026-03-26 04:17:05.098', NULL, 2, 2)
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
  (3, 2, 150.00, 300.00, 2, 100),
  (4, 1, 28.00, 28.00, 3, 101),
  (5, 1, 150.00, 150.00, 4, 100),
  (6, 1, 28.00, 28.00, 5, 101),
  (7, 1, 900.00, 900.00, 6, 7),
  (8, 1, 2000.00, 2000.00, 7, 9),
  (9, 1, 150.00, 150.00, 8, 5),
  (10, 1, 150.00, 150.00, 9, 5),
  (11, 1, 28.00, 28.00, 10, 101),
  (12, 1, 95.00, 95.00, 11, 2),
  (13, 1, 45.00, 45.00, 12, 102),
  (14, 1, 28.00, 28.00, 13, 101),
  (15, 2, 100.00, 200.00, 14, 104),
  (16, 1, 1250.00, 1250.00, 14, 103)
ON CONFLICT (id) DO UPDATE SET
  cantidad = EXCLUDED.cantidad,
  precio_unitario = EXCLUDED.precio_unitario,
  subtotal = EXCLUDED.subtotal,
  "ventaId" = EXCLUDED."ventaId",
  "productoId" = EXCLUDED."productoId";

INSERT INTO public."Facturas" (id, subtotal, impuesto, total, fecha_emision, numero_formateado, "ventaId", "clienteId", "usuarioId", "sucursalId", "importeExento", "importeGravado15", "importeGravado18", isv15, isv18) VALUES
  (1, 28.00, 0.00, 28.00, '2026-03-26 01:37:05.706', '001-001-01-00000017', 3, NULL, 1, 2, 28.00, 0.00, 0.00, 0.00, 0.00),
  (2, 150.00, 22.50, 172.50, '2026-03-26 01:37:35.16', '001-001-01-00000018', 4, NULL, 1, 2, 0.00, 150.00, 0.00, 22.50, 0.00),
  (3, 28.00, 0.00, 28.00, '2026-03-26 01:40:11', '001-001-01-00000019', 5, NULL, 1, 2, 28.00, 0.00, 0.00, 0.00, 0.00),
  (4, 900.00, 135.00, 1035.00, '2026-03-26 01:42:17.585', '001-001-01-00000020', 6, NULL, 1, 2, 0.00, 900.00, 0.00, 135.00, 0.00),
  (5, 150.00, 22.50, 172.50, '2026-03-26 01:43:22.756', '001-001-01-00000021', 8, NULL, 1, 2, 0.00, 150.00, 0.00, 22.50, 0.00),
  (6, 28.00, 0.00, 28.00, '2026-03-26 01:53:07.041', '001-001-01-00000022', 10, NULL, 2, 2, 28.00, 0.00, 0.00, 0.00, 0.00),
  (7, 95.00, 14.25, 109.25, '2026-03-26 01:55:50.754', '001-001-01-00000023', 11, NULL, 2, 2, 0.00, 95.00, 0.00, 14.25, 0.00),
  (8, 45.00, 6.75, 51.75, '2026-03-26 03:05:52.892', '001-001-01-00000024', 12, NULL, 2, 2, 0.00, 45.00, 0.00, 6.75, 0.00),
  (9, 28.00, 0.00, 28.00, '2026-03-26 03:47:50.864', '001-001-01-00000025', 13, NULL, 2, 2, 28.00, 0.00, 0.00, 0.00, 0.00),
  (10, 1450.00, 36.00, 1486.00, '2026-03-26 04:17:05.359', '001-001-01-00000026', 14, NULL, 2, 2, 1250.00, 0.00, 200.00, 0.00, 36.00)
ON CONFLICT (id) DO UPDATE SET
  subtotal = EXCLUDED.subtotal,
  impuesto = EXCLUDED.impuesto,
  total = EXCLUDED.total,
  fecha_emision = EXCLUDED.fecha_emision,
  numero_formateado = EXCLUDED.numero_formateado,
  "ventaId" = EXCLUDED."ventaId",
  "clienteId" = EXCLUDED."clienteId",
  "usuarioId" = EXCLUDED."usuarioId",
  "sucursalId" = EXCLUDED."sucursalId",
  "importeExento" = EXCLUDED."importeExento",
  "importeGravado15" = EXCLUDED."importeGravado15",
  "importeGravado18" = EXCLUDED."importeGravado18",
  isv15 = EXCLUDED.isv15,
  isv18 = EXCLUDED.isv18;

INSERT INTO public."DetalleFactura" (id, "facturaId", "productoId", cantidad, "precioUnitario", subtotal, "tasaImpuesto", "montoImpuesto", "tipoImpuesto") VALUES
  (1, 1, 101, 1, 28.00, 28.00, 0.00, 0.00, 'EXENTO'),
  (2, 2, 100, 1, 150.00, 150.00, 0.15, 22.50, 'ISV 15%'),
  (3, 3, 101, 1, 28.00, 28.00, 0.00, 0.00, 'EXENTO'),
  (4, 4, 7, 1, 900.00, 900.00, 0.15, 135.00, 'ISV 15%'),
  (5, 5, 5, 1, 150.00, 150.00, 0.15, 22.50, 'ISV 15%'),
  (6, 6, 101, 1, 28.00, 28.00, 0.00, 0.00, 'EXENTO'),
  (7, 7, 2, 1, 95.00, 95.00, 0.15, 14.25, 'ISV 15%'),
  (8, 8, 102, 1, 45.00, 45.00, 0.15, 6.75, 'ISV 15%'),
  (9, 9, 101, 1, 28.00, 28.00, 0.00, 0.00, 'EXENTO'),
  (10, 10, 104, 2, 100.00, 200.00, 0.18, 36.00, 'ISV 18%'),
  (11, 10, 103, 1, 1250.00, 1250.00, 0.00, 0.00, 'EXENTO')
ON CONFLICT (id) DO UPDATE SET
  "facturaId" = EXCLUDED."facturaId",
  "productoId" = EXCLUDED."productoId",
  cantidad = EXCLUDED.cantidad,
  "precioUnitario" = EXCLUDED."precioUnitario",
  subtotal = EXCLUDED.subtotal,
  "tasaImpuesto" = EXCLUDED."tasaImpuesto",
  "montoImpuesto" = EXCLUDED."montoImpuesto",
  "tipoImpuesto" = EXCLUDED."tipoImpuesto";

INSERT INTO public."MovimientoInventario" (id, tipo, cantidad, referencia_tipo, referencia_id, created_at, "productoId", "sucursalId", "usuarioId", costo_total, costo_unitario, detalle_motivo, estado, fecha_movimiento, metodo_valuacion_aplicado, motivo_salida, observaciones, "proveedorId", stock_resultante, subtipo_entrada) VALUES
 (1, 'entrada', 10, 'SEED', 1, '2026-03-11 09:00:00', 1, 2, 2, 500, 50, NULL, 'completado', '2026-03-11 09:00:00', 'FIFO', NULL, 'Ingreso inicial Camisa', 1, 10, 'PRODUCTO_NUEVO'),
  (2, 'salida', 1, 'VENTA', 1, '2026-03-11 10:00:00', 1, 2, 2, NULL, NULL, NULL, 'completado', '2026-03-11 10:00:00', NULL, 'VENTA', 'Salida por venta demo', NULL, 9, NULL),
  (3, 'salida', 1, 'FACTURA', 1, '2026-03-26 01:37:05.762', 101, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 01:37:05.76', NULL, 'VENTA', NULL, NULL, 199, NULL),
  (4, 'salida', 1, 'FACTURA', 2, '2026-03-26 01:37:35.185', 100, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 01:37:35.184', NULL, 'VENTA', NULL, NULL, 49, NULL),
  (5, 'salida', 1, 'FACTURA', 3, '2026-03-26 01:40:11.047', 101, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 01:40:11.045', NULL, 'VENTA', NULL, NULL, 198, NULL),
  (6, 'salida', 1, 'FACTURA', 4, '2026-03-26 01:42:17.606', 7, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 01:42:17.606', NULL, 'VENTA', NULL, NULL, 5, NULL),
  (7, 'salida', 1, 'FACTURA', 5, '2026-03-26 01:43:22.779', 5, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 01:43:22.778', NULL, 'VENTA', NULL, NULL, 9, NULL),
  (8, 'salida', 1, 'FACTURA', 6, '2026-03-26 01:53:07.071', 101, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 01:53:07.07', NULL, 'VENTA', NULL, NULL, 197, NULL),
  (9, 'salida', 1, 'FACTURA', 7, '2026-03-26 01:55:50.771', 2, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 01:55:50.77', NULL, 'VENTA', NULL, NULL, 8, NULL),
  (10, 'salida', 1, 'FACTURA', 8, '2026-03-26 03:05:52.921', 102, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 03:05:52.92', NULL, 'VENTA', NULL, NULL, 29, NULL),
  (11, 'salida', 1, 'FACTURA', 9, '2026-03-26 03:47:50.882', 101, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 03:47:50.882', NULL, 'VENTA', NULL, NULL, 196, NULL),
  (12, 'entrada', 30, 'creacion_producto', NULL, '2026-03-26 04:10:31.685', 103, 2, NULL, 30000, 1000, NULL, 'completado', '2026-03-26 04:10:31.682', 'FIFO', NULL, 'Ingreso inicial Laptop', NULL, 30, 'PRODUCTO_NUEVO'),
  (13, 'entrada', 29, 'creacion_producto', NULL, '2026-03-26 04:16:14.324', 104, 2, NULL, 1450, 50, NULL, 'completado', '2026-03-26 04:16:14.324', 'FIFO', NULL, 'Ingreso inicial Zapatos', NULL, 29, 'PRODUCTO_NUEVO'),
  (14, 'salida', 2, 'FACTURA', 10, '2026-03-26 04:17:05.481', 104, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 04:17:05.478', NULL, 'VENTA', NULL, NULL, 27, NULL),
  (15, 'salida', 1, 'FACTURA', 10, '2026-03-26 04:17:05.506', 103, 2, NULL, NULL, NULL, NULL, 'completado', '2026-03-26 04:17:05.505', NULL, 'VENTA', NULL, NULL, 29, NULL),
  (16, 'entrada', 20, 'SEED', NULL, NOW(), 2, 2, 2, 1200, 60, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Pantalon', NULL, 20, 'PRODUCTO_NUEVO'),
  (17, 'entrada', 15, 'SEED', NULL, NOW(), 3, 2, 2, 1500, 100, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Tenis', NULL, 15, 'PRODUCTO_NUEVO'),
  (18, 'entrada', 25, 'SEED', NULL, NOW(), 4, 2, 2, 3012.5, 120.5, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Calcetines', NULL, 25, 'PRODUCTO_NUEVO'),
  (19, 'entrada', 12, 'SEED', NULL, NOW(), 5, 2, 2, 1200, 100, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Teclado', NULL, 12, 'PRODUCTO_NUEVO'),
  (20, 'entrada', 10, 'SEED', NULL, NOW(), 6, 2, 2, 1205, 120.5, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Mouse', NULL, 10, 'PRODUCTO_NUEVO'),
  (21, 'entrada', 8, 'SEED', NULL, NOW(), 7, 2, 2, 5600, 700, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Monitor', NULL, 8, 'PRODUCTO_NUEVO'),
  (22, 'entrada', 6, 'SEED', NULL, NOW(), 8, 2, 2, 4800, 800, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Camisa Barca', NULL, 6, 'PRODUCTO_NUEVO'),
  (23, 'entrada', 5, 'SEED', NULL, NOW(), 9, 2, 2, 4500, 900, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Camisa Marathon', NULL, 5, 'PRODUCTO_NUEVO'),
  (24, 'entrada', 4, 'SEED', NULL, NOW(), 10, 2, 2, 6400, 1600, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Buzo azul', NULL, 4, 'PRODUCTO_NUEVO'),
  (25, 'entrada', 50, 'SEED', NULL, NOW(), 100, 2, 2, 4250, 85, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Audifonos', NULL, 50, 'PRODUCTO_NUEVO'),
  (26, 'entrada', 200, 'SEED', NULL, NOW(), 101, 2, 2, 3000, 15, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Jabón', NULL, 200, 'PRODUCTO_NUEVO'),
  (27, 'entrada', 30, 'SEED', NULL, NOW(), 102, 2, 2, 750, 25, NULL, 'completado', NOW(), 'FIFO', NULL, 'Ingreso inicial Gorra', NULL, 30, 'PRODUCTO_NUEVO')
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
SELECT setval('public."DetalleFactura_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."DetalleFactura"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."DetalleFactura"), false)
);
SELECT setval('public."MovimientoInventario_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."MovimientoInventario"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."MovimientoInventario"), false)
);

COMMIT;
