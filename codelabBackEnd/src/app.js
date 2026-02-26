import express from 'express';

import productController from './controllers/productController.js';
import sucursalController from './controllers/sucursalController.js';
import authController from './controllers/authController.js';
import rolController from './controllers/rolController.js';
import usuarioController from './controllers/usuarioController.js';

import errorHandler from './shared/middlewares/errorHandler.js';

//Parche: convierte de BigInt a String para que lo soporte Json.
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
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
app.post('/products/create', productController.createProduct);
app.put('/products/:id', productController.updateProduct);
app.delete('/products/:id', productController.deleteProduct);
app.delete('/productsDelete/:id', productController.deleteProduct);

//Rutas de sucursales
app.post('/sucursales', sucursalController.createSucursal); //Funciona
app.get('/sucursales', sucursalController.getAllSucursales); //Funciona
app.get('/sucursales/:id', sucursalController.getSucursalById);
app.put('/sucursales/:id', sucursalController.updateSucursal);
app.patch('/sucursales/:id/estado', sucursalController.changeSucursalStatus);


// Rutas de roles 
app.get('/roles', rolController.getAll);
app.post('/roles', rolController.create);

// Rutas de usuarios
app.post('/usuarios', usuarioController.create);
app.get('/usuarios', usuarioController.getAll);
app.put('/usuarios/:id', usuarioController.update);
app.delete('/usuarios/:id', usuarioController.remove);


// Middleware de manejo de errores (debe estar al final)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;