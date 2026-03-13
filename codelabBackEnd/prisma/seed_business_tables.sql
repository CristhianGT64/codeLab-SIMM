BEGIN;

-- 1) Catalogos base para clientes y facturacion
INSERT INTO public."TipoCliente" (id, nombre) VALUES
  (1, 'Natural'),
  (2, 'Jurídico')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre;

INSERT INTO public."TipoDocumento" (id, numero, nombre, disponible) VALUES
  (1, 1, 'Factura', true)
ON CONFLICT (id) DO UPDATE SET
  numero = EXCLUDED.numero,
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible;

INSERT INTO public."RangoEmision" (id, inicio, fin) VALUES
  (1, 1, 99999999)
ON CONFLICT (id) DO UPDATE SET
  inicio = EXCLUDED.inicio,
  fin = EXCLUDED.fin;

INSERT INTO public."Cai" (id, codigo, fecha_inicio, fecha_fin, activo) VALUES
  (1, 'CAI-DEMO-2026-0001', '2026-01-01 00:00:00', '2027-01-01 00:00:00', true)
ON CONFLICT (id) DO UPDATE SET
  codigo = EXCLUDED.codigo,
  fecha_inicio = EXCLUDED.fecha_inicio,
  fecha_fin = EXCLUDED.fecha_fin,
  activo = EXCLUDED.activo;

-- 2) Estructura de facturacion
INSERT INTO public."Establecimiento" (id, numero, "tipoDocumentoId", "sucursalId") VALUES
  (1, 1, 1, 2)
ON CONFLICT (id) DO UPDATE SET
  numero = EXCLUDED.numero,
  "tipoDocumentoId" = EXCLUDED."tipoDocumentoId",
  "sucursalId" = EXCLUDED."sucursalId";

INSERT INTO public."PuntoEmision" (id, numero, "tipoDocumentoId", "establecimientoId", "rangoEmisionId") VALUES
  (1, 1, 1, 1, 1)
ON CONFLICT (id) DO UPDATE SET
  numero = EXCLUDED.numero,
  "tipoDocumentoId" = EXCLUDED."tipoDocumentoId",
  "establecimientoId" = EXCLUDED."establecimientoId",
  "rangoEmisionId" = EXCLUDED."rangoEmisionId";

INSERT INTO public."NumeroFactura" (id, numero_formateado, correlativo, usado, "tipoDocumentoId", "establecimientoId", "puntoEmisionId", "caiId") VALUES
  (1, '001-001-01-00000001', 1, true, 1, 1, 1, 1)
ON CONFLICT (id) DO UPDATE SET
  numero_formateado = EXCLUDED.numero_formateado,
  correlativo = EXCLUDED.correlativo,
  usado = EXCLUDED.usado,
  "tipoDocumentoId" = EXCLUDED."tipoDocumentoId",
  "establecimientoId" = EXCLUDED."establecimientoId",
  "puntoEmisionId" = EXCLUDED."puntoEmisionId",
  "caiId" = EXCLUDED."caiId";

-- 3) Cliente y proveedor
INSERT INTO public."Cliente" (id, nombre_completo, identificacion, telefono, correo, direccion, "tipoClienteId") VALUES
  (1, 'Cliente Demo', '0801199000001', '9999-0001', 'cliente.demo@correo.com', 'Tegucigalpa', 1)
ON CONFLICT (id) DO UPDATE SET
  nombre_completo = EXCLUDED.nombre_completo,
  identificacion = EXCLUDED.identificacion,
  telefono = EXCLUDED.telefono,
  correo = EXCLUDED.correo,
  direccion = EXCLUDED.direccion,
  "tipoClienteId" = EXCLUDED."tipoClienteId";

INSERT INTO public."Proveedor" (id, nombre, telefono, correo, direccion, disponible) VALUES
  (1, 'Proveedor Demo', '2222-0000', 'proveedor.demo@correo.com', 'Comayaguela', true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono,
  correo = EXCLUDED.correo,
  direccion = EXCLUDED.direccion,
  disponible = EXCLUDED.disponible;

-- 4) Configuracion contable
INSERT INTO public."ConfiguracionContable" (id, metodo_valuacion, moneda_funcional) VALUES
  (1, 'FIFO', 'HNL')
ON CONFLICT (id) DO UPDATE SET
  metodo_valuacion = EXCLUDED.metodo_valuacion,
  moneda_funcional = EXCLUDED.moneda_funcional;

-- 5) Relacion producto-proveedor (tabla mapeada producto_proveedor)
INSERT INTO public.producto_proveedor ("productoId", "proveedorId") VALUES
  (1, 1),
  (2, 1)
ON CONFLICT ("productoId", "proveedorId") DO NOTHING;

-- 6) Venta y detalle
INSERT INTO public."Venta" (id, total, estado, created_at, "clienteId", "usuarioId", "sucursalId") VALUES
  (1, 175.00, 'completada', '2026-03-11 10:00:00', 1, 2, 2)
ON CONFLICT (id) DO UPDATE SET
  total = EXCLUDED.total,
  estado = EXCLUDED.estado,
  created_at = EXCLUDED.created_at,
  "clienteId" = EXCLUDED."clienteId",
  "usuarioId" = EXCLUDED."usuarioId",
  "sucursalId" = EXCLUDED."sucursalId";

INSERT INTO public."DetalleVenta" (id, cantidad, precio_unitario, subtotal, "ventaId", "productoId") VALUES
  (1, 1, 80.00, 80.00, 1, 1),
  (2, 1, 95.00, 95.00, 1, 2)
ON CONFLICT (id) DO UPDATE SET
  cantidad = EXCLUDED.cantidad,
  precio_unitario = EXCLUDED.precio_unitario,
  subtotal = EXCLUDED.subtotal,
  "ventaId" = EXCLUDED."ventaId",
  "productoId" = EXCLUDED."productoId";

-- 7) Factura
INSERT INTO public."Factura" (id, subtotal, impuesto, total, fecha_emision, "numeroFacturaId", "ventaId", "clienteId", "usuarioId", "sucursalId") VALUES
  (1, 175.00, 26.25, 201.25, '2026-03-11 10:05:00', 1, 1, 1, 2, 2)
ON CONFLICT (id) DO UPDATE SET
  subtotal = EXCLUDED.subtotal,
  impuesto = EXCLUDED.impuesto,
  total = EXCLUDED.total,
  fecha_emision = EXCLUDED.fecha_emision,
  "numeroFacturaId" = EXCLUDED."numeroFacturaId",
  "ventaId" = EXCLUDED."ventaId",
  "clienteId" = EXCLUDED."clienteId",
  "usuarioId" = EXCLUDED."usuarioId",
  "sucursalId" = EXCLUDED."sucursalId";

-- 8) Movimiento de inventario (esquema actual: requiere stock_resultante y fecha_movimiento)
INSERT INTO public."MovimientoInventario" (
  id, tipo, subtipo_entrada, motivo_salida, detalle_motivo, observaciones,
  cantidad, stock_resultante, fecha_movimiento, estado, referencia_tipo, referencia_id,
  created_at, "productoId", "sucursalId", "usuarioId", "proveedorId"
) VALUES
  (1, 'entrada', 'PRODUCTO_NUEVO', NULL, NULL, 'Ingreso inicial por carga semilla',
   10, 10, '2026-03-11 09:00:00', 'completado', 'SEED', 1,
   '2026-03-11 09:00:00', 1, 2, 2, 1),
  (2, 'salida', NULL, 'VENTA', NULL, 'Salida por venta demo',
   1, 9, '2026-03-11 10:00:00', 'completado', 'VENTA', 1,
   '2026-03-11 10:00:00', 1, 2, 2, NULL)
ON CONFLICT (id) DO UPDATE SET
  tipo = EXCLUDED.tipo,
  subtipo_entrada = EXCLUDED.subtipo_entrada,
  motivo_salida = EXCLUDED.motivo_salida,
  detalle_motivo = EXCLUDED.detalle_motivo,
  observaciones = EXCLUDED.observaciones,
  cantidad = EXCLUDED.cantidad,
  stock_resultante = EXCLUDED.stock_resultante,
  fecha_movimiento = EXCLUDED.fecha_movimiento,
  estado = EXCLUDED.estado,
  referencia_tipo = EXCLUDED.referencia_tipo,
  referencia_id = EXCLUDED.referencia_id,
  created_at = EXCLUDED.created_at,
  "productoId" = EXCLUDED."productoId",
  "sucursalId" = EXCLUDED."sucursalId",
  "usuarioId" = EXCLUDED."usuarioId",
  "proveedorId" = EXCLUDED."proveedorId";

-- 9) Ajuste de secuencias
SELECT setval('public."TipoCliente_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."TipoCliente"), true);
SELECT setval('public."TipoDocumento_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."TipoDocumento"), true);
SELECT setval('public."RangoEmision_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."RangoEmision"), true);
SELECT setval('public."Cai_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Cai"), true);
SELECT setval('public."Establecimiento_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Establecimiento"), true);
SELECT setval('public."PuntoEmision_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."PuntoEmision"), true);
SELECT setval('public."NumeroFactura_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."NumeroFactura"), true);
SELECT setval('public."Cliente_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Cliente"), true);
SELECT setval('public."Proveedor_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Proveedor"), true);
SELECT setval('public."ConfiguracionContable_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."ConfiguracionContable"), true);
SELECT setval('public."Venta_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Venta"), true);
SELECT setval('public."DetalleVenta_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."DetalleVenta"), true);
SELECT setval('public."Factura_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Factura"), true);
SELECT setval('public."MovimientoInventario_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."MovimientoInventario"), true);

COMMIT;
