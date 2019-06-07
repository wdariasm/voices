import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../app.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcursoService {

  private url : string;
  constructor(@Inject(APP_CONFIG) config:AppConfig,  private http: HttpClient) {
    this.url = config.apiEndpoint + "concursos/";
  }

  get (id : string) : Observable<any>{
    return this.http.get(this.url + id + "/");
  }

  getAll () : Observable<any>{
    return this.http.get(this.url);
  }

  getByUser (idUser : string) : Observable<any> {
    return this.http.get(this.url + "user/" + idUser + "/");
  }

  getByUrl (url : string) : Observable<any> {
    return this.http.get(this.url + "validar/" + url + "/");
  }

  add(concurso): Observable<any>{
    //let _headers = new HttpHeaders().set('Content-Type','multipart/form-data;');
    return this.http.post(this.url, concurso);
  }

  update(id: string,  concurso): Observable<any>{
    return this.http.put(this.url +  id + "/", concurso);
  }

  delete(id: string): Observable<any> {
    return  this.http.delete(this.url + id + '/');
  };

  getGrabaciones(id : string, estado : number) : Observable<any>{
    return this.http.get(this.url + id + "/grabaciones/" + estado + "/");
  }

}
