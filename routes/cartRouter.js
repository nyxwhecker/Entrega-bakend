import { Router } from "express";
//import { randomUUID }  from "node:crypto";
//import fs, { writeFileSync } from "fs";
import CartManager from "../dao/services/cartManager.js"

const router = Router();
const cartManager = new CartManager();

router.post("/api/carts/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.send("Carrito creado");
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send("Error al crear el carrito");
    }
});

router.get("/api/carts/:cid/", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Error al obtener el carrito");
    }
});

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        await cartManager.addProduct(cartId, productId, quantity);

        res.send(`Producto ${productId} agregado al carrito ${cartId}`);
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).send("Error al agregar el producto al carrito");
    }
});

export default router