import express from 'express';

import productController from './controllers/productController.js';
import sucursalController from './controllers/sucursalController.js';
import authController from './controllers/authController.js';
import usuarioController from './controllers/usuarioController.js';
import clientController from './controllers/clientController.js';
import errorHandler from './shared/middlewares/errorHandler.js';
import { authorizePermission } from './shared/middlewares/authorizePermission.js'
import * as roleController from './controllers/roleController.js';
import * as permissionController from './controllers/permissionController.js';
import * as permissionCategoryController from './controllers/permissionCategoryController.js'
const app = express();

const allowedOrigins = process.env.allowedOrigins;

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

BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'SIMM API' });
});

// Ruta de login
app.post('/auth/login', authController.login);

// Rutas de productos
app.get('/products', productController.getAllProducts);
app.get('/products/:id', productController.getProductById);
app.post('/products/create', authorizePermission('createProduct'), productController.createProduct);
app.put('/products/:id', authorizePermission('updateProduct'), productController.updateProduct);
app.patch('/products/:id/activo', productController.activateProduct);
app.patch('/products/:id/inactivo', productController.deactivateProduct);
app.delete('/products/:id', authorizePermission('deleteProduct'), productController.deleteProduct);
app.delete('/productsDelete/:id', productController.deleteProduct);

//Rutas de sucursales
app.post('/sucursales', sucursalController.createSucursal); //Funciona
app.get('/sucursales', sucursalController.getAllSucursales); //Funciona
app.get('/sucursales/:id', sucursalController.getSucursalById);
app.put('/sucursales/:id', sucursalController.updateSucursal);
app.patch('/sucursales/:id/estado', sucursalController.changeSucursalStatus);

// Rutas de roles 
app.get('/roles', roleController.getAll);
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
// Rutas de usuarios
app.post('/usuarios', usuarioController.create);
app.get('/usuarios', usuarioController.getAll);
app.get('/usuarios/:id', usuarioController.getById);
app.put('/usuarios/:id', usuarioController.update);
app.patch('/usuarios/:id/activo', usuarioController.activate);
app.patch('/usuarios/:id/inactivo', usuarioController.deactivate);
app.delete('/usuarios/:id', usuarioController.remove);

// Rutas de clientes
app.post('/clientes', clientController.createClient);
app.get('/clientes', clientController.getAllClients);
app.put('/clientes/:id', clientController.updateClient);

// Middleware de manejo de errores (debe estar al final)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;