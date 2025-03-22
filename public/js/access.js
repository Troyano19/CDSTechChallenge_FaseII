import * as access_api from "./modules/rest-api/access-rest-api.mjs"

const loginHandler = async (event) => {
    event.preventDefault();
    //Los datos vendran extraidos del formulario de login.html
    const form = new FormData(document.forms["loginForm"]);
    const data = {
        identifier: form.get('identifier'),
        password: form.get('password')
    };

    try{
        const req = await access_api.loginUser(data);

        if(req.status !== 200){
            const error = await req.json();
            throw new Error(error.message);
        }else{

            window.location.replace("/")
        }
    }catch(err){
        console.log(err);
        alert(err.message);
    };
};

const registerHandler = async (event) => {
    event.preventDefault();
    const form = new FormData(document.forms["registerForm"]);
    try{
        const req = await access_api.registerUser(form);

        if(req.status !== 200){
            const error = await req.json();
            throw new Error(`Error al registrar al usuario: ${error.message}`);
        }else{
            window.location.replace("/")
        }

    }catch(err){
        console.error(err.message);
        alert(err.message);
    };
};

//añadir listeners a los formularios de register y de login

const loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener('submit', loginHandler);
};

const registerForm = document.getElementById("registerForm");
if(registerForm){
    registerForm.addEventListener('submit', registerHandler);
};