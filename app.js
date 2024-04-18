import express from "express";
import path from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import connectDb from "./config/database.js";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import initilizePassport from "./config/passport.config.js";
import passport from "passport";

import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js"; 

const app = express();
const port = 27017;
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

initilizePassport();
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/sessions", sessionsRouter);

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

const server = app.listen(port, () => console.log("Listening in", port));
const io = new Server(server);
connectDb();


//Client ID: Iv1.c169df1cd6456c66

//2126729e4c12c0312ae1d67e9d51ab6297ebbca6