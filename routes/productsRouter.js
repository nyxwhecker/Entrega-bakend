import { Router } from "express";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const router = Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let products;
//const productsFilePath = `${__dirname}/data/products.json`;
const productsFilePath = "C:\\Users\\Nyxwh\\OneDrive\\Escritorio\\Bakend\\Entrega 1\\data\\products.json";


try {
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
 
} catch (error) {
  console.error('Error al leer el archivo de productos:', error);
}

router.get("/api/products/", (req,res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 0;
        let productsToReturn = products;
    
        if (limit > 0) {
          productsToReturn = products.slice(0, limit);
        }
    
        res.json(productsToReturn);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

});

router.get("/api/products/:pid/", (req,res) => {

    try {
        const productId = parseInt(req.params.pid);
        const product = products.find((p) => p.id === productId);
    
        if (!product) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
    
        res.json(product);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

});

router.post("/api/products/", (req,res) => {

    try {
        const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
        const newProductId = lastProductId + 1;
    
        const newProduct = {
          id: newProductId,
          title: req.body.title,
          description: req.body.description,
          code: req.body.code,
          price: req.body.price,
          status: true,
          stock: req.body.stock,
          category: req.body.category
        };
    
        products.push(newProduct);
    
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    
        res.status(201).json(newProduct);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

})

router.put("/api/products/:pid/", (req,res) => {

    try {
        const productId = parseInt(req.params.pid);
        const productIndex = products.findIndex((p) => p.id === productId);
    
        if (productIndex === -1) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
    
        const updatedProduct = {
          ...products[productIndex],
          title: req.body.title || products[productIndex].title,
          description: req.body.description || products[productIndex].description,
          code: req.body.code || products[productIndex].code,
          price: req.body.price || products[productIndex].price,
          status: req.body.status || products[productIndex].status,
          stock: req.body.stock || products[productIndex].stock,
          category: req.body.category || products[productIndex].category
        };
    
        products[productIndex] = updatedProduct;
    
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    
        res.json(updatedProduct);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

})

router.delete("/api/products/:pid/", (req,res) => {

    try {
        const productId = parseInt(req.params.pid);
        const productIndex = products.findIndex((p) => p.id === productId);
    
        if (productIndex === -1) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
    
        const deletedProduct = products.splice(productIndex, 1)[0];
    
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    
        res.json(deletedProduct);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

})

export default router