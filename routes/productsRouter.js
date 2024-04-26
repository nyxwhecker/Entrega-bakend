import { Router } from "express";
import ProductManager from "../dao/services/productManager.js"

const router = Router()
const productManager = new ProductManager()

// todos los productos paginados
router.get("/products", async (req, res) => {
  const { page, limit } = req.query;

  try {
    const products = await productManager.getPaginatedProducts(page, limit);
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: `Error al recibir los productos` });
  }
});

//  producto por ID
router.get("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productManager.getById(id);
    if (product) {
      res.status(200).json({ product });
    } else {
      res.status(404).json({ error: `Producto con id: ${id} no encontrado` });
    }
  } catch (error) {
    console.log(`Error al cargar el producto: ${error}`);
    res.status(500).json({ error: `Error al recibir el producto` });
  }
});

//  nuevo producto
router.post("/products", async (req, res) => {
  const newProduct = req.body;

  try {
    const result = await productManager.createProduct(newProduct);
    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({ error: `Error al crear el producto: ${error.message}` });
  }
});

// Actualizar un producto 
router.put("/product/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;

  try {
    const result = await productManager.updateProduct(id, updatedProduct);
    if (result) {
      res.status(200).json({ message: "Producto actualizado exitosamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});


router.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await productManager.deleteProduct(id);
    if (deletedProduct) {
      res.status(200).json({ message: "Producto eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});


router.get("/all", async (req, res) => {
    try {
      const { limit } = req.query;
      
      const data = await productManager.getAll(limit);
    
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


export default router