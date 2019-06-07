export class ConcursoModel {
    Nombre : string;
    Url_Concurso : string; 
    Fecha_Inicio : Date; 
    Fecha_Fin : Date;
    Premio : string; 
    Guion : string ; 
    Recomendaciones : string; 
    Imagen : string;
    id : string;
    Owner_id : string;
    Owner: number;
    Fecha_Creacion : Date
    constructor(){
        this.Nombre = "";
        this.Url_Concurso = "";
        this.Fecha_Inicio = null;
        this.Fecha_Fin = null;
        this.Premio = "";
        this.Guion = "";
        this.Recomendaciones = "";
        this.Imagen = "";

    }
}
