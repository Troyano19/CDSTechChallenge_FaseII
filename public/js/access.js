import * as access_api from "./modules/rest-api/access-rest-api.mjs"

const loginHandler = async (event) => {
    event.preventDefault();
    //Los datos vendran extraidos del formulario de login.html
    const data = new FormData(document.forms["login"]);
    try{
        const req = await access_api.loginUser(data);

        if(req.status !== 200){
            const error = await req.json();
            throw new Error(error.message);
        }else{
            //TODO: cambiar la localización de la ventana
            //windows.location.replace("")
        }
    }catch(err){
        console.log(err);
        alert("Ha habido un problema al iniciar sesión, vuelve a intentarlo");
    };
};

const registerHandler = async (event) => {
    event.preventDefault();
    const data = new FormData(document.forms["register"]);
    try{
        const req = await access_api.registerUser(data);

        if(req !== 200){
            const error = await req.json();
            throw new Error(error);
        }else{
            //windows.location.replace("")
        }

    }catch(err){
        console.error("Ha ocurrido un error: ", err);
        alert("Ha ocurrido un error al registrarte, vuelve a intentarlo.");
    };
};

//añadir listeners a los formularios de register y de login