import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../app.config'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrabacionService {

  private url : string;
  constructor(@Inject(APP_CONFIG) config:AppConfig,  private http: HttpClient) { 
    this.url = config.apiEndpoint + "grabaciones/";
  }

  add(concurso): Observable<any>{
    return this.http.post(this.url, concurso);
  }
}
