export class GrabacionModel {
    Nombre_Autor : string; 
    Apellido_Autor : string; 
    Fecha_Publicacion : Date;
    Estado_Archivo : number;
    Archivo_Original : string; 
    Archivo_Final : string; 
    Observaciones: string;  
    Mail_Autor : string; 
    id : string;
    Concurso_id : string;

    constructor(){
        this.Apellido_Autor = "";
        this.Archivo_Final = "";
        this.Archivo_Original = "";
        this.Estado_Archivo = 0;
        this.Fecha_Publicacion = null;
        this.Nombre_Autor = "";
        this.Observaciones = "";
        this.Mail_Autor = "";
    }
}
