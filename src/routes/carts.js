const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager'); 

const cartManager = new CartManager('./path/to/cart.json'); 

router.post('/', async (req, res) => {
    try {
        const newCart = req.body;
        const createdCart = await cartManager.createCart(newCart);
        res.status(201).json(createdCart);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:cid', async (req, res) => {
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

router.post('/:cid/product/:pid', async (req, res) => {
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

module.exports = router;

