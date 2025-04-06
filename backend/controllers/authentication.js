const userDB = require("../models/usersModel");
const sanitizeHtml = require('sanitize-html');
const passport = require('passport');
/**
 * Genera un token para un usuario especifico.
 */

const createToken = (data) => {
    const options = {
        expiresIn: "30m",
    };

    return jwt.sign(data, process.env.JWT_TOKEN_SECRET, options)
};

/**
 * Funcion que permite iniciar sesión en el sistema. En función de como se procesa la petición,
 * la respuesta será:
 * 
 * -Si la petición es exitosa devuelve el código 201 y un objeto JSON
 * con el token JWT del usuario.
 * 
 * -Si la petición falla, devuelve el codigo 400 y un JSON con el mensaje de error.
 */

const login = (req, res, next) => {
  // Se utiliza la estrategia "local" (ya definida en passport.js)
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error("Error en el proceso de login:", err);
      return next(err);
    }
    if (!user) {
      // info.message lo envía la estrategia si las credenciales no son válidas
      return res.status(400).json({ message: info && info.message ? info.message : "Credenciales incorrectas" });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error al iniciar la sesión:", err);
        return next(err);
      }
      // Se puede devolver algunos datos del usuario (sin la contraseña)
      const userData = {
        _id: user._id,
        username: user.username,
        name: user.name,
        surnames: user.surnames,
        email: user.email,
        registrationmethod: user.registrationmethod,
        accountActivated: user.accountActivated,
        pfp: user.pfp,
        role: user.role
      };
      return res.status(200).json({ message: "Login exitoso", user: userData });
    });
  })(req, res, next);
};

const register = (req, res, next) => {
    try {
        const { name, surnames, username, email, password, confirmPassword } = req.body;
  
        if (!name || !surnames || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Faltan campos por rellenar" });
        }
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Las contraseñas no coinciden" });
        }
    
        // Sanitizamos los datos para evitar código malicioso
        const sanitizedData = {
            name: sanitizeHtml(name),
            surnames: sanitizeHtml(surnames),
            username: sanitizeHtml(username),
            email: sanitizeHtml(email)
        };
    
        // Aquí se puede llamar a una función para comprobar parámetros válidos
        checkParams({ 
            name: sanitizedData.name, 
            surnames: sanitizedData.surnames, 
            username: sanitizedData.username, 
            email: sanitizedData.email, 
            password 
        });
    
        // Creamos un nuevo usuario. Se asume que el modelo userDB tiene integrado passport-local-mongoose.
        const newUser = new userDB({
            name: sanitizedData.name,
            surnames: sanitizedData.surnames,
            username: sanitizedData.username,
            email: sanitizedData.email.toLowerCase()
        });
    
        // El método register se encarga de hashear la contraseña y guardar el usuario
        userDB.register(newUser, password, (err, user) => {
            if (err) {
            if (err.code === 11000) {
                if (err.keyPattern && err.keyPattern.username) {
                return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
                } else if (err.keyPattern && err.keyPattern.email) {
                return res.status(409).json({ message: "El email ya está en uso" });
                }
                return res.status(409).json({ message: "Error de clave duplicada" });
            }
            return res.status(400).json({ message: err.message });
            }
            // Una vez registrado, se inicia sesión en el nuevo usuario
            req.logIn(user, (err) => {
            if (err) return next(err);
            const userData = {
                _id: user._id,
                username: user.username,
                name: user.name,
                surnames: user.surnames,
                email: user.email,
                registrationmethod: user.registrationmethod,
                accountActivated: user.accountActivated,
                pfp: user.pfp,
                role: user.role
            };
            return res.status(200).json({ message: "Registro y login exitoso", user: userData });
            });
        });
        } catch (err) {
        console.error("Ha ocurrido un error en el proceso de registro:", err.message);
        res.status(500).json({ message: err.message });
    }
};

  const logout = (req, res) => {
    try {
      if (req.isAuthenticated()) {
        req.logout((err) => {
          if (err) {
            throw new Error("Error al cerrar sesión");
          }
          return res.status(204).send();
        });
      } else {
        return res.status(400).json({ message: "No hay sesión activa" });
      }
    } catch (err) {
      console.error(err);
      return res.status(404).json({ message: err.message });
    }
  };

  const userData = async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        throw new Error("No hay sesión activa");
      }
      const user = await userDB.findById(req.user._id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      const data = {
        _id: user._id,
        username: user.username,
        name: user.name,
        surnames: user.surnames,
        email: user.email,
        registerDate: user.registerDate,
        role: user.role,
        accountActivated: user.accountActivated,
        pfp: user.pfp,
        registrationmethod: user.registrationmethod
      };
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(404).json({ message: err.message });
    }
  };

const checkParams = (data) => {
    /**
     * La contraseña debera contener al menos una mayuscula y una minuscula asi como un simbolo
     * y un numero.
     * La longitud de la contraseña deberá ser mayor a 8 caracteres.
     */

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\dñÑ@$!_*?&]{8,}$/;
    if(!passwordRegex.test(data.password)){
    throw new Error("La contraseña debe contener lo siguiente: \n" +
                    " - Al menos una letra mayúscula\n" +
                    " - Al menos una letra minúscula\n" +
                    " - Al menos un número\n" +
                    " - Al menos un símbolo especial (@$!_*?&)\n" +
                    " - Debe tener una longitud mínima de 8 caracteres");
    };
    /**
     * El nombre de usuario tendra que tener una longitu de entre 4 y 20 caracteres
     * y no podrá contener espacios ni caracteres especiales de ningun tipo.
     */
    if(data.username.length < 4 || data.username.length > 20){
    throw new Error("El nombre de usuario debe tener entre 4 y 20 caracteres");
    };
    if(/[^a-zA-Z0-9ÑñçÇáéíóúÁÉÍÓÚ]/.test(data.username)){
    throw new Error("El nombre de usuario solo puede contener letras y números");
    };
    //Tambien verificaremos si el email tiene validez
    if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(data.email)){
    throw new Error("El email no es válido");
    };
    //Ni el nombre, ni el telefono ni los apellidos podran tener caracteres especiales
    if(/[^a-zA-ZÑñçÇáéíóúÁÉÍÓÚ\s]/.test(data.name) || /[^a-zA-ZÑñçÇáéíóúÁÉÍÓÚ\s]/.test(data.surnames)){
    throw new Error("El nombre y los apellidos solo pueden contener letras");
    };
};





module.exports = {
    login,
    register,
    logout,
    userData,
}
