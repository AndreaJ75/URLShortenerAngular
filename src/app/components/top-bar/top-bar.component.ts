import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(private accountService: AccountService) {
    accountService.ngOnInit();
    accountService.isLoggedIn = this.accountService.isLoggedIn;
    accountService.login = this.accountService.login;
  }

  ngOnInit() {
  }

  disconnect(){
    localStorage.clear();
    this.accountService.ngOnInit();
  }

}
