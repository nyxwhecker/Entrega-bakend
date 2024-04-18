import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/', auth, (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
});

router.post('/logout', (req, res) => {
   
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send({ status: "error", error: "Error al cerrar sesión" });
        }
     
        res.status(200).send({ status: "success", message: "Sesión cerrada exitosamente" });
    });
});

//restaurar password

router.get ("/restore", (req, res)=> {
    res.render("restore");
});

export default router;