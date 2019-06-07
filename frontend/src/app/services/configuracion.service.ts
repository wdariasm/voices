import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

   URL_Api : string = "" ; 

  constructor() { 
    this.URL_Api = "";
  }
}
