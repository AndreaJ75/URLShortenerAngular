import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/account.service';
import {Login} from '../../interfaces/login';
import {Tokenlogin} from '../../interfaces/tokenlogin';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(private accountService: AccountService) {
    accountService.ngOnInit();
    accountService.isLoggedIn = this.accountService.isLoggedIn;
    if (accountService.isLoggedIn == true) {
      accountService.tokenLogin= this.accountService.tokenLogin;
    }
  }

  ngOnInit() {
  }

  disconnect(){
    localStorage.clear();
    this.accountService.ngOnInit();
  }

}
