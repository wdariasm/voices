import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConcursoComponent } from './concurso/concurso.component';
import { DetalleVozComponent } from './detalle-voz/detalle-voz.component';
import { ListConcursoComponent } from './list-concurso/list-concurso.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { GrabacionComponent } from './grabacion/grabacion.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';

import { AuthGuardService } from './services/auth-guard.service';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'concurso', component: ConcursoComponent, canActivate : [AuthGuardService]},
  { path: 'detalle-voz', component : DetalleVozComponent },
  { path: 'mis-concursos', component : ListConcursoComponent, canActivate : [AuthGuardService] },
  //{ path: 'concursar' , component : GrabacionComponent },
  { path: 'concursar/:url' , component : GrabacionComponent },
  { path: 'home' , component : HomeComponent },
  { path: 'refresh' , component : MenuComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
