import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/account.service';
import {UserManagementService} from '../../services/user-management.service';
import {AppUser} from '../../interfaces/app-user';
import {FormBuilder, Validators} from '@angular/forms';
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
  appUsersAutho: AppUser[] = [];
  // Pagination & sort data
  page: Page<AppUser> = new Page();
  sortableColumns: Array<SortableColumn> = [];
  column: SortableColumn;
  ifIsAdmins: boolean[] = [];
  ifIsAdmin: boolean;

  constructor(private accountService: AccountService,
              private userManagementService: UserManagementService,
              private formbuilder: FormBuilder,
              private formbuilder2: FormBuilder,
              private paginationService: CustomPaginationService,
              private sortingService: CustomSortingService) {
    this.searchForm = this.formbuilder.group (
      {
        name : ''
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
    this.accountService.connectedAccountCheck();
    this.getAllUsersWithAuthoLevel();
  }

  getAllUsersWithAuthoLevel() {

    this.sortableColumns = [
      new SortableColumn('uid', 'Name', 'asc')
    ];
    this.column = this.sortingService.getSortableColumn(this.sortableColumns);

    this.appUsersAutho = [];
    this.ifIsAdmins = [];
    this.userManagementService
      .getAllUsersWithAuthoLevel(this.page.pageable, this.column)
      .subscribe(usersAutho => {
        if (usersAutho != null) {
          this.appUsersAutho = usersAutho.content;
          this.appUsersAutho.forEach(
            appUser => {
              // Initialization of boolean to check if is "user" admin or user
              this.ifIsAdmin = false;
              appUser.authorities.forEach(
                authority => {
                  if (authority.authorityLevel === 'ROLE_ADMIN') {
                      this.ifIsAdmin = true;
                  }
                }
              )
              // for each user we populate boolean array with dedicated value
              this.ifIsAdmins.push(this.ifIsAdmin);
            }
          )
            // populate page
          this.page = usersAutho;
        }
      }
      ,
      error => console.log('Users retrieval KO')
    );
  }

  authoLevelSelectChange(authoLevelChange, appUser: AppUser){

    if(confirm ('Do you really want to change user\'s authoritylevel change : '
      + appUser.firstName + appUser.name)) {
      if (authoLevelChange === 'ROLE_USER') {
        // request admin role removal
        this.userManagementService.removeAppUserRole(appUser).subscribe(
          appUserAuthoAndOppAutoPage => {
            this.getAllUsersWithAuthoLevel();
          },
          error => console.log ('AuthorityLevel removal KO')
        );
      } else {
        // Add admin role to user
        this.userManagementService.createAppUserRole(appUser).subscribe(
          appUserAuthoAndOppAutoPage => {
            this.getAllUsersWithAuthoLevel();
          },
          error => console.log('AuthorityLevel creation KO')
        );
      }
    }
  }

  onSearch(searchData) {

    this.userManagementService.getAppUserFiltered(this.page.pageable
      , this.column, searchData)
      .subscribe(appUserPage => {
          if (appUserPage != null) {
            this.appUsersAutho = appUserPage.content;
            this.page = appUserPage;
          }
        },
        error => console.log('AppUser Filter Not found'));
    this.searchForm.reset();
}

  onDeleteUser(userToDelete: AppUser){

    const index: number = this.appUsersAutho.indexOf(userToDelete);

    if(confirm ('Do you really want to delete user : ' +
      userToDelete.firstName + ' ' + userToDelete.name)) {
      this.userManagementService.deleteUser(userToDelete.id).subscribe(
        status => {
          this.appUsersAutho.splice(index, 1);
          this.getAllUsersWithAuthoLevel();},
        error => console.log('Delete user KO ' + error));
    }
  }
  // Pagination method

  public getNextPage(): void {
    this.page.pageable = this.paginationService.getNextPage(this.page);
    this.getAllUsersWithAuthoLevel();
  }

  public getPreviousPage(): void {
    this.page.pageable = this.paginationService.getPreviousPage(this.page);
    this.getAllUsersWithAuthoLevel();
  }

  public getPageInNewSize(pageSize: number): void {
    this.page.pageable = this.paginationService.getPageInNewSize(this.page, pageSize);
    this.getAllUsersWithAuthoLevel();
  }
}
