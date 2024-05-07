const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 3000;

const productManager = new ProductManager('./productos.json');

app.get('/products', (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = productManager.products.slice(0, limit);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error al procesar la solicitud.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
