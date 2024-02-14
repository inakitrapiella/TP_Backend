const express = require('express');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const handlebars = require('express-handlebars');
const ProductManager = require('./controllers/ProductManager');
const CartManager = require('./controllers/CartManager');

const app = express();
const port = process.env.PORT || 8080;


app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');


app.use(bodyParser.json());


const productManager = new ProductManager('./data/productos.json');
const cartManager = new CartManager('./data/carrito.json');


app.get('/api/products', async (req, res) => {
    try {
        const limit = req.query.limit;
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


app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


io.on('connection', (socket) => {
    console.log('Usuario conectado');

   
    socket.on('newProduct', async (productData) => {
        try {
            
            io.emit('updateProducts', productData);
        } catch (error) {
            console.error('Error al agregar el nuevo producto:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
           
            io.emit('updateProducts', productId);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});


http.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
