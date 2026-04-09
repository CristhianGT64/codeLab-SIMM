import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import productoController from './controllers/productoController.js';
import categoriaController from './controllers/categoriaController.js';
import sucursalController from './controllers/Sucursales/sucursalController.js';
import authController from './controllers/authController.js';
import usuarioController from './controllers/usuarioController.js';
import clientController from './controllers/Clientes/clientController.js';
import inventarioController from './controllers/inventarioController.js';
import proveedorController from './controllers/proveedorController.js';
import configuracionContableController from './controllers/configuracionContableController.js';
import caiController from './controllers/caiController.js';
import tipoDocumentoController from './controllers/Tipo de documento/tipoDocumentoController.js';

import elementoContableController from './controllers/elementoContableController.js';
import clasificacionElementoContableController from './controllers/clasificacionElementoContableController.js';
import cuentaContableController from './controllers/cuentaContableController.js';
import subCuentaContableController from './controllers/subCuentaContableController.js';
import diccNaturalezaCuentaController from './controllers/diccNaturalezaCuentaController.js';
import catalogoContableController from './controllers/catalogoContableController.js';
import asientoContableController from './controllers/contabilidad/asiento/asientoContableController.js';
import reglaContableController from './controllers/contabilidad/asiento/reglaContableController.js';
import periodoContableController from './controllers/periodoContableController.js';
import ajustesInventarioReportController from './controllers/reportes/ajustesInventarioReportController.js';

import * as roleController from './controllers/roleController.js';
import * as permissionCategoryController from './controllers/permissionCategoryController.js';
import * as permissionController from './controllers/permissionController.js';
import uploadProductoImage from './middlewares/uploadProductoImage.js';
import errorHandler from './shared/middlewares/errorHandler.js';
import * as invoiceTypeController from './controllers/invoiceTypeController.js';
import ventaController from './controllers/ventas/ventaController.js';
import facturaController from './controllers/facturaController.js';
import impuestoController from './controllers/impuestoController.js';
import tipoClienteController from './controllers/Tipos de cliente/tipoClienteController.js';
import { createSwaggerSpec } from './docs/swagger.js';

//Parche: convierte de BigInt a String para que lo soporte Json.
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const app = express();
dotenv.config();
const registeredRoutes = [];

['get', 'post', 'put', 'patch', 'delete'].forEach((method) => {
  const originalMethod = app[method].bind(app);

  app[method] = (routePath, ...handlers) => {
    if (typeof routePath === 'string' && handlers.length > 0) {
      registeredRoutes.push({
        method: method.toUpperCase(),
        path: routePath,
      });
    }

    return originalMethod(routePath, ...handlers);
  };
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manejo de CORS
const allowedOrigins = (process.env.allowedOrigins || process.env.ALLOWED_ORIGINS || '')
  .replace(/[\[\]']/g, '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const localDevOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const effectiveAllowedOrigins = allowedOrigins.length > 0 ? allowedOrigins : localDevOrigins;

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && effectiveAllowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'SIMM API' });
});

// Ruta de login
app.post('/auth/login', authController.login);

// Categorías Productos
app.get('/categorias', categoriaController.list);
app.get('/categorias/:id', categoriaController.getById);
app.post('/categorias', categoriaController.create);
app.put('/categorias/:id', categoriaController.update);
app.patch('/categorias/:id', categoriaController.patch);
app.delete('/categorias/:id', categoriaController.remove);

// Productos
app.get('/impuestos', impuestoController.list);
app.get('/configuracion/impuestos', impuestoController.list);
app.post('/configuracion/impuestos', impuestoController.create);
app.put('/configuracion/impuestos/:id', impuestoController.update);
app.get('/productos/unidades', productoController.unidades);
app.get('/productos/search', productoController.search);
app.post('/productos', uploadProductoImage.single('imagen'), productoController.create);
app.get('/productos', productoController.list);
app.get('/productos/:id', productoController.getById);
app.put('/productos/:id', uploadProductoImage.single('imagen'), productoController.update);
app.put('/productos/:id/stock-minimo', productoController.updateStockMinimo);
app.patch('/productos/:id', productoController.patch);
app.delete('/productos/:id', productoController.remove);

// Sucursales
app.post('/sucursales', sucursalController.createSucursal);
app.get('/sucursales', sucursalController.getAllSucursales);
app.get('/sucursales/:id', sucursalController.getSucursalById);
app.put('/sucursales/:id', sucursalController.updateSucursal);
app.patch('/sucursales/:id/estado', sucursalController.changeSucursalStatus);

// Proveedores
app.post('/proveedores', proveedorController.create);
app.get('/proveedores', proveedorController.list);
app.get('/proveedores/:id', proveedorController.getById);
app.put('/proveedores/:id', proveedorController.update);
app.patch('/proveedores/:id', proveedorController.patch);
app.delete('/proveedores/:id', proveedorController.remove);

// Inventario
app.get('/inventario/dashboard', inventarioController.dashboard);
app.get('/inventario/tipos-entrada', inventarioController.tiposEntrada);
app.get('/inventario/motivos-salida', inventarioController.motivosSalida);
app.post('/inventario/entrada', inventarioController.registrarEntrada);
app.post('/inventario/salida', inventarioController.registrarSalida);
app.get('/inventario/historial', inventarioController.historial);
app.get('/inventario/historial/:productoId', inventarioController.historialPorProducto);
app.get('/inventario/productos-bajo-stock', inventarioController.productosBajoStock);
app.get('/alertas/inventario', inventarioController.alertasInventario);

// Configuración método de inventario
app.get('/configuracion/metodo-inventario', configuracionContableController.getMetodoInventario);
app.put('/configuracion/metodo-inventario', configuracionContableController.updateMetodoInventario);
app.get('/configuracion/metodo-inventario/opciones', configuracionContableController.opciones);

// CAI
app.post('/cai', caiController.create);
app.get('/cai/lista', caiController.list);
app.get('/cai', caiController.getByIdOrLatest);

// Roles
app.get('/roles', roleController.getAll);
app.get('/roles/:id', roleController.getById);
app.post('/roles', roleController.create);
app.put('/roles/:id', roleController.update);
app.delete('/roles/:id', roleController.remove);

// Permission categories
app.post('/permission-categories', permissionCategoryController.create);
app.get('/permission-categories', permissionCategoryController.getAll);

// Permissions
app.post('/permissions', permissionController.create);
app.get('/permissions', permissionController.getAll);
app.put('/permissions/:id', permissionController.update);
app.delete('/permissions/:id', permissionController.remove);

// Role permissions
app.post('/roles/:id/permissions', roleController.assignPermissions);
app.put('/roles/:id/permissions', roleController.updatePermissions);
app.get('/roles/:id/permissions', roleController.getPermissions);

// Usuarios
app.post('/usuarios', usuarioController.create);
app.get('/usuarios', usuarioController.getAll);
app.get('/usuarios/roles', usuarioController.getUsersByRole);
app.get('/usuarios/:id', usuarioController.getById);
app.put('/usuarios/:id', usuarioController.update);
app.patch('/usuarios/:id/activo', usuarioController.activate);
app.patch('/usuarios/:id/inactivo', usuarioController.deactivate);
app.delete('/usuarios/:id', usuarioController.remove);

// Invoice Types
app.post('/invoice-types', invoiceTypeController.create);
app.get('/invoice-types', invoiceTypeController.getAll);
app.get('/invoice-types/:id', invoiceTypeController.getById);
app.put('/invoice-types/:id', invoiceTypeController.update);
app.patch('/invoice-types/:id/status', invoiceTypeController.updateStatus);

// Ventas
app.post('/ventas', ventaController.createVenta);
app.get('/ventas', ventaController.getVentas);
app.get('/ventas/:id', ventaController.getVentaById);

// Clientes
app.post('/clientes', clientController.createClient);
app.get('/clientes', clientController.getAllClients);
app.get('/clientes/:id', clientController.getClientById);
app.put('/clientes/:id', clientController.updateClient);

// Tipos de Cliente
app.post('/tipos-cliente', tipoClienteController.createtipodecliente);
app.get('/tipos-cliente', tipoClienteController.getAlltiposdecliente);
app.get('/tipos-cliente/:id', tipoClienteController.getByIdtiposdecliente);
app.put('/tipos-cliente/:id', tipoClienteController.updatetipodecliente);
app.patch('/tipos-cliente/:id/estado', tipoClienteController.cambiartipodeclienteEstado);

// Tipo de documento por establecimiento
app.get('/tipos-documento', tipoDocumentoController.getAllTiposDocumento);
app.get('/tipos-documento/:id', tipoDocumentoController.getTipoDocumentoById);
app.post('/tipos-documento', tipoDocumentoController.createTipoDocumento);
app.put('/tipos-documento/:id', tipoDocumentoController.updateTipoDocumento);
app.patch('/tipos-documento/:id/estado', tipoDocumentoController.changeTipoDocumentoStatus);

app.get('/establecimientos/:id/documentos', tipoDocumentoController.getDocumentosByEstablecimiento);
app.post('/establecimientos/:id/documentos', tipoDocumentoController.assignDocumentoToEstablecimiento);
app.patch('/establecimiento-documento/:id/estado', tipoDocumentoController.patchEstadoEstablecimientoDocumento);

// --- RUTAS DE FACTURAS ---
app.post('/facturas', facturaController.createFactura);
app.get('/facturas/exportar', facturaController.exportFacturas);
app.get('/facturas', facturaController.getFacturas);
app.get('/facturas/:numeroFactura', facturaController.getFacturaByNumero);

// =========================
// CATÁLOGO CONTABLE
// =========================

// Naturalezas contables
app.post('/naturalezas-contables', diccNaturalezaCuentaController.create);
app.get('/naturalezas-contables', diccNaturalezaCuentaController.list);
app.get('/naturalezas-contables/:id', diccNaturalezaCuentaController.getById);
app.put('/naturalezas-contables/:id', diccNaturalezaCuentaController.update);
app.patch('/naturalezas-contables/:id/estado', diccNaturalezaCuentaController.patch);

// Elementos contables
app.post('/elementos-contables', elementoContableController.create);
app.get('/elementos-contables', elementoContableController.list);
app.get('/elementos-contables/:id', elementoContableController.getById);
app.put('/elementos-contables/:id', elementoContableController.update);
app.patch('/elementos-contables/:id/estado', elementoContableController.patch);

// Clasificaciones contables
app.post('/clasificaciones-contables', clasificacionElementoContableController.create);
app.get('/clasificaciones-contables', clasificacionElementoContableController.list);
app.get('/clasificaciones-contables/:id', clasificacionElementoContableController.getById);
app.put('/clasificaciones-contables/:id', clasificacionElementoContableController.update);
app.patch('/clasificaciones-contables/:id/estado', clasificacionElementoContableController.patch);

// Cuentas contables
app.post('/cuentas-contables', cuentaContableController.create);
app.get('/cuentas-contables', cuentaContableController.list);
app.get('/cuentas-contables/:id', cuentaContableController.getById);
app.put('/cuentas-contables/:id', cuentaContableController.update);
app.patch('/cuentas-contables/:id/estado', cuentaContableController.patch);

// Subcuentas contables
app.post('/subcuentas-contables', subCuentaContableController.create);
app.get('/subcuentas-contables', subCuentaContableController.list);
app.get('/subcuentas-contables/:id', subCuentaContableController.getById);
app.put('/subcuentas-contables/:id', subCuentaContableController.update);
app.patch('/subcuentas-contables/:id/estado', subCuentaContableController.patch);

// Catálogo contable (árbol)
app.get('/catalogo-contable/arbol', catalogoContableController.arbol);
app.get('/catalogo-contable/resumen', catalogoContableController.resumen);

// =========================
// CONTABILIDAD
// =========================

// Asientos contables
app.get('/libro-diario/exportar', asientoContableController.export);
app.get('/libro-diario', asientoContableController.list);
app.get('/libro-diario/:id', asientoContableController.getById);
app.get('/asientos-contables/exportar', asientoContableController.export);
app.get('/asientos-contables', asientoContableController.list);
app.get('/asientos-contables/:id', asientoContableController.getById);

// Reportes
app.get('/reportes/ajustes-inventario/pdf', ajustesInventarioReportController.exportPdf);
app.get('/reportes/ajustes-inventario', ajustesInventarioReportController.list);

// Periodos contables
app.post('/periodos-contables', periodoContableController.create);
app.get('/periodos-contables', periodoContableController.list);
app.get('/periodos-contables/:id', periodoContableController.getById);
app.put('/periodos-contables/:id', periodoContableController.update);
app.patch('/periodos-contables/:id/cerrar', periodoContableController.cerrar);

// Reglas contables
app.get('/reglas-contables', reglaContableController.list);
app.post('/reglas-contables', reglaContableController.create);
app.put('/reglas-contables/:id', reglaContableController.update);

const swaggerDocument = createSwaggerSpec(registeredRoutes);

app.get('/openapi.json', (req, res) => {
  res.json(swaggerDocument);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
}));

// Middleware de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;

