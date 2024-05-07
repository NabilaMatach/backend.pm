const fs = require('fs');
const readline = require('readline');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      this.products = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    } catch (error) {
      this.products = [];
      this.saveProducts();
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const id = Date.now().toString();
    this.products.push({ id, title, description, price, thumbnail, code, stock });
    this.saveProducts();
    console.log(`Producto "${title}" agregado.`);
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  updateProduct(id, updatedProduct) {
    const product = this.getProductById(id);
    if (product && Object.keys(updatedProduct).length > 0) {
      Object.assign(product, updatedProduct);
      this.saveProducts();
      console.log(`Producto con ID ${id} actualizado.`);
    } else {
      console.log(`Error al actualizar el producto con ID ${id}. Verifica los datos.`);
    }
  }

  removeProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      console.log(`Producto con ID ${id} eliminado.`);
    } else {
      console.log(`Producto con ID ${id} no encontrado.`);
    }
  }

  listProducts() {
    console.log("Lista de productos:");
    this.products.forEach(product => {
      console.log(`- ${product.title} (${product.code}): $${product.price}, Stock: ${product.stock}`);
    });
  }

  interactiveMenu() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log("Bienvenido al Gestor de Productos");

    const menu = `
      Menú:
      1. Agregar producto
      2. Consultar producto por ID
      3. Actualizar producto por ID
      4. Eliminar producto por ID
      5. Listar todos los productos
      6. Salir
    `;

    const prompt = () => {
      rl.question(menu, (option) => {
        switch (option) {
          case '1':
            rl.question('Título: ', (title) => {
              rl.question('Descripción: ', (description) => {
                rl.question('Precio: ', (price) => {
                  rl.question('Thumbnail: ', (thumbnail) => {
                    rl.question('Código: ', (code) => {
                      rl.question('Stock: ', (stock) => {
                        this.addProduct(title, description, parseFloat(price), thumbnail, code, parseInt(stock));
                        prompt();
                      });
                    });
                  });
                });
              });
            });
            break;
          case '2':
            rl.question('ID del producto: ', (id) => {
              const product = this.getProductById(id);
              if (product) {
                console.log(product);
              } else {
                console.log('Producto no encontrado.');
              }
              prompt();
            });
            break;
          case '3':
            rl.question('ID del producto a actualizar: ', (id) => {
              rl.question('Datos actualizados (en formato JSON): ', (data) => {
                try {
                  const updatedProduct = JSON.parse(data);
                  this.updateProduct(id, updatedProduct);
                } catch {
                  console.log('Error al actualizar. Verifica los datos.');
                }
                prompt();
              });
            });
            break;
          case '4':
            rl.question('ID del producto a eliminar: ', (id) => {
              this.removeProduct(id);
              prompt();
            });
            break;
          case '5':
            this.listProducts();
            prompt();
            break;
          case '6':
            rl.close();
            break;
          default:
            console.log('Opción no válida.');
            prompt();
            break;
        }
      });
    };

    prompt();
  }
}


