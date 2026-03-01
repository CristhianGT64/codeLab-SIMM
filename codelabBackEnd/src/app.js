import express from 'express';

import productController from './controllers/productController.js';
import authController from './controllers/authController.js';
import rolController from './controllers/rolController.js';
import sucursalController from './controllers/sucursalController.js';
import usuarioController from './controllers/usuarioController.js';

import errorHandler from './shared/middlewares/errorHandler.js';

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

// LOGIN
app.post('/auth/login', authController.login);

// PRODUCTOS
app.get('/products', productController.getAllProducts);
app.get('/products/:id', productController.getProductById);
app.post('/products/create', productController.createProduct);
app.put('/products/:id', productController.updateProduct);
app.patch('/products/:id/activo', productController.activateProduct);
app.patch('/products/:id/inactivo', productController.deactivateProduct);
app.delete('/products/:id', productController.deleteProduct);
app.delete('/productsDelete/:id', productController.deleteProduct);

// ROLES / SUCURSALES
app.get('/roles', rolController.getAll);
app.post('/roles', rolController.create);

app.get('/sucursales', sucursalController.getAll);
app.post('/sucursales', sucursalController.create);

// USUARIOS
app.post('/usuarios', usuarioController.create);
app.get('/usuarios', usuarioController.getAll);
app.get('/usuarios/:id', usuarioController.getById);
app.put('/usuarios/:id', usuarioController.update);
app.patch('/usuarios/:id/activo', usuarioController.activate);
app.patch('/usuarios/:id/inactivo', usuarioController.deactivate);
app.delete('/usuarios/:id', usuarioController.remove);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
