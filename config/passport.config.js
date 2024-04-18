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
        clientID: "Iv1.c169df1cd6456c66",
        clientSecret: "2126729e4c12c0312ae1d67e9d51ab6297ebbca",
        callbackURL: "http://localhost:27017/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await userService.findOne({
            email: profile._json.email,
          });
          
          if (!user) {
           
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 20,
              email: profile._json.email,
              password: "",
            };
          
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