import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ConcursoModel } from '../models/concurso-model';
import { ConcursoService } from '../services/concurso.service';
import { GlobaldataService } from '../services/globaldata.service';


@Component({
  selector: 'app-list-concurso',
  templateUrl: './list-concurso.component.html',
  styleUrls: ['./list-concurso.component.css']
})
export class ListConcursoComponent implements OnInit {

  listConcurso : ConcursoModel[];

  constructor(public concursoService : ConcursoService, private loginService:LoginService,
    private router: Router, private globalService: GlobaldataService) { }

  ngOnInit() {
    if (this.loginService.userId == null){
      this.router.navigate(['/login']);
       return;
    }
    this.getConcursos();
  }

  getConcursos(){
    this.concursoService.getByUser(this.loginService.userId).subscribe(
      result => {        
        this.listConcurso =result;
        this.listConcurso.sort( (a, b) => { if (a.Fecha_Creacion < b.Fecha_Creacion) return  1; return -1 });
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
  }

  
  agregar(){
    this.globalService.HabilitarCampos = true;
    this.globalService.IdEvento = "0";
    this.globalService.Operacion = "Nuevo";
    this.router.navigate(['/concurso']);
  }

  detalle (idConcurso : string){
    this.globalService.HabilitarCampos = false;
    this.globalService.IdEvento = idConcurso;
    this.globalService.Operacion = "Detalle";
    this.router.navigate(['/concurso']);
  }

  actualizar(idConcurso : string){
    this.globalService.HabilitarCampos = true;
    this.globalService.IdEvento = idConcurso;
    this.globalService.Operacion = "Actualizar";
    this.router.navigate(['/concurso']);
  }

  eliminar(idConcurso : string){
    this.concursoService.delete(idConcurso).subscribe(
      result => {
          this.getConcursos();
          alert("Evento eliminado correctamente");
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
