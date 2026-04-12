BEGIN;

-- Seed generado a partir del dump 26-03-2026.sql
-- Ejecutar antes que el seed de negocio.

-- 1) Catálogos base y seguridad
INSERT INTO public."CategoriaPermiso" (id, "nombreCategoria", disponible) VALUES
  (1, 'Productos', true),
  (2, 'Clientes', true),
  (3, 'Usuarios', true),
  (4, 'Sucursales', true),
  (5, 'Configuración', true),
  (6, 'Reportes', true),
  (7, 'Ventas', true),
  (8, 'Facturacion', true),
  (9, 'Roles/Permisos', true),
  (10, 'Movimiento Inventario', true),
  (100, 'Proveedores', true),
  (101, 'Auditoria', true),
  (102, 'Facturacion', true),
  (103, 'Inventario', true),
  (104, 'Configuracion Contable', true),
  (105, 'Contabilidad', true)
ON CONFLICT (id) DO UPDATE SET
  "nombreCategoria" = EXCLUDED."nombreCategoria",
  disponible = EXCLUDED.disponible;

INSERT INTO public."Categoria" (id, nombre, descripcion, disponible) VALUES
  (1, 'Ropa', 'Descripcion actualizada', true),
  (2, 'Deportivo', 'Descripcion actualizada', true),
  (3, 'Calzado', 'Categoria creada para prueba API', true),
  (100, 'Accesorios', 'Accesorios de moda y temporada', true),
  (101, 'Electronica', 'Dispositivos y accesorios electronicos', true),
  (102, 'Higiene y Limpieza', 'Productos de higiene y limpieza', true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  disponible = EXCLUDED.disponible;

INSERT INTO public."Rol" (id, nombre, descripcion, disponible, created_at) VALUES
  (1, 'Administrador', 'Acceso completo a todas las funciones del sistema', true, '2026-02-26 19:18:21.716'),
  (10, 'Visualizador', 'Este rol solo permite visualizar el sistema, no permite hacer acciones concretas.', true, NULL),
  (101, 'Contador', 'Gestion contable y revision de reportes financieros', false, '2026-03-17 07:40:38.827'),
  (100, 'GerenteSucursal', 'Gestion de operaciones y reportes de sucursal', false, '2026-03-17 07:40:38.827'),
  (5, 'Cajero', 'Venta de productos', false, NULL),
  (9, 'Rol', 'Rol nuevo con permisos', false, NULL),
  (2, 'Empleado', 'Acceso completo', false, NULL),
  (4, 'Editor', 'Acceso completo', false, NULL)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  disponible = EXCLUDED.disponible,
  created_at = EXCLUDED.created_at;

INSERT INTO public."Sucursal" (id, nombre, direccion, telefono, gerente, activa, created_at, "updatedAt") VALUES
  (2, 'Sucursal Centro', 'Tegucigalpa', '2222-2222', 'Gerente 1', true, '2026-03-04 07:36:50.837', '2026-03-09 06:07:41.22')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  direccion = EXCLUDED.direccion,
  telefono = EXCLUDED.telefono,
  gerente = EXCLUDED.gerente,
  activa = EXCLUDED.activa,
  created_at = EXCLUDED.created_at,
  "updatedAt" = EXCLUDED."updatedAt";

-- 2) Permisos y asignaciones
INSERT INTO public."Permiso" (id, nombre, descripcion, disponible, created_at, "categoriaId") VALUES
  (1, 'Crear productos', 'Permite Crear productos', true, NULL, 1),
  (2, 'Editar productos', 'Permite Crear productos', true, NULL, 1),
  (4, 'Eliminar productos', 'Permite Eliminar Productos', true, NULL, 1),
  (5, 'Eliminar Usuarios', 'Eliminar usuarios', true, NULL, 3),
  (14, 'Deshabilitar Usuarios', 'Se puede Deshabilitar usuarios del sistema.', true, NULL, 3),
  (15, 'Revisar Facturas', 'Se podrá reimprimir las facturas', true, NULL, 8),
  (21, 'Ver usuarios', 'podra ver usuarios', true, NULL, 3),
  (22, 'Ver roles', 'Podra ver roles', true, NULL, 9),
  (23, 'Editar roles', 'Edicion de roles', true, NULL, 9),
  (24, 'Crear permisos', 'Permite crear permisos en el sistema', true, NULL, 9),
  (25, 'Ver productos', 'Permite al usuario ver los usuarios del sistema', true, NULL, 1),
  (26, 'Ver sucursales', 'Permite el usuario ver sucursales', true, NULL, 4),
  (27, 'Crear sucursales', 'Permite al usuario crear sucursales nuevas', true, NULL, 4),
  (28, 'Editar sucursales', 'Permite al usuario crear sucursales', true, NULL, 4),
  (29, 'Crear roles', 'Permite al usuarios crear nuevos roles', true, NULL, 9),
  (30, 'Crear usuarios', 'Permite al usuario crear usuarios en el sistema', true, NULL, 3),
  (31, 'Editar usuarios', 'Permite al usuario Editar usuarios', true, NULL, 3),
  (32, 'Eliminar usuarios', 'Permite al usuario eliminar un usuario', true, NULL, 3),
  (33, 'Eliminar roles', 'Permite al usuario Eliminar Roles', true, NULL, 9),
  (34, 'Movimientos inventario', 'Permite al usuario gestionar los movimientos del inventario', true, NULL, 10),
  (35, 'Salida inventario', 'Permite gestionar las salidas de inventario ya sea por venta u otros motivos.', true, NULL, 10),
  (36, 'Entrada inventario', 'Permite gestionar la entrada de inventarios, ya sea por surtido o nuevo ingreso', true, NULL, 10),
  (37, 'Eliminar Producto', 'Permite al usuario eliminar productos', true, NULL, 1),
  (38, 'Registrar Salidas', 'Permite al usuario registrar salidas de producto', true, NULL, 10),
  (39, 'Registrar Entradas', 'Permite al usuario registrar entradas de los productos', true, NULL, 10),
  (100, 'Ver proveedores', 'Permite visualizar proveedores', true, '2026-03-17 07:40:38.827', 100),
  (101, 'Crear proveedores', 'Permite crear proveedores', true, '2026-03-17 07:40:38.827', 100),
  (102, 'Editar proveedores', 'Permite editar proveedores', true, '2026-03-17 07:40:38.827', 100),
  (103, 'Exportar reportes', 'Permite exportar reportes en PDF o Excel', true, '2026-03-17 07:40:38.827', 6),
  (104, 'Ver auditoria', 'Permite consultar bitacoras de auditoria', true, '2026-03-17 07:40:38.827', 101),
  (105, 'Gestionar auditoria', 'Permite administrar eventos de auditoria', true, '2026-03-17 07:40:38.827', 101),
  (106, 'Facturacion', 'Permite al usuario ver la configuración sobre la facturación del sistema', true, NULL, 102),
  (107, 'Configuracion FIFO/Promedio', 'Permite configurar el tipo de valuación del sistema', true, NULL, 103),
  (108, 'Ver configuración CAI', 'Permite al usuario ver la configuración del CAI, así como agregar un nuevo CAI, ver el historial de estos.', true, NULL, 104),
  (109, 'Ver clientes', 'Permite ver los clientes', true, NULL, 2),
  (110, 'Crear clientes', 'Crear un nuevo cliente', true, NULL, 2),
  (111, 'Editar clientes', 'Editar clientes', true, NULL, 2),
  (112, 'Ver punto de ventas POS', 'Permite ver el POS para cotizaciones.', true, NULL, 7),
  (113, 'Finalizar Venta', 'Permite finalizar venta de productos en el carrito.', true, NULL, 7),
  (114, 'Ver tipos de documento', 'Permite ver los tipos de documentos de facturacion', true, NULL, 8),
  (115, 'Crear tipos de documento', 'Permite crear nuevos tipos de documento', true, NULL, 8),
  (116, 'Editar tipos de documento', 'Permite al usuario editar tipos de documentos', true, NULL, 8),
  (117, 'Ver cuentas contables', 'Permite ver el catálogo de cuentas contables', true, NULL, 104),
  (118, 'Crear cuentas contables', 'Permite crear elementos en el catálogo contable', true, NULL, 104),
  (119, 'Editar cuentas contables', 'Permite editar elementos del catálogo contable', true, NULL, 104)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  disponible = EXCLUDED.disponible,
  created_at = EXCLUDED.created_at,
  "categoriaId" = EXCLUDED."categoriaId";

UPDATE public."Permiso"
SET descripcion = 'Permite ver las cuentas contables',
    "categoriaId" = 105
WHERE id = 117;

UPDATE public."Permiso"
SET descripcion = 'Permite al usuario crear cuentas contables.',
    "categoriaId" = 104
WHERE id = 118;

UPDATE public."Permiso"
SET descripcion = 'Permite editar una cuenta contable',
    "categoriaId" = 104
WHERE id = 119;

INSERT INTO public."RolPermiso" ("rolId", "permisoId") VALUES
  (9, 1),
  (9, 5),
  (9, 15),
  (9, 14),
  (9, 2),
  (9, 4),
  (1, 1),
  (1, 2),
  (1, 4),
  (1, 15),
  (1, 5),
  (1, 14),
  (1, 21),
  (1, 22),
  (1, 23),
  (1, 24),
  (1, 25),
  (1, 26),
  (1, 27),
  (1, 28),
  (1, 29),
  (1, 30),
  (1, 31),
  (1, 32),
  (1, 33),
  (1, 34),
  (1, 35),
  (1, 36),
  (1, 37),
  (1, 38),
  (1, 39),
  (10, 25),
  (10, 21),
  (10, 26),
  (100, 100),
  (100, 101),
  (100, 102),
  (100, 103),
  (100, 104),
  (101, 103),
  (101, 104),
  (101, 105),
  (1, 100),
  (1, 101),
  (1, 102),
  (1, 106),
  (1, 104),
  (1, 105),
  (1, 107),
  (1, 103),
  (1, 108),
  (1, 109),
  (1, 110),
  (1, 111),
  (1, 112),
  (1, 113),
  (1, 114),
  (1, 115),
  (1, 116),
  (1, 117),
  (1, 118),
  (1, 119)
ON CONFLICT ("rolId", "permisoId") DO NOTHING;

-- 3) Usuarios
INSERT INTO public."Usuario" (id, nombre_completo, correo, password, estado, created_at, updated_at, "sucursalId", "rolId", eliminado, usuario) VALUES
  (1, 'Harold Coello', 'sampaz@simm.com', '$2b$10$Aht/J1mC6yhE2BTAN9O/1un9c3wewS.hVHld1FtFxfv2.H3pN2aMm', 'inactivo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, true, 'sampaz'),
  (2, 'Administrador', 'admin@gmail.com', '$2b$10$H9eHS2jsRPjZJxeQRxbSCOSbb0GVLs2SLp96f7wQW6s4EpXMV/MB6', 'activo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, false, 'Administrator'),
  (3, 'Nohelia Mondragon', 'nohe@simm.com', '$2b$10$qUJrAuIkSL759xFjGofWA.M4zhFGQMGljoGL9laTJF4qFqSaSSU8W', 'inactivo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, true, 'nohe'),
  (4, 'Nohelia Mondragon', 'nohe@simm3.com', '$2b$10$JHj0LDnhcXpNJDopjWOP0u/pNpbuZIRBsVXqZtQiGQc/PqzTj8F5.', 'activo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, false, 'nohe12'),
  (5, 'Angel Gabriel Martinez Baneges', 'angel@gmail.com', '$2b$10$ZwntBByQk/L17fcYBGJiXeUqgVc4oHW6X3rB690sMBgcdMMr7jTYi', 'activo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, false, 'Angel1234'),
  (6, 'Daniel Isaias Aguilar', 'danielaguilar307@gmail.com', '$2b$10$wzXnzTPn0d1Gn2nSr59xh.6pIVjh45AyuYu.39.tEo37fGz4jBNh.', 'activo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, false, 'daguilar'),
  (7, 'Leonel messi', 'mesi@fcb.com', '$2b$10$O9XxO1TOKLIOHaP350tmgOfR1oqcODGFWIPsPhvi6tLgJirZZhDDq', 'activo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, false, 'Administrador'),
  (8, 'Nohelia Mondragon', 'nohe@simmewew3.com', '$2b$10$d9gbnYWKRTW7A4stzZTf5.s9HE7DIgwppvXSTLfEiBvqP2Tke95ny', 'activo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 10, false, 'nohe123'),
  (9, 'Juan Martinez', 'hola@example.com', '$2b$10$Fs1xHVdwIwHrP3cu.VvDre5Cx8Z10HjjZ/W.5JAb64BbPU1LyWrbG', 'inactivo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, true, 'messi11'),
  (10, 'Jimey Eduardo Santos Ortega', 'etymoreno@gmail.com', '$2b$10$d4VhYtnbD3O3jRTNKJZrgOnAc0dlUjjtEVHlYBwPxdHbOxGDRbQmK', 'inactivo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, true, 'messi150'),
  (11, 'Jimey Eduardo Santos Hernandez', 'jimey.messi10@gmail.com', '$2b$10$G6yNPrvppfTC7nvOETi7peOe.twB8R5pB7DJYfHiyaiXRzSI/EysK', 'inactivo', '2026-03-04 15:30:00', '2026-03-04 15:30:00', 2, 1, true, 'jimyyy')
ON CONFLICT (id) DO UPDATE SET
  nombre_completo = EXCLUDED.nombre_completo,
  correo = EXCLUDED.correo,
  password = EXCLUDED.password,
  estado = EXCLUDED.estado,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at,
  "sucursalId" = EXCLUDED."sucursalId",
  "rolId" = EXCLUDED."rolId",
  eliminado = EXCLUDED.eliminado,
  usuario = EXCLUDED.usuario;

   ---Impuestos
  INSERT INTO public."Impuesto" (id, nombre, tasa, activo) VALUES
  (1, 'EXENTO', 0, true),
  (2, 'ISV 15%', 0.15, true),
  (3, 'ISV 18%', 0.18, true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  tasa = EXCLUDED.tasa,
  activo = EXCLUDED.activo;


-- 4) Productos e inventario
INSERT INTO public."Producto" (id, nombre, sku, costo, precio_venta, unidad_medida, estado, created_at, updated_at, "categoriaId", imagen_url, imagen_path) VALUES
  (1, 'Camisa', 'SKU-SIN-IMG-1772835798', 50.00, 80.00, 'Unidad', 'activo', NULL, NULL, 3, NULL, NULL),
  (2, 'Pantalon', 'SKU-CON-IMG-1772835799', 60.00, 95.00, 'Unidad', 'activo', NULL, NULL, 3, NULL, '/uploads/productos/captura-de-(38)-1772862445275.png'),
  (3, 'Tenis', 'SKU-POSTMAN-022', 100.00, 150.00, 'Unidad', 'activo', NULL, NULL, 3, NULL, NULL),
  (4, 'Calcetines', 'SKU-POSTMAN-02s3', 120.50, 180.00, 'Caja', 'activo', NULL, NULL, 3, NULL, '/uploads/productos/diagrama-sin-tã­tulo.drawio-1772836057412.png'),
  (5, 'Teclado', 'skux', 100.00, 150.00, 'Unidad', 'activo', NULL, NULL, 3, NULL, NULL),
  (6, 'Mouse', 'CAM-23', 120.50, 180.00, 'Caja', 'activo', NULL, NULL, 3, NULL, NULL),
  (7, 'Monitor LED 24', 'OLI-901', 700.00, 900.00, 'Unidad', 'activo', NULL, NULL, 2, NULL, NULL),
  (8, 'Camisa Barca', 'BAR-90', 800.00, 1000.00, 'Unidad', 'activo', NULL, NULL, 2, NULL, NULL),
  (9, 'Camisa Marathon', 'MA-700', 900.00, 2000.00, 'Docena', 'activo', NULL, NULL, 2, NULL, '/uploads/productos/captura-de-(2)-1772862417128.png'),
  (10, 'Buzo azul', 'BUZ-400', 1600.00, 3000.00, 'Paquete', 'activo', NULL, NULL, 3, NULL, '/uploads/productos/captura-de-(129)-1772863288037.png'),
  (100, 'Audifonos Bluetooth', 'AUDIO-BT-001', 85.00, 150.00, 'Unidad', 'activo', '2026-03-17 08:26:50.919', NULL, 101, NULL, NULL),
  (101, 'Jabon Antibacterial', 'SOAP-AB-002', 15.00, 28.00, 'Docena', 'activo', '2026-03-17 08:26:50.919', NULL, 102, NULL, NULL),
  (102, 'Gorro Deportivo', 'CAP-SPORT-001', 25.00, 45.00, 'Unidad', 'activo', '2026-03-17 08:26:50.919', NULL, 100, NULL, NULL),
  (103, 'Laptop Dell Inspiron', 'TECH-LAP-005', 1000.00, 1250.00, 'Unidad', 'activo', '2026-03-26 04:10:31.653', NULL, 1, NULL, NULL),
  (104, 'Zapatos Channel', 'ZP-600', 50.00, 100.00, 'Paquete', 'activo', '2026-03-26 04:16:14.309', NULL, 3, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  sku = EXCLUDED.sku,
  costo = EXCLUDED.costo,
  precio_venta = EXCLUDED.precio_venta,
  unidad_medida = EXCLUDED.unidad_medida,
  estado = EXCLUDED.estado,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at,
  "categoriaId" = EXCLUDED."categoriaId",
  imagen_url = EXCLUDED.imagen_url,
  imagen_path = EXCLUDED.imagen_path;

--
UPDATE public."Producto" SET "impuestoId" = 2 WHERE id IN (1,2,3,4,5,6,7,8,9,10,100,101,102,103,104);

-- Ejemplo de exento
UPDATE public."Producto" SET "impuestoId" = 1 WHERE id IN (101, 103);
UPDATE public."Producto" SET "impuestoId" = 3 WHERE id = 104;
INSERT INTO public."Inventario" (id, stock_actual, "productoId", "sucursalId") VALUES
  (1, 7, 1, 2),
  (2, 8, 2, 2),
  (3, 10, 3, 2),
  (4, 10, 4, 2),
  (5, 9, 5, 2),
  (6, 700, 6, 2),
  (7, 5, 7, 2),
  (8, 30, 8, 2),
  (9, 90, 9, 2),
  (10, 9, 10, 2),
  (11, 49, 100, 2),
  (12, 196, 101, 2),
  (13, 29, 102, 2),
  (14, 29, 103, 2),
  (15, 27, 104, 2)
ON CONFLICT (id) DO UPDATE SET
  stock_actual = EXCLUDED.stock_actual,
  "productoId" = EXCLUDED."productoId",
  "sucursalId" = EXCLUDED."sucursalId";

-- 5) Configuración y período contable
INSERT INTO public.configuracion_sistema (id, metodo_valuacion_inventario, moneda_funcional) VALUES
  (1, 'FIFO', 'HNL')
ON CONFLICT (id) DO UPDATE SET
  metodo_valuacion_inventario = EXCLUDED.metodo_valuacion_inventario,
  moneda_funcional = EXCLUDED.moneda_funcional;

-- 5b) Naturalezas contables
DELETE FROM public."SUB_CUENTA_CONTABLE";
DELETE FROM public."CUENTA_CONTABLE";
DELETE FROM public."CLASIFICACION_ELEMENTO_CONTABLE";
DELETE FROM public."ELEMENTO_CONTABLE";
DELETE FROM public."DICC_NATURALEZA_CUENTA";

INSERT INTO public."DICC_NATURALEZA_CUENTA" (id_naturaleza, uuid_naturaleza, nombre, codigo, disponible) VALUES
  (1, 'ACCREDORA0111', 'Acreedora', 'A', true),
  (2, 'DEDORA20034', 'Deudora', 'D', true)
ON CONFLICT (id_naturaleza) DO UPDATE SET
  uuid_naturaleza = EXCLUDED.uuid_naturaleza,
  nombre = EXCLUDED.nombre,
  codigo = EXCLUDED.codigo,
  disponible = EXCLUDED.disponible;

-- 5c) Catalogo de cuentas contables
-- Estructura usada: 1 digito elemento, 2 digitos clasificacion, 3 digitos cuenta, 4 digitos subcuenta.
INSERT INTO public."ELEMENTO_CONTABLE" (id_elemento_contable, uuid_elemento_contable, nombre, disponible, codigo_numerico, id_naturaleza) VALUES
  (1, 'elem-activo', 'Activo', true, 1, 2),
  (2, 'elem-pasivo', 'Pasivo', true, 2, 1),
  (3, 'elem-patrimonio', 'Patrimonio', true, 3, 1),
  (4, 'elem-ingresos', 'Ingresos', true, 4, 1),
  (5, 'elem-gastos', 'Gastos', true, 5, 2),
  (6, 'elem-costos', 'Costos', true, 6, 2)
ON CONFLICT (uuid_elemento_contable) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible,
  codigo_numerico = EXCLUDED.codigo_numerico,
  id_naturaleza = EXCLUDED.id_naturaleza;

INSERT INTO public."CLASIFICACION_ELEMENTO_CONTABLE" (id_clasificacion_elemento_contable, uuid_clasificacion_contable, nombre, disponible, codigo_numerico, uuid_elemento_contable) VALUES
  (1, 'clas-activo-corriente', 'Activo Corriente', true, 11, 'elem-activo'),
  (2, 'clas-activo-no-corriente', 'Activo No Corriente', true, 12, 'elem-activo'),
  (3, 'clas-pasivo-corriente', 'Pasivo Corriente', true, 21, 'elem-pasivo'),
  (4, 'clas-pasivo-no-corriente', 'Pasivo No Corriente', true, 22, 'elem-pasivo'),
  (5, 'clas-capital', 'Capital', true, 31, 'elem-patrimonio'),
  (6, 'clas-reservas', 'Reservas', true, 32, 'elem-patrimonio'),
  (7, 'clas-resultados-acumulados', 'Resultados Acumulados', true, 33, 'elem-patrimonio'),
  (8, 'clas-ingresos-operacionales', 'Ingresos Operacionales', true, 41, 'elem-ingresos'),
  (9, 'clas-ingresos-no-operacionales', 'Ingresos No Operacionales', true, 42, 'elem-ingresos'),
  (10, 'clas-gastos-administracion', 'Gastos de Administracion', true, 51, 'elem-gastos'),
  (11, 'clas-gastos-venta', 'Gastos de Venta', true, 52, 'elem-gastos'),
  (12, 'clas-gastos-financieros', 'Gastos Financieros', true, 53, 'elem-gastos'),
  (13, 'clas-costos-venta', 'Costos de Venta', true, 61, 'elem-costos'),
  (14, 'clas-costos-produccion', 'Costos de Produccion', true, 62, 'elem-costos')
ON CONFLICT (uuid_clasificacion_contable) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible,
  codigo_numerico = EXCLUDED.codigo_numerico,
  uuid_elemento_contable = EXCLUDED.uuid_elemento_contable;

INSERT INTO public."CUENTA_CONTABLE" (id_cuenta_contable, uuid_cuenta_contable, nombre, disponible, uuid_elemento_contable, uuid_clasificacion_contable, codigo_numerico, id_naturaleza) VALUES
  (1, 'cta-111-efectivo-equivalentes', 'Efectivo y Equivalentes', true, 'elem-activo', 'clas-activo-corriente', 111, 2),
  (2, 'cta-112-cuentas-cobrar', 'Cuentas por Cobrar', true, 'elem-activo', 'clas-activo-corriente', 112, 2),
  (3, 'cta-113-inventarios', 'Inventarios', true, 'elem-activo', 'clas-activo-corriente', 113, 2),
  (4, 'cta-114-impuestos-recuperar', 'Impuestos por Recuperar', true, 'elem-activo', 'clas-activo-corriente', 114, 2),
  (5, 'cta-115-pagos-anticipados', 'Pagos Anticipados', true, 'elem-activo', 'clas-activo-corriente', 115, 2),
  (6, 'cta-121-propiedad-planta-equipo', 'Propiedad, Planta y Equipo', true, 'elem-activo', 'clas-activo-no-corriente', 121, 2),
  (7, 'cta-122-intangibles', 'Activos Intangibles', true, 'elem-activo', 'clas-activo-no-corriente', 122, 2),
  (8, 'cta-211-cuentas-pagar', 'Cuentas por Pagar', true, 'elem-pasivo', 'clas-pasivo-corriente', 211, 1),
  (9, 'cta-212-obligaciones-laborales', 'Obligaciones Laborales', true, 'elem-pasivo', 'clas-pasivo-corriente', 212, 1),
  (10, 'cta-213-obligaciones-tributarias', 'Obligaciones Tributarias', true, 'elem-pasivo', 'clas-pasivo-corriente', 213, 1),
  (11, 'cta-221-prestamos-largo-plazo', 'Prestamos por Pagar a Largo Plazo', true, 'elem-pasivo', 'clas-pasivo-no-corriente', 221, 1),
  (12, 'cta-311-capital-social', 'Capital Social', true, 'elem-patrimonio', 'clas-capital', 311, 1),
  (13, 'cta-321-reservas-capital', 'Reservas de Capital', true, 'elem-patrimonio', 'clas-reservas', 321, 1),
  (14, 'cta-331-utilidades-acumuladas', 'Utilidades Acumuladas', true, 'elem-patrimonio', 'clas-resultados-acumulados', 331, 1),
  (15, 'cta-411-ventas', 'Ventas', true, 'elem-ingresos', 'clas-ingresos-operacionales', 411, 1),
  (16, 'cta-421-otros-ingresos', 'Otros Ingresos', true, 'elem-ingresos', 'clas-ingresos-no-operacionales', 421, 1),
  (17, 'cta-511-gastos-personal-admin', 'Gastos de Personal Administrativo', true, 'elem-gastos', 'clas-gastos-administracion', 511, 2),
  (18, 'cta-512-gastos-generales-admin', 'Gastos Generales de Administracion', true, 'elem-gastos', 'clas-gastos-administracion', 512, 2),
  (19, 'cta-521-gastos-comercializacion', 'Gastos de Comercializacion', true, 'elem-gastos', 'clas-gastos-venta', 521, 2),
  (20, 'cta-531-gastos-financieros', 'Gastos Financieros', true, 'elem-gastos', 'clas-gastos-financieros', 531, 2),
  (21, 'cta-611-costo-mercaderia-vendida', 'Costo de Mercaderia Vendida', true, 'elem-costos', 'clas-costos-venta', 611, 2),
  (22, 'cta-621-materia-prima', 'Materia Prima', true, 'elem-costos', 'clas-costos-produccion', 621, 2),
  (23, 'cta-622-mano-obra-directa', 'Mano de Obra Directa', true, 'elem-costos', 'clas-costos-produccion', 622, 2),
  (24, 'cta-623-costos-indirectos-fabricacion', 'Costos Indirectos de Fabricacion', true, 'elem-costos', 'clas-costos-produccion', 623, 2)
ON CONFLICT (uuid_cuenta_contable) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible,
  uuid_elemento_contable = EXCLUDED.uuid_elemento_contable,
  uuid_clasificacion_contable = EXCLUDED.uuid_clasificacion_contable,
  codigo_numerico = EXCLUDED.codigo_numerico,
  id_naturaleza = EXCLUDED.id_naturaleza;

INSERT INTO public."SUB_CUENTA_CONTABLE" (id_sub_cuenta_contable, uuid_sub_cuenta_contable, nombre, disponible, uuid_elemento_contable, uuid_clasificacion_contable, uuid_cuenta_contable, codigo_numerico, id_naturaleza) VALUES
  (1, 'subcta-1111-caja-general', 'Caja General', true, 'elem-activo', 'clas-activo-corriente', 'cta-111-efectivo-equivalentes', 1111, 2),
  (2, 'subcta-1112-bancos', 'Bancos', true, 'elem-activo', 'clas-activo-corriente', 'cta-111-efectivo-equivalentes', 1112, 2),
  (3, 'subcta-1113-caja-chica', 'Caja Chica', true, 'elem-activo', 'clas-activo-corriente', 'cta-111-efectivo-equivalentes', 1113, 2),
  (4, 'subcta-1121-clientes', 'Clientes', true, 'elem-activo', 'clas-activo-corriente', 'cta-112-cuentas-cobrar', 1121, 2),
  (5, 'subcta-1122-documentos-cobrar', 'Documentos por Cobrar', true, 'elem-activo', 'clas-activo-corriente', 'cta-112-cuentas-cobrar', 1122, 2),
  (6, 'subcta-1123-deudores-varios', 'Deudores Varios', true, 'elem-activo', 'clas-activo-corriente', 'cta-112-cuentas-cobrar', 1123, 2),
  (7, 'subcta-1131-inventario-mercaderias', 'Inventario de Mercaderias', true, 'elem-activo', 'clas-activo-corriente', 'cta-113-inventarios', 1131, 2),
  (8, 'subcta-1132-inventario-materia-prima', 'Inventario de Materia Prima', true, 'elem-activo', 'clas-activo-corriente', 'cta-113-inventarios', 1132, 2),
  (9, 'subcta-1141-isv-credito-fiscal', 'ISV Credito Fiscal', true, 'elem-activo', 'clas-activo-corriente', 'cta-114-impuestos-recuperar', 1141, 2),
  (10, 'subcta-1151-seguros-anticipado', 'Seguros Pagados por Anticipado', true, 'elem-activo', 'clas-activo-corriente', 'cta-115-pagos-anticipados', 1151, 2),
  (11, 'subcta-1152-alquileres-anticipado', 'Alquileres Pagados por Anticipado', true, 'elem-activo', 'clas-activo-corriente', 'cta-115-pagos-anticipados', 1152, 2),
  (12, 'subcta-1211-terrenos', 'Terrenos', true, 'elem-activo', 'clas-activo-no-corriente', 'cta-121-propiedad-planta-equipo', 1211, 2),
  (13, 'subcta-1212-edificios', 'Edificios', true, 'elem-activo', 'clas-activo-no-corriente', 'cta-121-propiedad-planta-equipo', 1212, 2),
  (14, 'subcta-1213-mobiliario-equipo', 'Mobiliario y Equipo', true, 'elem-activo', 'clas-activo-no-corriente', 'cta-121-propiedad-planta-equipo', 1213, 2),
  (15, 'subcta-1214-equipo-computacion', 'Equipo de Computacion', true, 'elem-activo', 'clas-activo-no-corriente', 'cta-121-propiedad-planta-equipo', 1214, 2),
  (16, 'subcta-1215-vehiculos', 'Vehiculos', true, 'elem-activo', 'clas-activo-no-corriente', 'cta-121-propiedad-planta-equipo', 1215, 2),
  (17, 'subcta-1221-software', 'Software', true, 'elem-activo', 'clas-activo-no-corriente', 'cta-122-intangibles', 1221, 2),
  (18, 'subcta-1222-marcas-patentes', 'Marcas y Patentes', true, 'elem-activo', 'clas-activo-no-corriente', 'cta-122-intangibles', 1222, 2),
  (19, 'subcta-2111-proveedores', 'Proveedores', true, 'elem-pasivo', 'clas-pasivo-corriente', 'cta-211-cuentas-pagar', 2111, 1),
  (20, 'subcta-2112-documentos-pagar', 'Documentos por Pagar', true, 'elem-pasivo', 'clas-pasivo-corriente', 'cta-211-cuentas-pagar', 2112, 1),
  (21, 'subcta-2113-acreedores-varios', 'Acreedores Varios', true, 'elem-pasivo', 'clas-pasivo-corriente', 'cta-211-cuentas-pagar', 2113, 1),
  (22, 'subcta-2121-sueldos-pagar', 'Sueldos por Pagar', true, 'elem-pasivo', 'clas-pasivo-corriente', 'cta-212-obligaciones-laborales', 2121, 1),
  (23, 'subcta-2122-prestaciones-pagar', 'Prestaciones por Pagar', true, 'elem-pasivo', 'clas-pasivo-corriente', 'cta-212-obligaciones-laborales', 2122, 1),
  (24, 'subcta-2131-isv-pagar', 'ISV por Pagar', true, 'elem-pasivo', 'clas-pasivo-corriente', 'cta-213-obligaciones-tributarias', 2131, 1),
  (25, 'subcta-2132-retenciones-pagar', 'Retenciones por Pagar', true, 'elem-pasivo', 'clas-pasivo-corriente', 'cta-213-obligaciones-tributarias', 2132, 1),
  (26, 'subcta-2211-prestamos-bancarios-lp', 'Prestamos Bancarios a Largo Plazo', true, 'elem-pasivo', 'clas-pasivo-no-corriente', 'cta-221-prestamos-largo-plazo', 2211, 1),
  (27, 'subcta-2212-hipotecas-pagar', 'Hipotecas por Pagar', true, 'elem-pasivo', 'clas-pasivo-no-corriente', 'cta-221-prestamos-largo-plazo', 2212, 1),
  (28, 'subcta-3111-capital-suscrito-pagado', 'Capital Suscrito y Pagado', true, 'elem-patrimonio', 'clas-capital', 'cta-311-capital-social', 3111, 1),
  (29, 'subcta-3112-aportes-socios', 'Aportaciones Adicionales de Socios', true, 'elem-patrimonio', 'clas-capital', 'cta-311-capital-social', 3112, 1),
  (30, 'subcta-3211-reserva-legal', 'Reserva Legal', true, 'elem-patrimonio', 'clas-reservas', 'cta-321-reservas-capital', 3211, 1),
  (31, 'subcta-3212-reserva-voluntaria', 'Reserva Voluntaria', true, 'elem-patrimonio', 'clas-reservas', 'cta-321-reservas-capital', 3212, 1),
  (32, 'subcta-3311-utilidades-anteriores', 'Utilidades de Ejercicios Anteriores', true, 'elem-patrimonio', 'clas-resultados-acumulados', 'cta-331-utilidades-acumuladas', 3311, 1),
  (33, 'subcta-3312-utilidad-ejercicio', 'Utilidad del Ejercicio', true, 'elem-patrimonio', 'clas-resultados-acumulados', 'cta-331-utilidades-acumuladas', 3312, 1),
  (34, 'subcta-4111-ventas-mercaderias', 'Ventas de Mercaderias', true, 'elem-ingresos', 'clas-ingresos-operacionales', 'cta-411-ventas', 4111, 1),
  (35, 'subcta-4112-ventas-servicios', 'Ventas de Servicios', true, 'elem-ingresos', 'clas-ingresos-operacionales', 'cta-411-ventas', 4112, 1),
  (36, 'subcta-4211-ingresos-financieros', 'Ingresos Financieros', true, 'elem-ingresos', 'clas-ingresos-no-operacionales', 'cta-421-otros-ingresos', 4211, 1),
  (37, 'subcta-4212-otros-ingresos', 'Otros Ingresos', true, 'elem-ingresos', 'clas-ingresos-no-operacionales', 'cta-421-otros-ingresos', 4212, 1),
  (38, 'subcta-5111-sueldos-admin', 'Sueldos Administrativos', true, 'elem-gastos', 'clas-gastos-administracion', 'cta-511-gastos-personal-admin', 5111, 2),
  (39, 'subcta-5112-bonificaciones-admin', 'Bonificaciones Administrativas', true, 'elem-gastos', 'clas-gastos-administracion', 'cta-511-gastos-personal-admin', 5112, 2),
  (40, 'subcta-5121-alquileres', 'Alquileres', true, 'elem-gastos', 'clas-gastos-administracion', 'cta-512-gastos-generales-admin', 5121, 2),
  (41, 'subcta-5122-servicios-publicos', 'Servicios Publicos', true, 'elem-gastos', 'clas-gastos-administracion', 'cta-512-gastos-generales-admin', 5122, 2),
  (42, 'subcta-5123-papeleria-utiles', 'Papeleria y Utiles', true, 'elem-gastos', 'clas-gastos-administracion', 'cta-512-gastos-generales-admin', 5123, 2),
  (43, 'subcta-5211-publicidad', 'Publicidad y Propaganda', true, 'elem-gastos', 'clas-gastos-venta', 'cta-521-gastos-comercializacion', 5211, 2),
  (44, 'subcta-5212-fletes-ventas', 'Fletes y Acarreos sobre Ventas', true, 'elem-gastos', 'clas-gastos-venta', 'cta-521-gastos-comercializacion', 5212, 2),
  (45, 'subcta-5213-comisiones-ventas', 'Comisiones sobre Ventas', true, 'elem-gastos', 'clas-gastos-venta', 'cta-521-gastos-comercializacion', 5213, 2),
  (46, 'subcta-5311-intereses-bancarios', 'Intereses Bancarios', true, 'elem-gastos', 'clas-gastos-financieros', 'cta-531-gastos-financieros', 5311, 2),
  (47, 'subcta-5312-comisiones-bancarias', 'Comisiones Bancarias', true, 'elem-gastos', 'clas-gastos-financieros', 'cta-531-gastos-financieros', 5312, 2),
  (48, 'subcta-6111-costo-mercaderias', 'Costo de Mercaderias', true, 'elem-costos', 'clas-costos-venta', 'cta-611-costo-mercaderia-vendida', 6111, 2),
  (49, 'subcta-6211-materia-prima-consumida', 'Materia Prima Consumida', true, 'elem-costos', 'clas-costos-produccion', 'cta-621-materia-prima', 6211, 2),
  (50, 'subcta-6221-mano-obra-directa', 'Mano de Obra Directa', true, 'elem-costos', 'clas-costos-produccion', 'cta-622-mano-obra-directa', 6221, 2),
  (51, 'subcta-6231-materiales-indirectos', 'Materiales Indirectos', true, 'elem-costos', 'clas-costos-produccion', 'cta-623-costos-indirectos-fabricacion', 6231, 2),
  (52, 'subcta-6232-servicios-produccion', 'Servicios de Produccion', true, 'elem-costos', 'clas-costos-produccion', 'cta-623-costos-indirectos-fabricacion', 6232, 2),
  (53, 'subcta-6112-perdida-inventario', 'Pérdida de Inventario', true, 'elem-costos', 'clas-costos-venta', 'cta-611-costo-mercaderia-vendida', 6112, 2),
  (54, 'subcta-6113-ajuste-inventario', 'Ajuste de Inventario', true, 'elem-costos', 'clas-costos-venta', 'cta-611-costo-mercaderia-vendida', 6113, 2),
  (55, 'subcta-5124-gastos-varios', 'Gastos Varios', true, 'elem-gastos', 'clas-gastos-administracion', 'cta-512-gastos-generales-admin', 5124, 2)
ON CONFLICT (uuid_sub_cuenta_contable) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible,
  uuid_elemento_contable = EXCLUDED.uuid_elemento_contable,
  uuid_clasificacion_contable = EXCLUDED.uuid_clasificacion_contable,
  uuid_cuenta_contable = EXCLUDED.uuid_cuenta_contable,
  codigo_numerico = EXCLUDED.codigo_numerico,
  id_naturaleza = EXCLUDED.id_naturaleza;

INSERT INTO public.periodo_contable (id, fecha_inicio, fecha_fin, estado, created_at, sucursal_id, fecha_cierre, usuario_cierre) VALUES
  (1, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 'CERRADO', '2026-03-17 07:40:38.827', 2, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  fecha_inicio = EXCLUDED.fecha_inicio,
  fecha_fin = EXCLUDED.fecha_fin,
  estado = EXCLUDED.estado,
  created_at = EXCLUDED.created_at,
  sucursal_id = EXCLUDED.sucursal_id,
  fecha_cierre = EXCLUDED.fecha_cierre,
  usuario_cierre = EXCLUDED.usuario_cierre;

-- Ajuste de secuencias
SELECT setval('public."CategoriaPermiso_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."CategoriaPermiso"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."CategoriaPermiso"), false)
);
SELECT setval('public."Categoria_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Categoria"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Categoria"), false)
);
SELECT setval('public."Rol_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Rol"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Rol"), false)
);
SELECT setval('public."Sucursal_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Sucursal"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Sucursal"), false)
);
SELECT setval('public."Permiso_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Permiso"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Permiso"), false)
);
SELECT setval('public."Usuario_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Usuario"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Usuario"), false)
);
SELECT setval('public."Producto_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Producto"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Producto"), false)
);
SELECT setval('public."Impuesto_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Impuesto"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Impuesto"), false)
);
SELECT setval('public."Inventario_id_seq"',
  COALESCE((SELECT MAX(id) FROM public."Inventario"), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public."Inventario"), false)
);
SELECT setval('public.configuracion_sistema_id_seq',
  COALESCE((SELECT MAX(id) FROM public.configuracion_sistema), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public.configuracion_sistema), false)
);
SELECT setval('public.periodo_contable_id_seq',
  COALESCE((SELECT MAX(id) FROM public.periodo_contable), 1),
  COALESCE((SELECT MAX(id) IS NOT NULL FROM public.periodo_contable), false)
);
SELECT setval('public."DICC_NATURALEZA_CUENTA_id_naturaleza_seq"',
  COALESCE((SELECT MAX(id_naturaleza) FROM public."DICC_NATURALEZA_CUENTA"), 1),
  COALESCE((SELECT MAX(id_naturaleza) IS NOT NULL FROM public."DICC_NATURALEZA_CUENTA"), false)
);
SELECT setval('public."ELEMENTO_CONTABLE_id_elemento_contable_seq"',
  COALESCE((SELECT MAX(id_elemento_contable) FROM public."ELEMENTO_CONTABLE"), 1),
  COALESCE((SELECT MAX(id_elemento_contable) IS NOT NULL FROM public."ELEMENTO_CONTABLE"), false)
);
SELECT setval('public."CLASIFICACION_ELEMENTO_CONTAB_id_clasificacion_elemento_con_seq"',
  COALESCE((SELECT MAX(id_clasificacion_elemento_contable) FROM public."CLASIFICACION_ELEMENTO_CONTABLE"), 1),
  COALESCE((SELECT MAX(id_clasificacion_elemento_contable) IS NOT NULL FROM public."CLASIFICACION_ELEMENTO_CONTABLE"), false)
);
SELECT setval('public."CUENTA_CONTABLE_id_cuenta_contable_seq"',
  COALESCE((SELECT MAX(id_cuenta_contable) FROM public."CUENTA_CONTABLE"), 1),
  COALESCE((SELECT MAX(id_cuenta_contable) IS NOT NULL FROM public."CUENTA_CONTABLE"), false)
);
SELECT setval('public."SUB_CUENTA_CONTABLE_id_sub_cuenta_contable_seq"',
  COALESCE((SELECT MAX(id_sub_cuenta_contable) FROM public."SUB_CUENTA_CONTABLE"), 1),
  COALESCE((SELECT MAX(id_sub_cuenta_contable) IS NOT NULL FROM public."SUB_CUENTA_CONTABLE"), false)
);

COMMIT;
