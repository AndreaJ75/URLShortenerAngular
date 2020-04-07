import { Injectable } from '@angular/core';
import {API_URL} from '../app.constants';
import {Token} from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Login} from '../interfaces/login';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  authenticateUser(signLogin: Login): Observable<Token>{
    const urlForAuthentication = API_URL + 'authenticate';
    return this.http.post<Token>(urlForAuthentication, signLogin);
  }
}
