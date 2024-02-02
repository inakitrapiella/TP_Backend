const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
    constructor(filePath) {
        this.path = path.join(__dirname, filePath);
    }

    addProduct(product) {
        const { title, description, code, price, stock, category, thumbnails } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            console.log('Todos los campos son obligatorios, excepto thumbnails');
            return;
        }

        const products = this.readProducts();

        const productExist = products.find(p => p.code === code);

        if (productExist !== undefined) {
            console.log("El producto ya existe con ese código");
            return;
        }

        const newProduct = {
            id: uuidv4(), 
            title,
            description,
            code,
            price,
            status: true, 
            stock,
            category,
            thumbnails: thumbnails || [] 
        };

        products.push(newProduct);
        this.saveProducts(products);
        console.log(`Producto '${title}' agregado correctamente.`);
    }

    getProducts() {
        return this.readProducts();
    }

    getProductById(productId) {
        const products = this.readProducts();
        const product = products.find(p => p.id === productId);

        if (product !== undefined) {
            return product;
        } else {
            console.log("El producto no existe con ese ID");
            return null;
        }
    }

    updateProduct(productId, updatedFields) {
        const products = this.readProducts();
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex !== -1) {
            delete updatedFields.id;
            products[productIndex] = { ...products[productIndex], ...updatedFields };
            this.saveProducts(products);
            console.log(`Producto con ID ${productId} actualizado correctamente.`);
            return true;
        }

        console.log("Producto no encontrado.");
        return false;
    }

    deleteProduct(productId) {
        const products = this.readProducts();
        const updatedProducts = products.filter(p => p.id !== productId);

        if (products.length !== updatedProducts.length) {
            console.log(`Producto con ID ${productId} eliminado correctamente.`);
            this.saveProducts(updatedProducts);
        } else {
            console.log(`No se encontró un producto con ID ${productId}`);
        }
    }

    readProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    saveProducts(products) {
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf8');
    }
}

module.exports = ProductManager;

