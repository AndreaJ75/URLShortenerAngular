import { Injectable } from '@angular/core';
import {TokenInt} from '../interfaces/token-int';
import {Observable} from 'rxjs';
import {API_URL} from '../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  token: string;
  isLoggedIn : boolean = false;
  login: String;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Get user's token stored in LocalStorage
      this.token = this.getToken();

    // return a boolean reflecting whether or not the token is expired
      if (localStorage.length > 0) {
        this.CheckTokenValidity().subscribe(
          isActive => {
            this.isLoggedIn = isActive;
          },
          // Show error wrong login
          err =>  {
            alert('Authentification Check KO')
          }
        );

        this.getUserLogin().subscribe(
          login => {this.login = login;
            console.log('login retrieved = ' + this.login);
          },
          error => console.log ('Login failed Error = ' + error)
        );
      } else {
        this.isLoggedIn = false;
      }
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  OnAuthentication(token:TokenInt) {
    let key = 'token';

    localStorage.setItem(key,token.token);
  }

  CheckTokenValidity(): Observable<boolean>{
    const urlForAuthentication = API_URL + 'getAuth';
    return this.http.get<boolean>(urlForAuthentication);
  }

  getUserLogin(): Observable<String> {
    const urlForLogin = API_URL + 'getUserLogin';
    return this.http.get<String>(urlForLogin);
  }
}
