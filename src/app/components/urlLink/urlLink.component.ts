import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UrlManagementService } from '../../services/url-management.service';
import { UrlLink } from '../../interfaces/url-link';
import {API_URL_Short} from '../../app.constants';
import {AccountService} from '../../services/account.service';
import {UrlForUser} from '../../interfaces/url-for-user';
import {LoginAuthoLevel} from '../../interfaces/login-autho-level';
import {PagerService} from '../../services';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-home-page',
  templateUrl: './urlLink.component.html',
  styleUrls: ['./urlLink.component.css']
})
export class UrlLinkComponent implements OnInit {

  urlLinkForm ;
  urlLinkFormUser;
  callUrlLink = false;
  urlLinkCreated: UrlLink;
  urlStart = API_URL_Short;
  token: string;
  urlLinks: UrlLink[] =[];
  loginAuthoLevel: LoginAuthoLevel;
  isAdmin: boolean;

  // array of all items to be paged
  private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: UrlLink[];


  constructor(private formbuilder: FormBuilder,
              private formbuilderUser: FormBuilder,
              private urlManagementService: UrlManagementService,
              private accountService: AccountService,
              private pagerService: PagerService,
              private routerNav: Router) {

    // this.urlLinkForm = this.formbuilder.group (
    //   {
    //     urlLong : ''
    //   }
    // );
    // this.urlLinkFormUser = this.formbuilderUser.group (
    //   {
    //     id: '',
    //     urlLong: '',
    //     expirationDate: '',
    //     appPassword: '',
    //     maxClickNumber: ''
    //   }
    // );
  }

  ngOnInit() {
    // Get if connected
    this.token = this.accountService.token;

    if (this.token != null) {
      this.getUrlLinks();
    }

  }

  getUrlLinks(){

    this.accountService.getCurrentUserLoginAndAuthoLevel().subscribe(
      loginAuthoLevel => {this.loginAuthoLevel = loginAuthoLevel;
        if (this.loginAuthoLevel.authoLevel === 'ROLE_ADMIN') {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        };
        console.log('isAdmin ***** ? = ' + this.isAdmin);
        if (this.isAdmin) {
          this.getUrlLinksForAdmin();
        } else {
          this.getUrlLinksForUser();
        }
      },
      error => console.log('AuthoLevelAccess error')
    );
  }


  getUrlLinksForAdmin() {

    this.urlManagementService.getUrlLinksForAdmin().subscribe(
      urlLinkList =>
      {if (urlLinkList != null) {
        this.urlLinks = urlLinkList.content;
        // Initialize Pagination
        console.log('URLLINKS SIZE ADMIN = ' + this.urlLinks.length);
        this.allItems = this.urlLinks;
        this.setPage(1);
      }
      },
      err => console.log('UrlLinks for admin   not accessible')
    );
  }
  getUrlLinksForUser(){

    this.urlManagementService.getUrlLinksForUser().subscribe(
      urlLinkList =>
      {if (urlLinkList != null) {
        this.urlLinks = urlLinkList.content;
        console.log('URLLINKS SIZE USER = ' + this.urlLinks.length);
        // Initialize Pagination
        this.allItems = this.urlLinks;
        this.setPage(1);
      }
      },
      err => console.log('UrlLinks for users not accessible')
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);
    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  // onURLForGuest(urlLong: string) {
  //   this.urlManagementService.createUrlLink(urlLong).subscribe(
  //     urlLink => {
  //       this.urlLinkCreated = urlLink;
  //       this.callUrlLink = true;
  //     },
  //     // Show error wrong login
  //     err => alert('UrlLink creation KO')
  //   );
  //   // clear guest creation form once creation completed
  //   this.urlLinkForm.reset();
  // }
  //
  // onCreateUrlLink(urlLongForUser: UrlForUser) {
  //
  //   this.accountService.ngOnInit();
  //   this.token = this.accountService.token;
  //   console.log('urlLong.exp date = ' + urlLongForUser.expirationDate);
  //
  //   this.urlManagementService.createUrlLinkForUser(urlLongForUser).subscribe(
  //     urlLink => {
  //       this.urlLinks.push(urlLink);
  //       // Initialize Pagination
  //       this.allItems = this.urlLinks;
  //       this.setPage(1);
  //     },
  //     // Show error wrong login
  //     err => alert('UrlLink for UrlLink creation KO')
  //   );
  //
  //   // clear user creation form once creation completed
  //   this.urlLinkFormUser.reset();
  // }

  onEditUrlLink(urlLinkToEdit: UrlLink) {
    this.routerNav.navigate(['url-update/' + urlLinkToEdit.id]);
    // // pre-filled the form with existing user's data
    // this.urlLinkFormUser = this.formbuilderUser.group({
    //   id: urlLinkToEdit.id,
    //   urlLong: urlLinkToEdit.urlLong,
    //   expirationDate: urlLinkToEdit.expirationDate,
    //   appPassword: urlLinkToEdit.urlPassword,
    //   maxClickNumber: urlLinkToEdit.maxClickNumber
    // });
    //
    // alert ('Please update required fields');
  }

  onDeleteUrlLink(urlLinkToDelete: UrlLink) {
    console.log('****** on delete ');
    // Retrieve UrlLink data from database using its urlLinkId
    const index: number = this.urlLinks.indexOf(urlLinkToDelete);

    if (confirm ('Do you really want to Delete urlLink ' + urlLinkToDelete.urlShortKey)) {
      this.urlManagementService.delUrllLink(urlLinkToDelete.id).subscribe(
        status => {
          this.urlLinks.splice(index, 1);
          this.allItems = this.urlLinks;
          this.setPage(1);
        },
        err => console.log('Delete UrlLink KO' + err)
      );
    }
  }
}
