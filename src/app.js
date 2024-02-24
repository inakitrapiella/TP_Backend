const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const ProductManager = require('./controllers/ProductManager'); 
const CartManager = require('./controllers/CartManager'); 

const app = express();
const port = 8080;
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

const productManager = new ProductManager('./data/productos.json'); 
const cartManager = new CartManager('./data/carrito.json'); 


app.get('/api/products', async (req, res) => {
    const limit = req.query.limit;
    try {
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/products/:pid', async (req, res) => {
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

app.post('/api/products', async (req, res) => {
    try {
        const newProductData = req.body;
        await productManager.addProduct(newProductData);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.json({ message: `Product with ID ${productId} updated successfully` });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        await productManager.deleteProduct(productId);
        res.json({ message: `Product with ID ${productId} deleted successfully` });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/carts', async (req, res) => {
    try {
        const newCart = req.body;
        const createdCart = await cartManager.createCart(newCart);
        res.status(201).json(createdCart);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const result = await cartManager.addProductToCart(cartId, productId, quantity);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('Cart or Product not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('newProduct', async (newProduct) => {
        try {
            await productManager.addProduct(newProduct);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error adding new product:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
