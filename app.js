import express from "express";
import path from 'path';
import  productsRouter from "./routes/productsRouter.js";
import  cartRouter  from "./routes/cartRouter.js";
import handlebars from "express-handlebars";
import { Server } from 'socket.io';

//const pathCart = "./data/carrito.json"

const app = express()
const port = 8080
const __dirname = path.dirname(new URL(import.meta.url).pathname);

//middleware
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}))
app.set('public', path.join(__dirname,'public'));
app.engine('handlebars', handlebars.engine())
app.use(express.json());
app.use(express.static('public'));

const server = app.listen(port,()=>console.log("Listening in", port))

const io = new Server(server)


//const products = []

//Routes

app.use("/api/products", productsRouter)

app.use("/api/carts", cartRouter)




