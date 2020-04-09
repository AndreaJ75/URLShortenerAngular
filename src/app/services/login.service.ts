import { Injectable } from '@angular/core';
import {API_URL} from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Login} from '../interfaces/login';
import {TokenInt} from '../interfaces/token-int';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  authenticateUser(signLogin: Login): Observable<TokenInt>{
    const urlForAuthentication = API_URL + 'authenticate';
    return this.http.post<TokenInt>(urlForAuthentication, signLogin);
  }
}
