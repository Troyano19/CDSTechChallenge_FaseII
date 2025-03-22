const jwt = require('jsonwebtoken');
const userDB = require("../models/usersModel");
const sanitizeHtml = require('sanitize-html');

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

const login = async (req, res) => {
    try{
        let {identifier, password} = req.body;
        identifier = sanitizeHtml(identifier);
        password = sanitizeHtml(password);
        const user = identifier.includes('@') ? await userDB.findOne({email: identifier.toLowerCase()}) : await userDB.findOne({username: identifier.toLowerCase()});

        if(user){
            if(user.comparePassword(password)){
                throw new Error("Nombre de usuario o contraseña incorrectos, intentalo de nuevo");
            }
        }else{
            throw new Error("Nombre de usuario o contraseña incorrectos, intentalo de nuevo");        }

        const token = createToken({user: user._id});
        res.cookie("loginCookie", token, {httpOnly: true, sameSite: "Strict", maxAge: 3600000});
        res.status(200).json({token: token});
    }catch(err){
        console.log("Ha ocurrido un error en el proceso de login", err)
        res.status(400).json({message: err.message});
    };
};

const register = async (req, res) => {
    try{
        const {name, surnames, username, email, password, confirmPassword} = req.body

        if(name === undefined || surnames === undefined || username === undefined || email === undefined || password === undefined || confirmPassword === undefined){
            res.status(400).json({message: "Faltan campos por rellenar"});
        return;
        };

        if(password !== confirmPassword){
            res.status(400).json({message: "Las contraseñas no coinciden"});
            return;
        }
        //TODO: Comprobar si comprueba variaciones en mayusculas
        if(await userDB.findOne({usernameLower: username.toLowerCase()})){
            res.status(409).json({message: "El nombre de usuario ya está en uso"});
            return;
        };

        if(await userDB.findOne({email: email.toLowerCase()})){
            res.status(409).json({message: "El email ya está en uso"});
            return;;
        };
        //Sanitizamos los datos para evitar codigo malicioso
        const sanitizedData = {
            name: sanitizeHtml(name),
            surnames: sanitizeHtml(surnames).split(" ")[0],
            username: sanitizeHtml(username),
            email: sanitizeHtml(email),
            password: sanitizeHtml(password)
        };
        //Comprobamos si los datos cumplen con los parametros
        checkParams(sanitizedData);
        
        const newUser = new userDB({name: sanitizedData.name, usernameLower: sanitizedData.username.toLowerCase(), username: sanitizedData.username,
            surnames: sanitizedData.surnames, email: sanitizedData.email.toLowerCase(),});

        newUser.password = await newUser.hashPassword(password);
        await newUser.save();
        const token = createToken({user: newUser._id});
        res.cookie("loginCookie", token, {httpOnly: true, sameSite: "Strict"});
        res.status(200).json({token: token});
    }catch(err){
        console.log("Ha ocurrido un error en el proceso de registro:", err.message);
        res.status(500).json({message: err.message});
    };
};

const logout = (req, res) => {
    try{
        //Recuperamos todas las cookies del usuario
        const cookies = req.cookies;
        //Comprobamos que se encuentre la cookie de inicio de sesión
        if(!cookies.loginCookie){
            if(req.isAuthenticated()){
                req.logout((err) => {
                    if(err){
                        throw new Error("No puede cerrarse la sesión ya que no hay ninguna abierta");
                    }
                });
                return res.status(204).send();
            }
            throw new Error("No puede cerrarse la sesión ya que no hay ninguna abierta");
        }
        //Comprobamos que el token de la cookie existe para evitar falsificaciones
        //y extraer los datos del usuario.
        jwt.verify(cookies.loginCookie, process.env.JWT_TOKEN_SECRET);
        //Borramos la cookie de sesión
        res.clearCookie("loginCookie", {httpOnly: true, sameSite: "Strict"});
        res.status(204).send();
    }catch(err){
        console.log(err);
        res.status(404).json({message: err.message});
    }
}

const checkParams = (data) => {
    /**
     * La contraseña debera contener al menos una mayuscula y una minuscula asi como un simbolo
     * y un numero.
     * La longitud de la contraseña deberá ser mayor a 8 caracteres.
     */

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\dñÑ@$!%*?&]{8,}$/;
    if(!passwordRegex.test(data.password)){
    throw new Error("La contraseña debe contener lo siguiente: \n" +
                    " - Al menos una letra mayúscula\n" +
                    " - Al menos una letra minúscula\n" +
                    " - Al menos un número\n" +
                    " - Al menos un símbolo especial (@$!%*?&)\n" +
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
    logout
}
