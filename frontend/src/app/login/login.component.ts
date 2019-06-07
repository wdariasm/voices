import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { UsuarioModel } from '../models/usuario-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario : UsuarioModel;

  constructor(private loginService: LoginService, private router: Router) {
    this.usuario = new UsuarioModel();
  }

  ngOnInit() {
    this.usuario.username = "";
    this.usuario.password = "";
  }

  iniciar(frm: NgForm){
    if (frm.invalid) {
      alert("Ingrese los campos requeridos");
      return;
    }

    this.loginService.login(this.usuario).subscribe(
      data => {
        this.loginService.updateData(data['token']);
        
        if (this.loginService.token != null ){
          setInterval( ()=> {this.loginService.refreshToken()}, 1800000);          
          this.loginService.ChangeEmit(true);
          this.router.navigate(['/mis-concursos']);  

        } else {
           alert("Credenciales de usuarios no validas.");
        }
      },
      err => {
        this.loginService.errors = err['error'];
        alert("Credenciales de usuarios no validas.");
      }
    ); 

  }

  registro(){
    this.router.navigate(['/registro']);
  }

}
