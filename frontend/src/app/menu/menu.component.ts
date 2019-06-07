import { Component, OnInit, } from '@angular/core';
import {LoginService } from '../services/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  autenticado: boolean  = false;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.autenticado = this.loginService.isAuthenticated();
    this.loginService.EsAutenticado.subscribe((e)=>{
      this.autenticado = this.loginService.isAuthenticated();
    });
  }

  salir(){
    this.loginService.logout();
    this.loginService.ChangeEmit(false);
    window.location.reload();
  }


}
