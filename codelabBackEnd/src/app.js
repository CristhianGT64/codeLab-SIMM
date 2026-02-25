import express from 'express';
import productController from './controllers/productController.js';
import errorHandler from './shared/middlewares/errorHandler.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Rutas de productos
app.get('/products', productController.getAllProducts);
app.get('/products/:id', productController.getProductById);
app.post('/products/create', productController.createProduct);
app.put('/products/:id', productController.updateProduct);
app.delete('/products/:id', productController.deleteProduct);
app.delete('/productsDelete/:id', productController.deleteProduct);

// Middleware de manejo de errores (debe estar al final)
app.use(errorHandler);

// Configuración de puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
