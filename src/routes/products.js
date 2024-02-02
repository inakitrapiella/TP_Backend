const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager'); 

const productManager = new ProductManager('./path/to/products.json'); 

router.get('/', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        let products = await productManager.getProducts();

        if (limit) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const newProductData = req.body;
        await productManager.addProduct(newProductData);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.json({ message: `Product with ID ${productId} updated successfully` });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        await productManager.deleteProduct(productId);
        res.json({ message: `Product with ID ${productId} deleted successfully` });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
