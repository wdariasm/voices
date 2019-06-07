import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { GrabacionModel } from '../models/grabacion-model';
import { LoginService } from '../services/login.service';
import { ConcursoModel } from '../models/concurso-model';
import { ConcursoService } from '../services/concurso.service';
import { GlobaldataService } from '../services/globaldata.service';
import { GrabacionService } from '../services/grabacion.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-grabacion',
  templateUrl: './grabacion.component.html',
  styleUrls: ['./grabacion.component.css']
})
export class GrabacionComponent implements OnInit {

  titulo: string = 'Subir Narración';

  concurso: ConcursoModel;
  grabacion: GrabacionModel;
  habilitarCampos: boolean  = true;
  habilitarConcurso : boolean = false;
  urlParam : string ; 

  constructor(public concursoService: ConcursoService, private loginService: LoginService, 
    private router: Router,  private globalService: GlobaldataService, 
    private grabacionService : GrabacionService, private activateRoute : ActivatedRoute) {
    this.grabacion = new GrabacionModel();
    this.concurso = new ConcursoModel();
  }

  ngOnInit() {

    if (this.globalService.IdEvento != null){
      console.log("ingrese");
      this.getConcurso();
    } else {
      this.activateRoute.paramMap.subscribe (params => { 
        this.urlParam = params.get ("url");
  
        if (this.urlParam != null){
          this.concursoService.getByUrl(this.urlParam).subscribe(
            result => {
              if (result != null) {
                this.globalService.IdEvento = result.id;
                console.log("no se, " + this.globalService.IdEvento);
                this.getConcurso();
              }else {
                this.cancelar();
              } 
  
            },
            error => {
              this.cancelar();
              console.log(<any>error);
            }
          );
        } else {
          this.cancelar();
        }
      })
    }


  }


  getConcurso() {
   
    this.concursoService.get(this.globalService.IdEvento).subscribe(
      result => {
        if (result != null) {
          this.concurso = result;
          this.concurso.Imagen = this.globalService.RutaStatic + this.concurso.Imagen;
        }
      },
      error => {
        console.log(<any> error);
      }
    );

  }

  guardar(frm: NgForm) {
    if (frm.invalid) {
      alert('Ingrese los campos requeridos');
      return;
    }

    if (this.grabacion.Archivo_Original == null){
      alert("Audio es requerido");
      return;
    }

    this.grabacion.Concurso_id = this.globalService.IdEvento;

    const formData = new FormData();
    formData.append('Concurso_id', this.grabacion.Concurso_id.toString());
    formData.append('Nombre_Autor', this.grabacion.Nombre_Autor);
    formData.append('Apellido_Autor', this.grabacion.Apellido_Autor);
    formData.append('Mail_Autor', this.grabacion.Mail_Autor);
    formData.append('Archivo_Original', this.grabacion.Archivo_Original);
    formData.append('Observaciones', this.grabacion.Observaciones);

    this.grabacionService.add(formData).subscribe(
      result => {        
        this.grabacion = new GrabacionModel();
        alert("Hemos recibido tu voz y la estamos procesando para que sea publicada "+
         " en la página del concurso y pueda ser posteriormente revisada por nuestro equipo de "+
        " trabajo. Tan pronto la voz quede publicada en la página del concurso te notificaremos por "+
         "email.");
         this.cancelar();
      },
      error => {
        alert("Error al guardar datos");
        console.log(JSON.stringify(error));
      }
    );

  }

  procesarAudio(audioInput: any) {
    const file: File = audioInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.grabacion.Archivo_Original = event.target.result;
    }); 

    if (file){
      var fileName = file.name;
      $('.custom-file-label').html(fileName);
    }
   
    reader.readAsDataURL(file);
  }

  cancelar(){
    this.router.navigate(['/home']);
  }

}
