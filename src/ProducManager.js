
const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock || !product.code) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        const products = this.readProducts();

        const productExist = products.find(p => p.code === product.code);

        if (productExist !== undefined) {
            console.log("El producto ya existe con ese código");
            return;
        }

        product.id = products.length + 1;
        products.push(product);
        this.saveProducts(products);
        console.log(`Producto '${product.title}' agregado correctamente.`);
    }

    getProducts() {
        return this.readProducts();
    }

    getProductById(id) {
        const products = this.readProducts();
        const product = products.find(p => p.id === id);

        if (product !== undefined) {
            return product;
        } else {
            console.log("El producto no existe con ese ID");
            return null;
        }
    }

    updateProduct(id, updatedFields) {
        const products = this.readProducts();
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex !== -1) {
            delete updatedFields.id;
            products[productIndex] = { ...products[productIndex], ...updatedFields };
            this.saveProducts(products);
            console.log(`Producto con ID ${id} actualizado correctamente.`);
            return true;
        }

        console.log("Producto no encontrado.");
        return false;
    }

    deleteProduct(id) {
        const products = this.readProducts();
        const updatedProducts = products.filter(p => p.id !== id);

        if (products.length !== updatedProducts.length) {
            console.log(`Producto con ID ${id} eliminado correctamente.`);
            this.saveProducts(updatedProducts);
        } else {
            console.log(`No se encontró un producto con ID ${id}`);
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
