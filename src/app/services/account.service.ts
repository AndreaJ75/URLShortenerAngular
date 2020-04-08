import { Injectable } from '@angular/core';
import {TokenInt} from '../interfaces/token-int';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  token: string;
  isLoggedIn : boolean = false;

  constructor() { }

  ngOnInit() {
    // Read user's token data
    let key = 'token';

    this.token = localStorage.getItem(key);

    if (localStorage.length > 0) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  OnAuthentication(token:TokenInt) {
    let key = 'token';

    localStorage.setItem(key,token.token);
  }

}
