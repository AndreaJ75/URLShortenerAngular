import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AccountService} from '../services/account.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor{

  constructor(public auth: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // If token stored in LocalStorage and user still loggedIn, create Header with token
    if (localStorage.length > 0) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      });

      // If header request does not include content-type, make it Application/Json content-type
      if (!request.headers.has('Content-Type')) {
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      }
      request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    }
    // Then return to next HTTP request
    return next.handle(request);
  }
}
