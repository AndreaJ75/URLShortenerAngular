import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {UrlLink} from '../../interfaces/url-link';
import {API_URL_Short} from '../../app.constants';
import {LoginAuthoLevel} from '../../interfaces/login-autho-level';
import {UrlManagementService} from '../../services/url-management.service';
import {AccountService} from '../../services/account.service';
import {UrlForUser} from '../../interfaces/url-for-user';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.css']
})
export class HomePageComponent implements OnInit {

  urlLinkForm;
  urlLinkToEdit: UrlLink;
  urlLinkFormUser;
  callUrlLink = false;
  urlLinkCreated: UrlLink;
  urlStart = API_URL_Short;
  token: string;
  urlLinks: UrlLink[] =[];
  loginAuthoLevel: LoginAuthoLevel;
  isAdmin: boolean;

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
      // Show error wrong login
      err => alert('UrlLink creation KO')
    );
    // clear guest creation form once creation completed
    this.urlLinkForm.reset();
  }

  onCreateUrlLink(urlLongForUser: UrlForUser) {

    this.accountService.ngOnInit();
    this.token = this.accountService.token;
    console.log('urlLong.exp date = ' + urlLongForUser.expirationDate);

    this.urlManagementService.createUrlLinkForUser(urlLongForUser).subscribe(
      urlLink => {
        // Update list of urllinks
        this.urlLinks.push(urlLink);
        this.routerNav.navigate(['my-url-links']);
      },
      // Show error wrong login
      err => alert('UrlLink for UrlLink creation KO')
    );

    // clear user creation form once creation completed
    this.urlLinkFormUser.reset();
  }
}
