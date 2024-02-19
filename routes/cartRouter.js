import { Router } from "express";
import { randomUUID }  from "node:crypto";
import fs, { writeFileSync } from "fs";

const router = Router()
const pathCart = "./data/cart.json"

router.post("/api/carts/", (req, res) => {

    let carrito = fs.readFileSync(pathCart, "utf-8")
    let parsedCart = JSON.parse(carrito)

    const ID = randomUUID()

    let cart = {

        id: ID,
        products: []
    
    }

    parsedCart.push(cart)
    let data = JSON.stringify(parsedCart)
    writeFileSync(pathCart, data, null)

    res.send("Carrito creado")
})

router.get("/api/carts/:cid/", (req, res) => {

    let id = req.params.cid
    let carrito = fs.readFileSync(pathCart, "utf-8")
    let parsedCart = JSON.parse(carrito)

    let finalCart = parsedCart.find((cart) => cart.id === id)
    let data = JSON.stringify(finalCart)


    res.send(data)


})
router.post("/api/carts/:cid/product/:pid", (req,res) => {

    let id = req.params.cid;
    let productId = req.params.pid;
    let productToAdd = req.body;

    let carrito = fs.readFileSync(pathCart, "utf-8");
    let parsedCart = JSON.parse(carrito);

    let finalCart = parsedCart.find((cart) => cart.id === id);

    if (finalCart) {
        let existingProduct = finalCart.products.find((product) => product.id === productId);

        if (existingProduct) {
            existingProduct.quantity += productToAdd.quantity;
        } else {
            finalCart.products.push({
                id: productId,
                quantity: productToAdd.quantity
            });
        }

        let data = JSON.stringify(parsedCart);
        writeFileSync(pathCart, data, null);

        res.send(`Producto ${productId} agregado al carrito ${id}`);
    } else {
       
        res.status(404).send("Carrito no encontrado");
    }

})

export default router