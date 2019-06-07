import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { APP_CONFIG, SUPERVOICES_CONFIG } from './app.config';
import { AuthInterceptor } from './services/auth.interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConcursoComponent } from './concurso/concurso.component';
import { ListConcursoComponent } from './list-concurso/list-concurso.component';
import { DetalleVozComponent } from './detalle-voz/detalle-voz.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { GrabacionComponent } from './grabacion/grabacion.component';
import { ListadoVocesComponent } from './listado-voces/listado-voces.component';
import { HomeComponent } from './home/home.component';
import { VerConcursosComponent } from './ver-concursos/ver-concursos.component';

import { DataTableModule } from "angular-6-datatable";
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ConcursoComponent,
    ListConcursoComponent,
    DetalleVozComponent,
    LoginComponent,
    RegistroComponent,
    GrabacionComponent,
    ListadoVocesComponent,
    HomeComponent,
    VerConcursosComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config : {
        tokenGetter : ()=> {
          return localStorage.getItem('access_token');
        }, 
        whitelistedDomains: ['localhost']
      }

    }),
    DataTableModule
  ],
  providers: [  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
                { provide : APP_CONFIG, useValue: SUPERVOICES_CONFIG}],
  bootstrap: [AppComponent]
})
export class AppModule { }
