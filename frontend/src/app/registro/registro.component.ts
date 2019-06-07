import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from '../models/usuario-model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  titulo : string = "Nuevo registro";
  usuario : UsuarioModel;
  habilitarCampos : boolean  = true;
  

  constructor(private router: Router, private usuarioService : UsuarioService) {
    this.usuario = new UsuarioModel();
  }

  ngOnInit() {
  }

  guardar(frm: NgForm){
    if (frm.invalid) {
      alert("Ingrese los campos requeridos");
      return;
    }

    //let username = this.usuario.email;
    //this.usuario.username =  username.replace(/[:\.-@]/g, "");
    this.usuario.username = this.usuario.email;

    this.usuarioService.add(this.usuario).subscribe(
      result => {        
        this.usuario = new UsuarioModel();
        alert("Usuario guardado correctamente");
        this.router.navigate(['/login']);
      },
      error => {
        alert("Error al guardar datos");
        console.log(JSON.stringify(error));
      }
    );
  }

  cancelar(){
    this.router.navigate(['/login']);
  }

}
