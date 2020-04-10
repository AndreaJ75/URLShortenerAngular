import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UrlCreationService } from '../../services/url-creation.service';
import { Router } from '@angular/router';
import { UrlLink } from '../../interfaces/url-link';
import {API_URL_Short} from '../../app.constants';
import {AccountService} from '../../services/account.service';
import {UrlForUser} from '../../interfaces/url-for-user';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  urlLinkForm ;
  urlLinkFormUser;
  callUrlLink = false;
  urlLinkCreated: UrlLink;
  urlStart = API_URL_Short;
  token:string;
  urlLinks:UrlLink[] =[];

  constructor(private formbuilder: FormBuilder,
              private formbuilderUser: FormBuilder,
              private urlCreationService: UrlCreationService,
              private accountService: AccountService,
              private routerNav: Router) {
    this.urlLinkForm = this.formbuilder.group (
        {
          urlLong : ''
        }
      );
    this.urlLinkFormUser = this.formbuilderUser.group (
      {
        urlLong: '',
        expirationDate: '',
        appPassword: '',
        maxClickNumber: ''
      }
    );
   }

  ngOnInit() {

    this.accountService.ngOnInit();
    this.token = this.accountService.token;
    this.urlCreationService.getUrlLinks().subscribe(
      urlLinkList =>
      {if (urlLinkList !=null) {
        this.urlLinks = urlLinkList.content
      }
      },
      err => console.log('UrlLinks for users not accessible')
    );

  }

  onURLForGuest(urlLong: string) {
    this.urlCreationService.createUrlLink(urlLong).subscribe(
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

  onSubmit(urlLongForUser:UrlForUser) {

    this.accountService.ngOnInit();
    this.token = this.accountService.token;
    console.log('urlLong.exp date = ' + urlLongForUser.expirationDate);

    this.urlCreationService.createUrlLinkForUser(urlLongForUser).subscribe(
      urlLink => {
        this.urlLinks.push(urlLink);
      },
      // Show error wrong login
      err => alert('UrlLink creation KO')
    );

    // clear user creation form once creation completed
    this.urlLinkFormUser.reset();
  }

}
