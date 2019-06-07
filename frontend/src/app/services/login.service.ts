import { Injectable, Inject, Output,EventEmitter } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../app.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 
  private httpOptions: any;
  
  public token: string | null;

  public userId : string | null;
  
  public token_expires: Date;
  
  public username: string;
 
  public errors: any = [];

  private url;

  @Output() EsAutenticado: EventEmitter<boolean> = new EventEmitter();

  constructor(@Inject(APP_CONFIG) config:AppConfig, private http: HttpClient,
        private jwtHelper: JwtHelperService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    this.url = config.apiEndpoint;

    if (localStorage.getItem('access_token')){
      this.token = localStorage.getItem('access_token')
      this.getData();
    }
  }

  ngOnInit() {
    if (localStorage.getItem('access_token')){
      this.token = localStorage.getItem('access_token');
      this.getData();
    }
  }

  login(user): Observable<any> {
    return this.http.post( this.url +'api-token-auth/', JSON.stringify(user), this.httpOptions);
  }

  public refreshToken() {
    this.http.post(this.url + 'api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
    this.userId = null;
    localStorage.removeItem('access_token');
  }
 
  public updateData(_token) {
    localStorage.setItem('access_token', _token);
    this.token = _token;
    this.errors = [];
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
    this.userId = token_decoded.user_id;
  }

  getData(){
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
    this.userId = token_decoded.user_id;
    this.ChangeEmit(true);
  }

  public isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  public ChangeEmit(valor: boolean){
    this.EsAutenticado.emit(valor);
  }
}
