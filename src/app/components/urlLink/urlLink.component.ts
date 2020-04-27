import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UrlManagementService } from '../../services/url-management.service';
import { UrlLink } from '../../interfaces/url-link';
import {API_URL_SHORT} from '../../app.constants';
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
  urlStart = API_URL_SHORT;
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


  constructor(private urlManagementService: UrlManagementService,
              private accountService: AccountService,
              private pagerService: PagerService,
              private routerNav: Router) {
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

  onEditUrlLink(urlLinkToEdit: UrlLink) {
    this.routerNav.navigate(['url-update/' + urlLinkToEdit.id]);
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
