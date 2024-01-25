const express = require('express');
const ProductManager = require('../ProductManager');

const app = express();
const port = 3000;
const productManager = new ProductManager('productos.json'); 

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(parseInt(productId));
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});