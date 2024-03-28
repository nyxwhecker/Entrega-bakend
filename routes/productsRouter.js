import { Router } from "express";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ProductManager from "../dao/services/productManager.js"

const productManager = new ProductManager()
const router = Router()

router.get("/all", async (req, res) => {
    try {
      const { limit } = req.query;
      
      const data = await productManager.getAll(limit);
    
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.get("/api/products/:pid/", async (req, res) => {
  try {
      const productId = parseInt(req.params.pid);
      const product = await productManager.getById(productId);
  
      if (!product) {
          return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      res.json(product);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

router.post("/api/products/", async (req, res) => {
  try {
    const { title, description, code, category, brand, price, stock, status, thumbnails } = req.body;

    const result = await productManager.addProduct({
        title,
        description,
        code,
        category,
        brand,
        price,
        stock,
        status,
        thumbnails
    });

    res.json({ result });
} catch (err) {
    res.status(500).json({ message: err.message });
}
});

router.put("/api/products/:pid/", async (req, res) => {
  try {
      const productId = req.params.pid;
      
      const existingProduct = await productManager.getProductById(productId);
      if (!existingProduct) {
          return res.status(404).json({ message: "Producto no encontrado" });
      }

      const updatedProductData = {
          title: req.body.title || existingProduct.title,
          description: req.body.description || existingProduct.description,
          code: req.body.code || existingProduct.code,
          price: req.body.price || existingProduct.price,
          status: req.body.status || existingProduct.status,
          stock: req.body.stock || existingProduct.stock,
          category: req.body.category || existingProduct.category,
          brand: req.body.brand || existingProduct.brand,
          thumbnails: req.body.thumbnails || existingProduct.thumbnails
      };

      const updatedProduct = await productManager.updateProduct(productId, updatedProductData);
      
      res.json(updatedProduct);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


router.delete("/api/products/:pid/", async (req, res) => {
  try {
      const productId = req.params.pid;

      const existingProduct = await productManager.getProductById(productId);
      if (!existingProduct) {
          return res.status(404).json({ message: "Producto no encontrado" });
      }

      const deletedProduct = await productManager.deleteProduct(productId);

      res.json(deletedProduct);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

export default router