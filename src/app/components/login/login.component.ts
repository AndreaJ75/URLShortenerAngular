import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {AccountService} from '../../services/account.service';
import {Router} from '@angular/router';
import {Login} from '../../interfaces/login';
import {TokenInt} from '../../interfaces/token-int';

@Component({
  selector: 'app-sign-up',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  tokenToStore: TokenInt;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder,
              private loginService: LoginService,
              private routerNav: Router,
              private accountService: AccountService) {
    this.loginForm = this.formBuilder.group (
      {
        login : ['', Validators.required],
        password : ['', Validators.required]
      }
    );
  }

  ngOnInit() {
  }

  onSubmit(signLogin: Login) {

    console.log('valeur loginFormget = ' + this.loginForm.get('login'));
    this.isSubmitted = true;
    this.loginService.authenticateUser(signLogin).subscribe(
      token => {
        this.tokenToStore = token;
        // Call accountService to store token
        this.accountService.OnAuthentication(token);
        alert('Welcome ' + signLogin.login);
        // inform top-bar about status change before going back to home page
        this.accountService.ngOnInit();
        this.routerNav.navigate(['']);
        // clear user login form once completed OK
        this.loginForm.reset();
      },
      // Show error wrong login
      err => {alert('Invalid Authentication');}
    );

  }
}

