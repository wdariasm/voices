import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ConcursoModel } from '../models/concurso-model';
import { ConcursoService } from '../services/concurso.service';
import { GlobaldataService } from '../services/globaldata.service';


@Component({
  selector: 'app-ver-concursos',
  templateUrl: './ver-concursos.component.html',
  styleUrls: ['./ver-concursos.component.css']
})
export class VerConcursosComponent implements OnInit {

  constructor(private concursoService : ConcursoService, private router: Router, 
    private globalService: GlobaldataService) { }

  listConcurso: ConcursoModel[];
  public rowsOnPage = 10;

  ngOnInit() {
    this.getConcursos();
  }

  getConcursos(){
    this.concursoService.getAll().subscribe(
      result => {
        if (result != null) {
          this.listConcurso = result;
          this.listConcurso.sort( (a, b) => { if (a.Fecha_Creacion < b.Fecha_Creacion) return  1; return -1 });
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  participar (concurso: ConcursoModel){
    this.globalService.IdEvento = concurso.id;
    this.router.navigate(['/concursar/' + concurso.Url_Concurso]);
  }

}
