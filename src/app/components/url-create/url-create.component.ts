import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {UrlLink} from '../../interfaces/url-link';
import {UrlCreationService} from '../../services/url-creation.service';
import {Router} from '@angular/router';
import {UrlForUser} from '../../interfaces/url-for-user';
import {AccountService} from '../../services/account.service';



@Component({
  selector: 'app-url-create',
  templateUrl: './url-create.component.html',
  styleUrls: ['./url-create.component.css']
})
export class UrlCreateComponent implements OnInit {

  urlLinkFormUser ;
  urlLinks: UrlLink[]=[];
  token: string;

  constructor(private formbuilderUser: FormBuilder,
              private urlCreationService: UrlCreationService,
              private accountService : AccountService,
              private routerNav: Router) {
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
    console.log('token in ngInit create-url OOOOO = ' + this.token);
    console.log('IsloggedIN? = ' + this.accountService.isLoggedIn);
    this.urlCreationService.getUrlLinks(this.token).subscribe(
      urlLinkList =>
      {if (urlLinkList.content !=null) {
          this.urlLinks = urlLinkList.content
        }
      },
      err => console.log('UrlLinks for users not accessible')
    );
  }

  onSubmit(urlLongForUser:UrlForUser) {

    this.accountService.ngOnInit();
    this.token = this.accountService.token;
    console.log('token on submitUrlfor user = ' + this.token);
    console.log('urlLong.exp date = ' + urlLongForUser.expirationDate);


    this.urlCreationService.createUrlLinkForUser(urlLongForUser, this.token).subscribe(
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
