import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import productoController from './controllers/productoController.js';
import categoriaController from './controllers/categoriaController.js';
import sucursalController from './controllers/sucursalController.js';
import authController from './controllers/authController.js';
import usuarioController from './controllers/usuarioController.js';
import clientController from './controllers/clientController.js';
import * as roleController from './controllers/roleController.js';
import * as permissionCategoryController from './controllers/permissionCategoryController.js';
import * as permissionController from './controllers/permissionController.js';
import uploadProductoImage from './middlewares/uploadProductoImage.js';
import errorHandler from './shared/middlewares/errorHandler.js';

//Parche: convierte de BigInt a String para que lo soporte Json.
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manejo de CORS
const allowedOrigins = (process.env.allowedOrigins || process.env.ALLOWED_ORIGINS || '')
  .replace(/[\[\]']/g, '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
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
app.get('/productos/unidades', productoController.unidades);
app.post('/productos', uploadProductoImage.single('imagen'), productoController.create);
app.get('/productos', productoController.list);
app.get('/productos/:id', productoController.getById);
app.put('/productos/:id', uploadProductoImage.single('imagen'), productoController.update);
app.patch('/productos/:id', productoController.patch);
app.delete('/productos/:id', productoController.remove);

// Sucursales
app.post('/sucursales', sucursalController.createSucursal);
app.get('/sucursales', sucursalController.getAllSucursales);
app.get('/sucursales/:id', sucursalController.getSucursalById);
app.put('/sucursales/:id', sucursalController.updateSucursal);
app.patch('/sucursales/:id/estado', sucursalController.changeSucursalStatus);

// Roles
app.get('/roles', roleController.getAll);
app.get('/roles/:id', roleController.getById);
app.post('/roles', roleController.create);
app.put('/roles/:id', roleController.update); // modificar nombre de rol
app.delete('/roles/:id', roleController.remove); // eliminar rol validando usuarios

// permission categories
app.post('/permission-categories', permissionCategoryController.create)
app.get('/permission-categories', permissionCategoryController.getAll)

// permissions
app.post('/permissions', permissionController.create)
app.get('/permissions', permissionController.getAll)
app.put('/permissions/:id', permissionController.update)
app.delete('/permissions/:id', permissionController.remove)

// role permissions
app.post('/roles/:id/permissions', roleController.assignPermissions)
app.put('/roles/:id/permissions', roleController.updatePermissions) // modificar permisos del rol
app.get('/roles/:id/permissions', roleController.getPermissions)
// Usuarios
app.post('/usuarios', usuarioController.create);
app.get('/usuarios', usuarioController.getAll);
// Rutas para obtener usuarios por rol y para operaciones CRUD específicas (Opcional por si se necesitan)
app.get('/usuarios/roles', usuarioController.getUsersByRole);
app.get('/usuarios/:id', usuarioController.getById);
app.put('/usuarios/:id', usuarioController.update);
app.patch('/usuarios/:id/activo', usuarioController.activate);
app.patch('/usuarios/:id/inactivo', usuarioController.deactivate);
app.delete('/usuarios/:id', usuarioController.remove);


// Rutas de clientes
app.post('/clientes', clientController.createClient);
app.get('/clientes', clientController.getAllClients);
app.put('/clientes/:id', clientController.updateClient);
// Middleware de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;