import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {UrlLink} from '../../interfaces/url-link';
import {API_URL_SHORT} from '../../app.constants';
import {UrlManagementService} from '../../services/url-management.service';
import {AccountService} from '../../services/account.service';
import {UrlForUser} from '../../interfaces/url-for-user';
import { Router} from '@angular/router';
import DateTimeFormat = Intl.DateTimeFormat;
import {stringify} from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.css']
})
export class HomePageComponent implements OnInit {

  urlLinkForm;
  urlLinkFormUser;
  callUrlLink = false;
  urlLinkCreated: UrlLink;
  urlStart = API_URL_SHORT;
  token: string;
  urlLinks: UrlLink[] =[];

  constructor(private formbuilder: FormBuilder,
              private formbuilderUser: FormBuilder,
              private urlManagementService: UrlManagementService,
              private accountService: AccountService,
              private routerNav: Router) {
    this.urlLinkForm = this.formbuilder.group (
      {
        urlLong : ''
      }
    );
    this.urlLinkFormUser = this.formbuilderUser.group (
      {
        id: '',
        urlLong: '',
        expirationDate: '',
        appPassword: '',
        maxClickNumber: ''
      }
    );
  }

  ngOnInit() {

    }

  onURLForGuest(urlLong: string) {
    this.urlManagementService.createUrlLink(urlLong).subscribe(
      urlLink => {
        this.urlLinkCreated = urlLink;
        this.callUrlLink = true;
      },
      // Show error can not create url for guest
      err => alert('UrlLink creation KO')
    );
    // clear guest creation form once creation completed
    this.urlLinkForm.reset();
  }

  onCreateUrlLink(urlLongForUser: UrlForUser) {

    this.accountService.ngOnInit();
    this.token = this.accountService.token;

    this.urlManagementService.createUrlLinkForUser(urlLongForUser).subscribe(
      urlLink => {
        // Update list of urllinks
        this.urlLinks.push(urlLink);
        this.urlLinkCreated = urlLink;
        this.callUrlLink = true;
        this.routerNav.navigate(['']);
        // this.routerNav.navigate(['my-url-links']);
      },
      // Show error can not create urlLink for user
      err => alert('UrlLink for UrlLink creation KO')
    );

    // clear user creation form once creation completed
    this.urlLinkFormUser.reset();
  }
}
