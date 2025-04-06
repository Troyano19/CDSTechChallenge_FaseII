const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const UserDB = require("../models/usersModel"); // Import the User model

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/api/auth/google/callback`
  },
  async function(profile, cb) {
    try {
      // Utilizamos el email como identificador único
      const query = { email: profile.emails[0].value };
      let user = await UserDB.findOne(query);

      if (user) {
        // Si el usuario existe, actualizamos pfp y googleId si es necesario
        let needsUpdate = false;

        if (!user.googleId) {
          user.googleId = profile.id;
          needsUpdate = true;
        }
        if (user.pfp !== profile.photos[0].value) {
          user.pfp = profile.photos[0].value;
          needsUpdate = true;
        }
        if (needsUpdate) {
          await user.save();
        }

        return cb(null, user);
      } else {
        // Si el usuario no existe, se crea uno nuevo
        const newUser = new UserDB({
          username: profile.displayName,
          pfp: profile.photos[0].value,
          registrationmethod: "GOOGLE",
          googleId: profile.id,
          email: profile.emails[0].value
        });

        await newUser.save();
        return cb(null, newUser);
      }
    } catch (err) {
      return cb(err);
    }
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


