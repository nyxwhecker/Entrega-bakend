import { Router } from "express";
import CartManager from "../dao/services/cartManager.js"

const router = Router();
const cartManager = new CartManager();

router.get("/carts/:cid", async (req, res) => {
    try {
    
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
    
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        
        const products = await cartManager.getProductsInCart(cartId);

        res.render("cartView", { cart, products });
    } catch (error) {
        console.error("Error al obtener el carrito y sus productos:", error);
        res.status(500).send("Error al obtener el carrito y sus productos");
    }
});



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


router.delete("/api/carts/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        await cartManager.removeProduct(cartId, productId);

        res.send(`Producto ${productId} eliminado del carrito ${cartId}`);
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).send("Error al eliminar el producto del carrito");
    }
});


router.put("/api/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { products } = req.body;

        await cartManager.updateCart(cartId, products);

        res.send(`Carrito ${cartId} actualizado con éxito`);
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).send("Error al actualizar el carrito");
    }
});


router.put("/api/carts/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        await cartManager.updateProductQuantity(cartId, productId, quantity);

        res.send(`Cantidad de producto ${productId} en el carrito ${cartId} actualizada`);
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
        res.status(500).send("Error al actualizar la cantidad del producto en el carrito");
    }
});


router.delete("/api/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;

        await cartManager.removeAllProducts(cartId);

        res.send(`Todos los productos del carrito ${cartId} han sido eliminados`);
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).send("Error al eliminar todos los productos del carrito");
    }
});


export default router