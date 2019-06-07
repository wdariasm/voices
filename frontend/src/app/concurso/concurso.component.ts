import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ConcursoModel }  from '../models/concurso-model';
import { ConcursoService } from '../services/concurso.service';
import { GlobaldataService } from '../services/globaldata.service';

import * as moment from 'moment';


@Component({
  selector: 'app-concurso',
  templateUrl: './concurso.component.html',
  styleUrls: ['./concurso.component.css']
})
export class ConcursoComponent implements OnInit {

  titulo : String = "Crear concurso"; 
  concurso : ConcursoModel;
  habilitarCampos : boolean = true;
  selectedFile: ImageSnippet;
  imageSrc : string;
  esUrlValida : boolean;
  cambioImagen : boolean;

  constructor( public concursoService : ConcursoService, private loginService:LoginService, 
    private router: Router,  private globalService: GlobaldataService) { 
    this.concurso = new ConcursoModel();   
  }

  ngOnInit() {
    this.cambioImagen = false;
    this.concurso = new ConcursoModel();  
    
    if (this.globalService.IdEvento == null){
      this.cancelar();
      return; 
    } 

    this.habilitarCampos = this.globalService.HabilitarCampos;
    if(this.globalService.IdEvento != "0"){
        this.getConcurso(this.globalService.IdEvento);
    }

    this.titulo = this.globalService.Operacion + " Concurso";
  }

  guardar(frm: NgForm){
    if (frm.invalid) {
      alert("Ingrese los campos requeridos");
      return;
    }

    let fechaInicial = moment(this.concurso.Fecha_Inicio);
    let fechaFin = moment(this.concurso.Fecha_Fin);

    if (fechaInicial > fechaFin){
      alert("La fecha de inicio debe ser menor o igual a la fecha final.");
      return; 
    }

    if (!this.cambioImagen){
      this.concurso.Imagen = "";
    }


    this.concurso.Owner_id = this.loginService.userId;
    const formData = new FormData();
    /*if (this.concurso.Imagen != null && this.concurso.Imagen.length > 0){
      
    } */
    
    formData.append('Imagen', this.concurso.Imagen);
    formData.append('Owner_id', this.concurso.Owner_id.toString());
    formData.append('Nombre', this.concurso.Nombre);
    formData.append('Fecha_Inicio', this.concurso.Fecha_Inicio.toString());
    formData.append('Fecha_Fin', this.concurso.Fecha_Fin.toString());
    formData.append('Premio', this.concurso.Premio.toString());
    formData.append('Guion', this.concurso.Guion);
    formData.append('Recomendaciones', this.concurso.Recomendaciones);
    formData.append('Url', this.concurso.Url_Concurso);


    if (this.globalService.Operacion == "Nuevo"){
      if (this.concurso.Imagen == null || this.concurso.Imagen.length == 0){
        alert("El banner es requerido.");
        return;
      }

      if (!this.esUrlValida){
        alert("Url del concurso debe ser única.");
        return; 
      }

      this.concursoService.add(formData).subscribe(
        result => {        
          this.concurso = new ConcursoModel();
          alert("Concurso agregado correctamente");
          this.cancelar();
        },
        error => {
          alert("Error al guardar datos");
          console.log(JSON.stringify(error));
        }
      );

    } else  if (this.globalService.Operacion == "Actualizar"){
      
      this.concursoService.update(this.concurso.id,  formData).subscribe(
        result => {        
          this.concurso = new ConcursoModel();
          alert("Datos actualizados correctamente.");
          this.cancelar();
        },
        error => {
          alert("Error al actualizar datos.");
          console.log(JSON.stringify(error));
        });
    } else {
      alert("Operación no valida.");
    }
   
  
    
  }

  procesarBanner(imageInput: any){

    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.concurso.Imagen =event.target.result;
      this.cambioImagen = true;
    }); 

    reader.readAsDataURL(file);
  }

  getConcurso(idConcurso : string){
    this.concursoService.get(idConcurso).subscribe(
      result => {
        if (result != null) {
          this.concurso = result;
          this.concurso.Imagen = this.globalService.RutaStatic + this.concurso.Imagen;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  cancelar (){
    this.router.navigate(['/mis-concursos']);
  }

  validarUrl(){

    if (this.globalService.Operacion == "Actualizar"){
      return;
    }

    if(this.concurso.Url_Concurso == null || this.concurso.Url_Concurso.trim().length == 0){
      alert("Url del concurso es requerida");
      return; 
    }

    this.concursoService.getByUrl(this.concurso.Url_Concurso).subscribe(
      result => {
        if (result == null) {
          this.esUrlValida = true;
        } else {
          this.esUrlValida = false;
          alert("Url de concurso ya existe.");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';
  constructor(public src: string, public file: File) {}
}
