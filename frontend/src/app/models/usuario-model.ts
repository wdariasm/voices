export class UsuarioModel {
    email : string; 
    password : string; 
    username : string; 
    id : string;
    first_name : string; 
    last_name : string; 
    password_verify : string;

    constructor(){
        this.email = "";
        this.first_name = "";
        this.last_name = "";
        this.password = "";
        this.username = "";
        this.password_verify = "";
    }
}
