import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobaldataService {

  public IdEvento : string;
  public Operacion: String; 
  public HabilitarCampos: boolean;

  //public RutaStatic :  string= "http://127.0.0.1:5000/";
  public RutaStatic :  string= "";
  public RutaVoces : string = "https://d24zbi6pw8o8b.cloudfront.net/";
  constructor() { }
}
