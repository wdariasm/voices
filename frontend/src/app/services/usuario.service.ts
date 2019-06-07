import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../app.config'
import { UsuarioModel } from '../models/usuario-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url : string;
  constructor(@Inject(APP_CONFIG) config:AppConfig,  private http: HttpClient) {
    this.url = config.apiEndpoint + "users/";
   }

  add(usuario: UsuarioModel): Observable<any>{
    let data  = JSON.stringify(usuario);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(this.url, data, {headers: headers});
  }
}
