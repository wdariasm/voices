import { Component, OnInit } from '@angular/core';

import { GrabacionModel } from '../models/grabacion-model';
import { GlobaldataService } from '../services/globaldata.service';
import { ConcursoService } from '../services/concurso.service';
import { LoginService } from '../services/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listado-voces',
  templateUrl: './listado-voces.component.html',
  styleUrls: ['./listado-voces.component.css']
})
export class ListadoVocesComponent implements OnInit {

  listGrabaciones : GrabacionModel[]; 
  urlParam : string ; 

  public rowsOnPage = 50;
  
  esAdmin : boolean = false;

  constructor(public concursoService : ConcursoService,  private globalService: GlobaldataService,
            private loginService: LoginService, private activateRoute : ActivatedRoute ) { }

  ngOnInit() {

    this.esAdmin = this.loginService.isAuthenticated();
    
    if (this.globalService.IdEvento != null){
      this.getGrabaciones();
    } else {
      this.activateRoute.paramMap.subscribe (params => { 
        this.urlParam = params.get ("url");
        if (this.urlParam != null){
          this.concursoService.getByUrl(this.urlParam).subscribe(
            result => {
              if (result != null) {
                this.globalService.IdEvento = result.id;
                this.getGrabaciones();
              }
            },
            error => {
              console.log(<any>error);
            }
          );
        } 
      })
    }
    
  }

  getGrabaciones(){
    var estado  = 1;
    if (this.esAdmin){
      estado = 0;
    }

    this.concursoService.getGrabaciones(this.globalService.IdEvento, estado).subscribe(
      result => {
        if (result != null) {
          this.listGrabaciones = result;
          this.listGrabaciones.sort( (a, b) => { if (a.Fecha_Publicacion < b.Fecha_Publicacion) return  1; return -1 });
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
