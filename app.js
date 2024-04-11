import express from "express";
import path from "path";
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
//import mongoose from "mongoose";
import viewsRouter from "./routes/views.router.js";
import session from "express-session";
import connectDb from "./config/database.js";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";

const app = express();
const port = 8080;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const fileStorage = FileStore(session);

const DBURL = `mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority`;

//middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.set("public", path.join(__dirname, "public"));
app.engine("handlebars", handlebars.engine());
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    store: new MongoStore({
      mongoUrl:DBURL,
      ttl:3600
    }),
    secret:"Secret",
    resave:false,
    saveUninitialized:false
  })
);

//middleware auth
function auth(req, res, next) {
  if (req.session.user === "pepe" && req.session.admin) {
    return next();
  }
  res.status(401).send("no estas autorizado");
}

//Routes

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

app.get("/", (req, res) => {
  res.status(200).send("<h1>hola</h1>");
});


//logica de sesion 

//ruta session
app.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send("se visito el sitio" + req.session.counter + "veces");
  } else {
    req.session.counter = 1;
    res.send("bienvenido/a");
  }
});

//iniciar sesion
app.get("/login", (req, res) => {
  const { username, password } = req.query;
  if (username !== "pepe" || password !== "pepepass") {
    return res.send("login failed");
  }

  req.session.user = username;
  req.session.admin = true;
  res.send("login success");
});

//cerrar sesion
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("saliste de la sesion");
    } else {
      res.send({ error: err });
    }
  });
});

// rutas protegidas
app.get("/privado", auth, (req, res) => {
  res.send("estass en el mejor lugar");
});

//const connectMongoDB = async () => {
//  const DB_URL =
//    "mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority";
//  try {
//    await mongoose.connect(DB_URL);
//    console.log("conectado a mongoDB");
//  } catch (error) {
//    console.error("no se pudo conectar a la DB", error);
//    process.exit();
//  }
//};

//connectMongoDB();

const server = app.listen(port, () => console.log("Listening in", port));
const io = new Server(server);
connectDb();
