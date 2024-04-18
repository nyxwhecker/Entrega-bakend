import passport from 'passport';
import local from 'passport-local'
import GitHubStrategy from "passport-github2";
import userModel from '../dao/models/userModel.js'
import {createHash, isValidPassword} from '../utils.js'

const LocalStrategy= local.Strategy

const initilizePassport= ()=>{
passport.use(
    'register', 
    new LocalStrategy(
        {passReqToCallback:true, usernameField:"email"},
        async (req, username,password,done)=>{
            const { first_name, last_name, email, age} = req.body;
   
    try{
        const user= await userModel.findOne({email:username});
        
        if (user){
            console.log("el usuario existe");
            return done(null,false)
        }
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
        };

        const result =  await userModel.create(newUser); 
        return done(null, result);

    }  catch (error) {
        return done (error)
    }
   }
  )
);

//estrategia local para dsp
passport.use(
    "login",
    new LocalStrategy(
        { usernameField: "email"},
        async (username, password, done) => {
            try{
                const user = await userService.findOne({ email: username});
                if(!user) return done(null, false);
                const valid = isValidPassword(user, password);
                if(!valid) return done(null, false);
            
                return done(null, user);
            } catch (error) {
                return done(error)
            }
        }
    )
); 

passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.c169df1cd6456c66",//id de la app en github
        clientSecret: "2126729e4c12c0312ae1d67e9d51ab6297ebbca",//clave secreta de github
        callbackURL: "http://localhost:27017/api/sessions/githubcallback",//url callback de github
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);//obtenemos el objeto del perfil
          //buscamos en la db el email
          const user = await userService.findOne({
            email: profile._json.email,
          });
          //si no existe lo creamos
          if (!user) {
            //contruimos el objeto según el modelo (los datos no pertenecientes al modelo lo seteamos por default)
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 20,
              email: profile._json.email,
              password: "",
            };
            //guardamos el usuario en la database
            let createdUser = await userService.create(newUser);
            done(null, createdUser);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
);

passport.serializeUser((user,done)=>{
    done(null,user)
})
passport.deserializeUser(async(id, done)=>{
    try{
        const user = await userModel.findById(id)
        done(null, user);
    } catch (error) {
        done(error)
    }
})
}

export default initilizePassport