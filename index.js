
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
            return true;
        }

        return false;
    }

    deleteProduct(id) {
        const products = this.readProducts();
        const updatedProducts = products.filter(p => p.id !== id);

        if (products.length !== updatedProducts.length) {
            console.log(`Producto con ID ${id} eliminado correctamente`);
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

const productManager = new ProductManager('productos.json');


productManager.addProduct({
    title: "Pan",
    description: "Pan integral",
    price: 2.5,
    thumbnail: "pan_thumbnail.jpg",
    stock: 100,
    code: "P001"
});

productManager.addProduct({
    title: "Pan",
    description: "Pan flautitra",
    price: 2.5,
    thumbnail: "pan_thumbnail.jpg",
    stock: 100,
    code: "P002"
});

productManager.addProduct({
    title: "Facturas",
    description: "Facturas de manteca",
    price: 1.8,
    thumbnail: "facturas_thumbnail.jpg",
    stock: 50,
    code: "F003"
});

productManager.addProduct({
    title: "Chipa",
    description: "Chipa con queso",
    price: 2,
    thumbnail: "Chipa_thumbnail.jpg",
    stock: 50,
    code: "C004"
});

productManager.addProduct({
    title: "Biscochitos",
    description: "Biscochitos dulces",
    price: 1,
    thumbnail: "Biscochitos_thumbnail.jpg",
    stock: 50,
    code: "B005"
});

productManager.addProduct({
    title: "Biscochitos",
    description: "Biscochitos salados",
    price: 1,
    thumbnail: "Biscochitos_thumbnail.jpg",
    stock: 50,
    code: "B005"
});


console.log(productManager.getProducts());


const productById = productManager.getProductById(1);
console.log("Producto con ID 1:", productById);


productManager.updateProduct(1, { price: 3.0, stock: 120 });
console.log("Producto actualizado:", productManager.getProductById(1));


productManager.deleteProduct(2);
console.log("Productos después de eliminar el ID 2:", productManager.getProducts());