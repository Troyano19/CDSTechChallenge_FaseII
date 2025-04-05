const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const UserDB = require("../models/usersModel"); // Import the User model

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `http://localhost:3001/api/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    UserDB.findOrCreate({pfp: profile.photos[0].value, registrationmethod:"GOOGLE", googleId: profile.id, username: profile.displayName, email: profile.emails[0].value }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new LocalStrategy({
  usernameField: "identifier",
  passwordField: "password"
},
async function(identifier, password, done) {
  try {
    const query = identifier.includes('@') ?
      { email: identifier.toLowerCase() } :
      { username: identifier.toLowerCase() };

    const user = await UserDB.findOne(query);
    if (!user) {
      console.error("Usuario no encontrado con query:", query);
      return done(null, false, { message: "Credenciales incorrectas" });
    }

    // Depura el resultado de la autenticación
    const authResult = await user.authenticate(password);
    console.log("Resultado de user.authenticate:", authResult);

    if (!authResult.user) {
      return done(null, false, { message: "Credenciales incorrectas" });
    }

    return done(null, authResult.user);
  } catch (err) {
    return done(err);
  }
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


