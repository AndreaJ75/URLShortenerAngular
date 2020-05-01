import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/account.service';
import {UserManagementService} from '../../services/user-management.service';
import {AppUser} from '../../interfaces/app-user';
import {FormBuilder} from '@angular/forms';
import {AppUserAutho} from '../../interfaces/app-user-autho';
import {Page} from '../../sort-Pagination/pagination/page';
import {SortableColumn} from '../../sort-Pagination/sorting/sortable-column';
import {CustomPaginationService} from '../../sort-Pagination/pagination/service/custom-pagination.service';
import {CustomSortingService} from '../../sort-Pagination/sorting/service/custom-sorting.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  searchForm;
  authoLevelForm;
  appUsersAutho: AppUserAutho[] = [];
  // Pagination & sort data
  page: Page<AppUserAutho> = new Page();
  sortableColumns: Array<SortableColumn> = [];
  column: SortableColumn;


  constructor(private accountService: AccountService,
              private userManagementService: UserManagementService,
              private formbuilder: FormBuilder,
              private formbuilder2: FormBuilder,
              private paginationService: CustomPaginationService,
              private sortingService: CustomSortingService) {
    this.searchForm = this.formbuilder.group (
      {
        searchField : ''
      }
    );
    this.authoLevelForm = this.formbuilder2.group(
      {
        id : '',
        authoLevel : ''
      }
    )
  }

  ngOnInit() {
    // get all Users with their highest authority level
    this.accountService.ngOnInit();
    this.getAllUsersWithHighestAutho();
  }

  getAllUsersWithHighestAutho() {

    this.sortableColumns = [
      new SortableColumn('uid', 'Name', 'desc')
    ];
    this.column = this.sortingService.getSortableColumn(this.sortableColumns);

    this.appUsersAutho = [];
    this.userManagementService
      .getAllUsersWithHighestAutho(this.page.pageable, this.column)
      .subscribe(usersAutho => {
        if (usersAutho != null) {
          this.appUsersAutho = usersAutho.content;
            // populate page
          this.page = usersAutho;
          console.log('pageSize = ' + this.page.size);
          console.log('pageNumber = ' + this.page.number);
          console.log('sort = ' + this.page.pageable.sort);
        }
      }
      ,
      error => console.log('Users retrieval KO')
    );
  }

  authoLevelSelectChange(authoLevelChange, appUser: AppUser){

    if(confirm ('Do you really want to change user\'s authoritylevel change : ' + appUser.completeName)) {
      console.log('AUTHOLEVEL CHANGE ');
      console.log('authoLevelChange ? ' + authoLevelChange);
      if (authoLevelChange === 'ROLE_USER') {
        console.log ('GO REMOVE ROLE ADMIN');
        this.userManagementService.removeAppUserRole(appUser).subscribe(
          appUserAuthoAndOppAutoPage => {
            this.getAllUsersWithHighestAutho();
          },
          error => console.log ('AuthorityLevel removal KO')
        );
      } else {
        console.log ('GO CREATE ROLE ADMIN');
        this.userManagementService.createAppUserRole(appUser).subscribe(
          appUserAuthoAndOppAutoPage => {
            this.getAllUsersWithHighestAutho();
          },
          error => console.log('AuthorityLevel creation KO')
        );
      }
    }
  }

  onSearch(searchForm) {
  }

  onDeleteUser(userToDelete: AppUserAutho){

    const index: number = this.appUsersAutho.indexOf(userToDelete);

    if(confirm ('Do you really want to delete user : ' +
      userToDelete.appUser.completeName)) {
      this.userManagementService.deleteUser(userToDelete.appUser.id).subscribe(
        status => {
          this.appUsersAutho.splice(index, 1);
          this.getAllUsersWithHighestAutho();},
        error => console.log('Delete user KO ' + error));
    }
  }
  // Pagination method

  public getNextPage(): void {
    this.page.pageable = this.paginationService.getNextPage(this.page);
    this.getAllUsersWithHighestAutho();
  }

  public getPreviousPage(): void {
    this.page.pageable = this.paginationService.getPreviousPage(this.page);
    this.getAllUsersWithHighestAutho();
  }

  public getPageInNewSize(pageSize: number): void {
    this.page.pageable = this.paginationService.getPageInNewSize(this.page, pageSize);
    this.getAllUsersWithHighestAutho();
  }
}
