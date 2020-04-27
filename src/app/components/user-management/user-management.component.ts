import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/account.service';
import {UserManagementService} from '../../services/user-management.service';
import {AppUser} from '../../interfaces/app-user';
import {FormBuilder} from '@angular/forms';
import {AppUserLocal} from '../../interfaces/app-user-local';
import {AppUserAuthoChange} from '../../interfaces/app-user-autho-change';
import {PagerService} from '../../services';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  searchForm;
  authoLevelForm;
  appUserAuthoLevel: AppUserLocal;
  appUsersAndHighestAutho: AppUserLocal[] = [];
  appUsersAuthoAndAuthoChange: AppUserAuthoChange[] = [];
  appUserAuthoAndAuthoChange: AppUserAuthoChange;
  authoLevelChange: string;
  // array of all items to be paged
  private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: AppUserAuthoChange[] = [];


  constructor(private accountService: AccountService,
              private userManagementService: UserManagementService,
              private formbuilder: FormBuilder,
              private formbuilder2: FormBuilder,
              private pagerService: PagerService) {
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

    this.appUsersAuthoAndAuthoChange = [];
    this.userManagementService.getAllUsersWithHighestAutho().subscribe(
      usersAuthoPage => {
        if (usersAuthoPage != null) {
          this.appUsersAndHighestAutho = usersAuthoPage.content;

          this.appUsersAndHighestAutho.forEach((appUserAutho) => {

            this.appUserAuthoLevel = appUserAutho;
            if (appUserAutho.highestAuthorityLevel === 'ROLE_USER') {
              this.authoLevelChange = 'ROLE_ADMIN';
            } else {
              this.authoLevelChange = 'ROLE_USER';
            }

            this.appUserAuthoAndAuthoChange = {
              appUserLocal : this.appUserAuthoLevel,
              authoLevelChange : this.authoLevelChange
            }
            // Creation of List of AppUser together with their AuthoLevel and AuthoLevelChange
            this.appUsersAuthoAndAuthoChange.push(this.appUserAuthoAndAuthoChange);
            // Initialize Pagination
            this.allItems = this.appUsersAuthoAndAuthoChange;
            this.setPage(1);

          });
        }
      }
      ,
      error => console.log('Users retrieval KO')
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

  authoLevelSelectChange(authoLevelChange, appUser: AppUser){


    if(confirm ('Do you really want to change user\'s authoritylevel change : ' + appUser.completeName)) {
      console.log('AUTHOLEVEL CHANGE ');
      console.log('authoLevelChange ? ' + authoLevelChange);
      if (authoLevelChange == 'ROLE_USER') {
        console.log ('GO REMOVE ROLE ADMIN');
        this.userManagementService.removeAppUserRole(appUser).subscribe(
          appUserAuthoPage => {
            this.getAllUsersWithHighestAutho();
          },
          error => console.log ('AuthorityLevel removal KO')
        );
      } else {
        console.log ('GO CREATE ROLE ADMIN');
        this.userManagementService.createAppUserRole(appUser).subscribe(
          appUserAuthoPage => {
            this.getAllUsersWithHighestAutho();
          },
          error => console.log('AuthorityLevel creation KO')
        );
      }
    }
  }

  onSearch(searchForm) {
  }

  onDeleteUser(userToDelete: AppUserAuthoChange){

    const index: number = this.appUsersAuthoAndAuthoChange.indexOf(userToDelete);

    if(confirm ('Do you really want to delete user : ' +
      userToDelete.appUserLocal.appUser.completeName)) {
      this.userManagementService.deleteUser(userToDelete.appUserLocal.appUser.id).subscribe(
        status => {
          this.appUsersAuthoAndAuthoChange.splice(index, 1);
          this.getAllUsersWithHighestAutho();},
        error => console.log('Delete user KO ' + error));
    }
  }
}
