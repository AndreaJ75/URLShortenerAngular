import { Component, OnInit } from '@angular/core';
import { UrlManagementService } from '../../services/url-management.service';
import { UrlLink } from '../../interfaces/url-link';
import {API_URL_SHORT} from '../../app.constants';
import { AccountService } from '../../services/account.service';
import { LoginAuthoLevel } from '../../interfaces/login-autho-level';
import { Router } from '@angular/router';
import { CustomPaginationService } from '../../sort-Pagination/pagination/service/custom-pagination.service';
import { CustomSortingService } from '../../sort-Pagination/sorting/service/custom-sorting.service';
import { Page } from '../../sort-Pagination/pagination/page';
import { SortableColumn } from '../../sort-Pagination/sorting/sortable-column';
import {FormBuilder} from '@angular/forms';
import {SearchForm} from '../../interfaces/search-form';


@Component({
  selector: 'app-home-page',
  templateUrl: './urlLink.component.html',
  styleUrls: ['./urlLink.component.css']
})
export class UrlLinkComponent implements OnInit {

  urlStart = API_URL_SHORT;
  token: string;
  urlLinks: UrlLink[] =[];
  loginAuthoLevel: LoginAuthoLevel;
  isAdmin: boolean;
  searchForm;

  // Pagination & sort data
  page: Page<UrlLink> = new Page();
  column: SortableColumn;
  sortableColumns: Array<SortableColumn> = [
    new SortableColumn('expirationDate', 'Expiration Date', 'asc'),
  ];

  searchData: SearchForm;

  constructor(private urlManagementService: UrlManagementService,
              private accountService: AccountService,
              private routerNav: Router,
              private paginationService: CustomPaginationService,
              private sortingService: CustomSortingService,
              private formbuilderSearch: FormBuilder,) {
    this.searchForm = this.formbuilderSearch.group({
        searchField: ''
      }
    );

  }

  ngOnInit() {

    // get defaultSort:
    this.getDefaultSort();
    // Get if connected
    this.token = this.accountService.token;

    if (this.token != null) {
      this.getUrlLinks();
    }
  }

  getDefaultSort(){
    // set default sortCriteria to expiration date
    this.sortableColumns = [
      new SortableColumn('expirationDate', 'Expiration Date', 'desc')
    ];
    this.column = this.sortingService.getSortableColumn(this.sortableColumns);
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

    this.urlManagementService.getUrlLinksForAdmin(this.page.pageable, this.column).subscribe(
      urlLinkList =>
      {if (urlLinkList != null) {
        this.urlLinks = urlLinkList.content;
        this.page = urlLinkList;
      }
      },
      err => console.log('UrlLinks for admin   not accessible')
    );
  }
  getUrlLinksForUser(){

    this.urlManagementService.getUrlLinksForUser(this.page.pageable, this.column).subscribe(
      urlLinkList =>
      {if (urlLinkList != null) {
        this.urlLinks = urlLinkList.content;
        this.page = urlLinkList;
      }
      },
      err => console.log('UrlLinks for users not accessible')
    );
  }

  onEditUrlLink(urlLinkToEdit: UrlLink) {
    this.routerNav.navigate(['url-update/' + urlLinkToEdit.id]);
  }

  onDeleteUrlLink(urlLinkToDelete: UrlLink) {

    // Retrieve UrlLink data from database using its urlLinkId
    const index: number = this.urlLinks.indexOf(urlLinkToDelete);

    if (confirm ('Do you really want to Delete urlLink ' + urlLinkToDelete.urlShortKey)) {
      this.urlManagementService.delUrllLink(urlLinkToDelete.id).subscribe(
        status => {
          this.urlLinks.splice(index, 1);
          this.getUrlLinks();
        },
        err => console.log('Delete UrlLink KO' + err)
      );
    }
  }

  // Pagination method

  public getNextPage(): void {
    this.page.pageable = this.paginationService.getNextPage(this.page);
    this.getUrlLinks();
  }

  public getPreviousPage(): void {
    this.page.pageable = this.paginationService.getPreviousPage(this.page);
    this.getUrlLinks();
  }

  public getPageInNewSize(pageSize: number): void {
    this.page.pageable = this.paginationService.getPageInNewSize(this.page, pageSize);
    this.getUrlLinks();
  }

  onSearch(searchFormData) {

    console.log('isAdmin ***** ? = ' + this.isAdmin);
    if (this.isAdmin) {
      this.getUrlLinksFilterForAdmin(searchFormData);
    // } else {
    //   this.getUrlLinksFilterForUser(searchFormData);
    }

  }

  getUrlLinksFilterForAdmin(searchFormData){

    console.log('searchFormData = ' + searchFormData);
    console.log('searchFormData.searchfield = ' + searchFormData.searchField);

    const completeName: string = searchFormData.searchField;
    let firstName = '';
    let name = '';
    for (let i = 0 ; i < completeName.length ; i++) {
        while(completeName.charAt(i) !== ' ') {
          firstName = firstName + completeName.charAt(i);
          i = i + 1;
          console.log('firstName = ' + firstName);
        }
        if (completeName.charAt(i) === ' ') {
          i = i + 1;
        }
        while(i < completeName.length) {
          name = name + completeName.charAt(i);
          console.log('name = ' + name);
          i = i + 1;
        }
    }
    console.log('firstName = ' + firstName);

    const completeSepName: SearchForm = {
      firstName: firstName,
      name: name
    };

    // this.searchData.clickNumber = searchFormData.searchField;
    // this.searchData.creationDate = searchFormData.searchField;
    // this.searchData.expirationDate = searchFormData.searchField;
    // this.searchData.maxClickNumber = searchFormData.searchField;
    // this.searchData.updateDate = searchFormData.searchField;
    // this.searchData.urlLong = searchFormData.searchField;
    // this.searchData.urlShortKey = searchFormData.searchField;

    this.urlManagementService.getUrlLinkFilteredForAdmin(this.page.pageable
      , this.column, completeSepName)
      .subscribe(urlPage => {
          if (urlPage != null) {
            this.urlLinks = urlPage.content;
            this.page = urlPage;
          }
        },
        error => console.log('Filter for admin Not found'));
  }

  // getUrlLinksFilterForUser(searchFormData){
  //
  //   this.searchData = searchFormData.searchField;
  //   // this.searchData.clickNumber = searchFormData.searchField;
  //   // this.searchData.creationDate = searchFormData.searchField;
  //   // this.searchData.expirationDate = searchFormData.searchField;
  //   // this.searchData.maxClickNumber = searchFormData.searchField;
  //   // this.searchData.updateDate = searchFormData.searchField;
  //   // this.searchData.urlLong = searchFormData.searchField;
  //   // this.searchData.urlShortKey = searchFormData.searchField;
  //
  //
  //   this.urlManagementService.getUrlLinkFilteredForOneUser(this.page.pageable
  //     , this.column, searchFormData.searchField)
  //     .subscribe(urlPage => {
  //         if (urlPage != null) {
  //           this.urlLinks = urlPage.content;
  //           this.page = urlPage;
  //         }
  //       },
  //       error => console.log('Filter for user Not found'));
  // }

  sortUrl(sortCriteria, direction, name) {
    // set default sortCriteria to updateDate
    this.sortableColumns = [
      new SortableColumn(sortCriteria, name, direction)
    ];
    this.column = this.sortingService.getSortableColumn(this.sortableColumns);
    this.getUrlLinks();
  }

  // sort(sortableColumn: SortableColumn): void {
  //   this.sortingService.clearPreviousSorting(sortableColumn, this.sortableColumns);
  //   this.getData();
  // }
  //
  // private getData(): void {
  //   let column = this.sortingService.getSortableColumn(this.sortableColumns);
  //   this.getUrlLinks();
  // }
}
