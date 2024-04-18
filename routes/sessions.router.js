import { Router } from "express";
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
const router = Router();

/* router.post("/register", async (req, res) => {

  const { first_name, last_name, email, age, password } = req.body;

  const exist = await userModel.findOne({ email: email });
  if (exist) {
    return res
      .status(400)
      .send({ status: "error", error: "el correo ya existe" });
  }
  const user = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
  };
  const result = await userModel.create(user);
  console.log(result);
  res.status(201).send({ staus: "success", payload: result });
}); */

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}),
async (req, res)=> {
  res.status(201).send({ status: "success", message: "usuario registrado"});
});

router.get("/failregister", async(req,res)=>{
  console.log('error');
  res.send({error:"fallo"})
});

/* router.post("/login", async (req, res) => {
  
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", error: "error en las credenciales" });
  }
  const validarPass = isValidPassword(user, password);
  console.log(validarPass);
  if (!validarPass)
    return res
      .status(401)
      .send({ error: "error", message: "Error de credenciales" });

      let userRole = "user"; 

      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        userRole = "admin";
      }

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: userRole
  };
  delete user.password;

  res.send({
    status: "success",
    payload: req.session.user,
    message: "Inicio exitoso",
  });
}) */;

router.post('/login', passport.authenticate('login',{failureRedirect:"/faillogin"}),
async(req,res)=>{
if(!req.user)return res.status(400).send('error')
req.session.user = {
  first_name: req.user.first_name,
  last_name: req.user.last_name,
  email: req.user.email,
  age: req.user.age,

};
 res.status(200).send({ status: "success", payload: req.user});
})

router.get("/faillogin", async (req,res)=>{
  console.log("error");
  res.send({error: "fallo"});
});

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
   
    res.redirect("/"); 
  }
);

//reustaurar passwprd
router.post('/restore', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Faltan datos de usuario" });
  }

  const newPass= createHash(password)
 

await userModel.updateOne({_id: user._id}, {$set:{password:newPass}}), 

res.send({ status: "sucess", message:"password actualizado"})
})

export default router;