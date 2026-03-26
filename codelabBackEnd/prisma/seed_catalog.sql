BEGIN;

INSERT INTO "ELEMENTO_CONTABLE" (id_elemento_contable, uuid_elemento_contable, nombre, disponible, codigo_numerico, id_naturaleza) VALUES
  (1, 'elem-activos-0001', 'Activos', true, 1, 1),
  (2, 'elem-pasivos-0002', 'Pasivos', true, 2, 2),
  (3, 'elem-patrimonio-0003', 'Patrimonio', true, 3, 3)
ON CONFLICT (uuid_elemento_contable) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible,
  codigo_numerico = EXCLUDED.codigo_numerico,
  id_naturaleza = EXCLUDED.id_naturaleza;

INSERT INTO "CLASIFICACION_ELEMENTO_CONTABLE" (id_clasificacion_elemento_contable, uuid_clasificacion_contable, nombre, disponible, codigo_numerico, uuid_elemento_contable) VALUES
  (1, 'clas-corrientes-0001', 'Corrientes', true, 1, 'elem-activos-0001'),
  (2, 'clas-no-corrientes-0002', 'No Corrientes', true, 2, 'elem-activos-0001'),
  (3, 'clas-corrientes-pasivos-0003', 'Corrientes', true, 1, 'elem-pasivos-0002'),
  (4, 'clas-capital-0004', 'Capital', true, 1, 'elem-patrimonio-0003')
ON CONFLICT (uuid_clasificacion_contable) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible,
  codigo_numerico = EXCLUDED.codigo_numerico,
  uuid_elemento_contable = EXCLUDED.uuid_elemento_contable;

INSERT INTO "CUENTA_CONTABLE" (id_cuenta_contable, uuid_cuenta_contable, nombre, disponible, uuid_elemento_contable, uuid_clasificacion_contable, codigo_numerico, id_naturaleza) VALUES
  (1, 'cta-efectivo-equiv-0001', 'Efectivo y Equivalentes', true, 'elem-activos-0001', 'clas-corrientes-0001', 1, 1),
  (2, 'cta-cuentas-cobrar-0002', 'Cuentas por Cobrar', true, 'elem-activos-0001', 'clas-corrientes-0001', 2, 1),
  (3, 'cta-ctas-doc-pagar-0003', 'Cuentas y Documentos por Pagar', true, 'elem-pasivos-0002', 'clas-corrientes-pasivos-0003', 3, 2),
  (4, 'cta-capital-social-0004', 'Capital Social', true, 'elem-patrimonio-0003', 'clas-capital-0004', 4, 3)
ON CONFLICT (uuid_cuenta_contable) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible,
  uuid_elemento_contable = EXCLUDED.uuid_elemento_contable,
  uuid_clasificacion_contable = EXCLUDED.uuid_clasificacion_contable,
  codigo_numerico = EXCLUDED.codigo_numerico,
  id_naturaleza = EXCLUDED.id_naturaleza;

INSERT INTO "SUB_CUENTA_CONTABLE" (id_sub_cuenta_contable, uuid_sub_cuenta_contable, nombre, disponible, uuid_elemento_contable, uuid_clasificacion_contable, uuid_cuenta_contable, codigo_numerico, id_naturaleza) VALUES
  (1, 'subcta-caja-general-001', 'Caja General', true, 'elem-activos-0001', 'clas-corrientes-0001', 'cta-efectivo-equiv-0001', 1, 1),
  (2, 'subcta-caja-chica-002', 'Caja Chica', true, 'elem-activos-0001', 'clas-corrientes-0001', 'cta-efectivo-equiv-0001', 2, 1),
  (3, 'subcta-bancos-003', 'Bancos', true, 'elem-activos-0001', 'clas-corrientes-0001', 'cta-efectivo-equiv-0001', 3, 1),
  (4, 'subcta-prov-nacionales-004', 'Proveedores Nacionales', true, 'elem-pasivos-0002', 'clas-corrientes-pasivos-0003', 'cta-ctas-doc-pagar-0003', 1, 2),
  (5, 'subcta-prov-extranjeros-005', 'Proveedores Extranjeros', true, 'elem-pasivos-0002', 'clas-corrientes-pasivos-0003', 'cta-ctas-doc-pagar-0003', 2, 2),
  (6, 'subcta-capital-autorizado-006', 'Capital Autorizado', true, 'elem-patrimonio-0003', 'clas-capital-0004', 'cta-capital-social-0004', 1, 3)
ON CONFLICT (uuid_sub_cuenta_contable) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  disponible = EXCLUDED.disponible,
  uuid_elemento_contable = EXCLUDED.uuid_elemento_contable,
  uuid_clasificacion_contable = EXCLUDED.uuid_clasificacion_contable,
  uuid_cuenta_contable = EXCLUDED.uuid_cuenta_contable,
  codigo_numerico = EXCLUDED.codigo_numerico,
  id_naturaleza = EXCLUDED.id_naturaleza;

SELECT setval('"ELEMENTO_CONTABLE_id_elemento_contable_seq"',
  COALESCE((SELECT MAX(id_elemento_contable) FROM "ELEMENTO_CONTABLE"), 1),
  COALESCE((SELECT MAX(id_elemento_contable) IS NOT NULL FROM "ELEMENTO_CONTABLE"), false)
);
SELECT setval('"CLASIFICACION_ELEMENTO_CONTAB_id_clasificacion_elemento_con_seq"',
  COALESCE((SELECT MAX(id_clasificacion_elemento_contable) FROM "CLASIFICACION_ELEMENTO_CONTABLE"), 1),
  COALESCE((SELECT MAX(id_clasificacion_elemento_contable) IS NOT NULL FROM "CLASIFICACION_ELEMENTO_CONTABLE"), false)
);
SELECT setval('"CUENTA_CONTABLE_id_cuenta_contable_seq"',
  COALESCE((SELECT MAX(id_cuenta_contable) FROM "CUENTA_CONTABLE"), 1),
  COALESCE((SELECT MAX(id_cuenta_contable) IS NOT NULL FROM "CUENTA_CONTABLE"), false)
);
SELECT setval('"SUB_CUENTA_CONTABLE_id_sub_cuenta_contable_seq"',
  COALESCE((SELECT MAX(id_sub_cuenta_contable) FROM "SUB_CUENTA_CONTABLE"), 1),
  COALESCE((SELECT MAX(id_sub_cuenta_contable) IS NOT NULL FROM "SUB_CUENTA_CONTABLE"), false)
);

COMMIT;
