import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor( private loginService : LoginService, private route: Router) { }

  intercept(
    req : HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>>{
    var accessToken = this.loginService.token;
    if (accessToken){
      const headers = req.headers.set('Authorization', 'JWT '+ accessToken);
      req = req.clone({ headers });  
    }
   
   /* if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }

    req = req.clone({ headers: req.headers.set('Accept', 'application/json') }); */

    return next.handle(req).pipe( tap(() => {}, error => {
      var respError = error as HttpErrorResponse;
      if (respError && (respError.status === 401 || respError.status === 403 || respError.status === 404)) {
        localStorage.removeItem('access_token');
        this.route.navigate(['/login']);
      }
    }));
  }
}
