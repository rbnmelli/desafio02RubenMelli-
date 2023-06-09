const { log } = require('console');
const fs = require('fs');

class ProductManager{
    constructor(path){
        this.path = path
    }
    // Funcion para asignar el ID automatico
    getId = async () =>{
        const list = await this.getProducts();
        const nexId = list.length + 1;
        return nexId;

    }
    // Funcion de creacion de productos
    addProduct = async (code, title, description, price, thumbnail, stock) =>{
        const prod = {
            id: await this.getId(),
            code: code,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            stock: stock
        };
        // Tomo la lista del archivo y agrego objeto
        const list = await this.getProducts();
        const codes = list.filter(c => c.code === prod.code)
        if(codes.length === 0){
            list.push(prod)
            // Escrivo el archivo o Reescribo si el archivo existe
            await fs.promises.writeFile(this.path, JSON.stringify(list))
            
        } else { return 'Codigo repetido'}
    }
    // Funcion que muestra todo el contenido
    getProducts = async() =>{
        try {
            // Tomo el archivo, lo convierto y retorno el array
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const dataObjet = JSON.parse(data)
            return dataObjet
        } catch (error) {
            console.log('error')
            return []
        }
    }
    // Funcion que muestra productos por ID
    getProductById = async (id) =>{
        const productos = await this.getProducts()
        const idProd = await productos.filter(p => p.id === id)
        if(idProd.length === 0) {return ('Not fund')}
        else {return idProd};
    }
    // Funcion que borra productos por ID
    deleteProduct = async (id) =>{
        const productos = await this.getProducts()
        const idProd = await productos.filter(p => p.id === id)
        const index = productos.indexOf(idProd[0])
        // Elimino el producto y reescribo el archivo
        if(index < 0){return ('No existe ID')}
        else{
            productos.splice(index, 1, {})
            await fs.promises.writeFile(this.path, JSON.stringify(productos))
        }
    }
    // Funcion que modifica un producto por ID
    updateProduct = async (id, propiedad, entrada) =>{
        const productos = await this.getProducts()
        const idProd = await productos.filter(p => p.id === id)
        const index = productos.indexOf(idProd[0])
        // Modifico y reescribo el archivo
        if(index < 0){return ('No existe Producto')}
        else{
            productos[index][propiedad] = entrada
            await fs.promises.writeFile(this.path, JSON.stringify(productos))
        }
    }
}

//* TESTEO DEL ALGORITMO


const almacen = new ProductManager('productos.json');

await almacen.addProduct('0001', 'Arroz Gallo', 'Arroz parboid 00000', 300, './www.image.jpg', 100);
await almacen.addProduct('0002', 'Harina Pureza', 'Harina de trigo 0000', 200, './www.image.jpg', 100);
await almacen.addProduct('0003', 'Vino Maravilla', 'Vino tinto de mesa', 500, './www.image.jpg', 50);
console.log(await almacen.addProduct('0002', 'Harina Pureza', 'Harina de trigo 0000', 200, './www.image.jpg', 100));
console.log(await almacen.getProducts());

console.log(await almacen.getProducts());
console.log('--------------------------------------------------------');
console.log(await almacen.getProductById(1));
console.log(await almacen.getProductById(3));
console.log(await almacen.getProductById(4));

console.log(await almacen.deleteProduct(2));

await almacen.addProduct('0002', 'Harina Pureza', 'Harina de trigo 0000', 200, './www.image.jpg', 100);

await almacen.updateProduct(3, 'price', 600);

console.log(await almacen.getProductById(3));

console.log(await almacen.getProducts());

