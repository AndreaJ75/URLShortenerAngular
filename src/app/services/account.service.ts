import { Injectable } from '@angular/core';
import {Token} from '@angular/compiler';
import {Tokenlogin} from '../interfaces/tokenlogin';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  tokenLogin: Tokenlogin;
  isLoggedIn : boolean = false;

  constructor() { }

  ngOnInit() {
    // Read user's tokenlogin data
    let key = 'tokenLogin';
    this.tokenLogin = JSON.parse(localStorage.getItem(key));

    if (localStorage.length > 0) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  OnAuthentication(token:Token, login:string) {
    let key = 'tokenLogin';
    this.tokenLogin = {tokenStored : token, loginStored : login};

    localStorage.setItem(key,JSON.stringify(this.tokenLogin));
  }

}
