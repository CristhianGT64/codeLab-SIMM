BEGIN;

-- 1) Tablas base sin dependencias
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
  (10, 'Movimiento Inventario', true)
ON CONFLICT (id) DO UPDATE SET
  "nombreCategoria" = EXCLUDED."nombreCategoria",
  disponible = EXCLUDED.disponible;

INSERT INTO public."Categoria" (id, nombre, descripcion, disponible) VALUES
  (1, 'Ropa', 'Descripcion actualizada', true),
  (2, 'Deportivo', 'Descripcion actualizada', true),
  (3, 'Calzado', 'Categoria creada para prueba API', true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  disponible = EXCLUDED.disponible;

INSERT INTO public."Rol" (id, nombre, descripcion, disponible, created_at) VALUES
  (1, 'Administrador', 'Acceso completo a todas las funciones del sistema', true, '2026-02-26 19:18:21.716'),
  (2, 'Empleado', 'Acceso completo', true, NULL),
  (4, 'Editor', 'Acceso completo', true, NULL),
  (5, 'Cajero', 'Venta de productos', true, NULL),
  (9, 'Rol', 'Rol nuevo con permisos', true, NULL),
  (10, 'Visualizador', 'Este rol solo permite visualizar el sistema, no permite hacer acciones concretas.', true, NULL)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  disponible = EXCLUDED.disponible,
  created_at = EXCLUDED.created_at;

INSERT INTO public."Sucursal" (id, nombre, direccion, telefono, gerente, activa, created_at, "updatedAt") VALUES
  (2, 'Sucursal Centro', 'Tegucigalpa', '2222-2222', 'Gerente 1', true, '2026-03-04 07:36:50.837', '2026-03-09 06:07:41.22'),
  (3, 'Sucursal norte', 'col. santafe segunda calle detras de banco banpais', '99999888', 'Cristhian', true, '2026-03-05 00:08:45.384', '2026-03-09 06:07:44.682')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  direccion = EXCLUDED.direccion,
  telefono = EXCLUDED.telefono,
  gerente = EXCLUDED.gerente,
  activa = EXCLUDED.activa,
  created_at = EXCLUDED.created_at,
  "updatedAt" = EXCLUDED."updatedAt";

-- 2) Dependientes de CategoriaPermiso
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
  (39, 'Registrar Entradas', 'Permite al usuario registrar entradas de los productos', true, NULL, 10)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  disponible = EXCLUDED.disponible,
  created_at = EXCLUDED.created_at,
  "categoriaId" = EXCLUDED."categoriaId";

-- 3) Relación Rol-Permiso
INSERT INTO public."RolPermiso" ("rolId", "permisoId") VALUES
  (9, 1), (9, 5), (9, 15), (9, 14), (9, 2), (9, 4),
  (1, 1), (1, 2), (1, 4), (1, 15), (1, 5), (1, 14), (1, 21),
  (1, 22), (1, 23), (1, 24), (1, 25), (1, 26), (1, 27), (1, 28),
  (1, 29), (1, 30), (1, 31), (1, 32), (1, 33), (1, 34), (1, 35), (1, 36), (1, 37), (1, 38), (1, 39),
  (10, 25), (10, 21), (10, 26)
ON CONFLICT ("rolId", "permisoId") DO NOTHING;

-- 4) Usuarios (depende de Rol y Sucursal)
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

-- 4.1) Expansion aditiva de catalogos base (sin reemplazar existentes)
INSERT INTO public."CategoriaPermiso" (id, "nombreCategoria", disponible) VALUES
  (100, 'Proveedores', true),
  (101, 'Auditoria', true)
ON CONFLICT DO NOTHING;

INSERT INTO public."Categoria" (id, nombre, descripcion, disponible) VALUES
  (100, 'Accesorios', 'Accesorios de moda y temporada', true),
  (101, 'Electronica', 'Dispositivos y accesorios electronicos', true),
  (102, 'Higiene y Limpieza', 'Productos de higiene y limpieza', true)
ON CONFLICT DO NOTHING;

INSERT INTO public."Rol" (id, nombre, descripcion, disponible, created_at) VALUES
  (100, 'GerenteSucursal', 'Gestion de operaciones y reportes de sucursal', true, NOW()),
  (101, 'Contador', 'Gestion contable y revision de reportes financieros', true, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO public."Sucursal" (id, nombre, direccion, telefono, gerente, activa, created_at, "updatedAt") VALUES
  (100, 'Sucursal Occidente', 'Santa Rosa de Copan', '2444-0000', 'Gerente Occidente', true, NOW(), NOW()),
  (101, 'Sucursal Sur', 'Choluteca', '2881-0000', 'Gerente Sur', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 4.2) Expansion aditiva de permisos y asignaciones
INSERT INTO public."Permiso" (id, nombre, descripcion, disponible, created_at, "categoriaId") VALUES
  (100, 'Ver proveedores', 'Permite visualizar proveedores', true, NOW(), 100),
  (101, 'Crear proveedores', 'Permite crear proveedores', true, NOW(), 100),
  (102, 'Editar proveedores', 'Permite editar proveedores', true, NOW(), 100),
  (103, 'Exportar reportes', 'Permite exportar reportes en PDF o Excel', true, NOW(), 6),
  (104, 'Ver auditoria', 'Permite consultar bitacoras de auditoria', true, NOW(), 101),
  (105, 'Gestionar auditoria', 'Permite administrar eventos de auditoria', true, NOW(), 101)
ON CONFLICT DO NOTHING;

INSERT INTO public."RolPermiso" ("rolId", "permisoId") VALUES
  (100, 100),
  (100, 101),
  (100, 102),
  (100, 103),
  (100, 104),
  (101, 103),
  (101, 104),
  (101, 105)
ON CONFLICT DO NOTHING;

-- 5) Productos e inventario
INSERT INTO public."Producto" (id, nombre, sku, costo, precio_venta, unidad_medida, estado, created_at, updated_at, "categoriaId", imagen_path, imagen_url) VALUES
  (1, 'Camisa', 'SKU-SIN-IMG-1772835798', 50.00, 80.00, 'Unidad', 'activo', NULL, NULL, 3, NULL, NULL),
  (2, 'Pantalon', 'SKU-CON-IMG-1772835799', 60.00, 95.00, 'Unidad', 'activo', NULL, NULL, 3, '/uploads/productos/captura-de-(38)-1772862445275.png', NULL),
  (3, 'Tenis', 'SKU-POSTMAN-022', 100.00, 150.00, 'Unidad', 'activo', NULL, NULL, 3, NULL, NULL),
  (4, 'Calcetines', 'SKU-POSTMAN-02s3', 120.50, 180.00, 'Caja', 'activo', NULL, NULL, 3, '/uploads/productos/diagrama-sin-tã­tulo.drawio-1772836057412.png', NULL),
  (5, 'Producto fdgdgf', 'skux', 100.00, 150.00, 'Unidad', 'activo', NULL, NULL, 3, NULL, NULL),
  (6, 'Producto actualizado', 'CAM-23', 120.50, 180.00, 'Caja', 'activo', NULL, NULL, 3, NULL, NULL),
  (7, 'Producto', 'OLI-901', 700.00, 900.00, 'Unidad', 'activo', NULL, NULL, 2, NULL, NULL),
  (8, 'Camisa Barca', 'BAR-90', 800.00, 1000.00, 'Unidad', 'activo', NULL, NULL, 2, NULL, NULL),
  (9, 'Camisa Marathon', 'MA-700', 900.00, 2000.00, 'Docena', 'activo', NULL, NULL, 2, '/uploads/productos/captura-de-(2)-1772862417128.png', NULL),
  (10, 'Buzo azul', 'BUZ-400', 1600.00, 3000.00, 'Paquete', 'activo', NULL, NULL, 3, '/uploads/productos/captura-de-(129)-1772863288037.png', NULL)
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
  imagen_path = EXCLUDED.imagen_path,
  imagen_url = EXCLUDED.imagen_url;

INSERT INTO public."Inventario" (id, stock_actual, "productoId", "sucursalId") VALUES
  (1, 7, 1, 2),
  (2, 9, 2, 2),
  (3, 10, 3, 2),
  (4, 10, 4, 2),
  (5, 10, 5, 2),
  (6, 700, 6, 2),
  (7, 6, 7, 2),
  (8, 30, 8, 3),
  (9, 90, 9, 2),
  (10, 9, 10, 3)
ON CONFLICT (id) DO UPDATE SET
  stock_actual = EXCLUDED.stock_actual,
  "productoId" = EXCLUDED."productoId",
  "sucursalId" = EXCLUDED."sucursalId";

-- 6) Ajuste de secuencias para evitar choques de IDs
SELECT setval('public."CategoriaPermiso_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."CategoriaPermiso"), true);
SELECT setval('public."Categoria_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Categoria"), true);
SELECT setval('public."Rol_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Rol"), true);
SELECT setval('public."Sucursal_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Sucursal"), true);
SELECT setval('public."Permiso_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Permiso"), true);
SELECT setval('public."Usuario_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Usuario"), true);
SELECT setval('public."Producto_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Producto"), true);
SELECT setval('public."Inventario_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM public."Inventario"), true);

-- Período contable cerrado para pruebas de la regla: no se puede cambiar método si existen períodos cerrados
INSERT INTO public.periodo_contable (id, fecha_inicio, fecha_fin, estado, created_at) VALUES
  (1, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 'CERRADO', NOW())
ON CONFLICT (id) DO UPDATE SET
  fecha_inicio = EXCLUDED.fecha_inicio,
  fecha_fin    = EXCLUDED.fecha_fin,
  estado       = EXCLUDED.estado;

SELECT setval('public.periodo_contable_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.periodo_contable), true);

COMMIT;
