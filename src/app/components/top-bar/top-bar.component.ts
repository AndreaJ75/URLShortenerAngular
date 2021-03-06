import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {


  constructor(private accountService: AccountService) {
    accountService.connectedAccountCheck();
    this.accountService.isLoggedIn = accountService.isLoggedIn;
    this.accountService.loginAuthoLevel = accountService.loginAuthoLevel;
    this.accountService.isAdmin = accountService.isAdmin;
  }

  ngOnInit() {
  }

  disconnect(){
    localStorage.clear();
    this.accountService.connectedAccountCheck();
  }
}
