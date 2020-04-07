import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {LoginService} from '../../services/login.service';

import {AccountService} from '../../services/account.service';
import {Router} from '@angular/router';
import {Login} from '../../interfaces/login';

@Component({
  selector: 'app-sign-up',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm;

  constructor(private formbuilder: FormBuilder,
              private loginService: LoginService,
              private routerNav: Router,
              private accountService: AccountService) {
    this.loginForm = this.formbuilder.group (
      {
        login : '',
        password : ''
      }
    );
  }

  ngOnInit() {
  }

  onSubmit(signLogin: Login) {
    this.loginService.authenticateUser(signLogin).subscribe(
      token => {
        // Call accountService to store token
        this.accountService.OnAuthentication(token, signLogin.login);
        alert('Welcome ' + signLogin.login);
        // inform top-bar about status change before going back to home page
        this.accountService.ngOnInit();
        this.routerNav.navigate(['']);
      },
      // Show error wrong login
      err => alert('Invalid Authentication')
    );

    // clear user creation form once creation completed
    this.loginForm.reset();
  }
}

