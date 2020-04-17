import { Injectable } from '@angular/core';
import {TokenInt} from '../interfaces/token-int';
import {Observable} from 'rxjs';
import {API_URL} from '../app.constants';
import {HttpClient} from '@angular/common/http';
import {LoginAuthoLevel} from '../interfaces/login-autho-level';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  isAdmin: boolean = false;
  token: string;
  isLoggedIn: boolean = false;
  loginAuthoLevel: LoginAuthoLevel;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Get user's token stored in LocalStorage
      this.token = this.getToken();

    // return a boolean reflecting whether or not the token is expired
      if (localStorage.length > 0) {
        this.CheckTokenValidity().subscribe(
          isActive => {
            this.isLoggedIn = isActive;

            console.log('is Active ? = ' + isActive);
            if (isActive == true) {
              // If loggedIn get User Login and authoLevel
                this.getCurrentUserLoginAndAuthoLevel().subscribe(
                loginAutho => {
                  this.loginAuthoLevel = loginAutho;
                  if (this.loginAuthoLevel.authoLevel === "ROLE_ADMIN") {
                    this.isAdmin = true;
                  } else {
                    this.isAdmin = false;
                  }
                  console.log('login retrieved = ' + this.loginAuthoLevel.loginCon);
                },
                error => console.log ('Login retrieval failed = ' + error)
              );
            }

          },
          // Show error wrong login
          err =>  {
            alert('Authentification Check KO')
          }
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

  getCurrentUserLoginAndAuthoLevel(): Observable<LoginAuthoLevel> {
    const urlForLogin = API_URL + 'appUser/getCurrentUserLoginAndAuthoLevel';
    return this.http.get<LoginAuthoLevel>(urlForLogin);
  }
}
