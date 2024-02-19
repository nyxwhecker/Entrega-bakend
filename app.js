import express from "express";
import fs, { writeFileSync } from "fs";
import { randomUUID }  from "node:crypto";
import  productsRouter from "./routes/productsRouter.js";
import  cartRouter  from "./routes/cartRouter.js";

const pathCart = "./data/carrito.json"
const app = express()
const port = 8080

app.listen(port, console.log("servidor corriendo en el puerto" + port));

//middleware
app.use(express.json());

const products = []

//Routes

app.use("/api/products", productsRouter)

app.use("/api/carts", cartRouter)

