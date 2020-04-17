import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/account.service';
import {UserManagementService} from '../../services/user-management.service';
import {AppUser} from '../../interfaces/app-user';
import {FormBuilder} from '@angular/forms';
import {AppUserLocal} from '../../interfaces/app-user-local';
import {AppUserAuthoChange} from '../../interfaces/app-user-autho-change';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  appUsers: AppUser[] = [];
  searchForm;
  authoLevelForm;
  appUserAuthoLevel: AppUserLocal;
  appUsersAndHighestAutho: AppUserLocal[] = [];
  appUsersAuthoAndAuthoChange: AppUserAuthoChange[] = [];
  appUserAuthoAndAuthoChange: AppUserAuthoChange;
  authoLevelChange: string;

  constructor(private accountService: AccountService,
              private userManagementService: UserManagementService,
              private formbuilder: FormBuilder,
              private formbuilder2: FormBuilder) {
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

    this.accountService.ngOnInit();
    //this.getAllUsers();
    this.getAllUsersWithHighestAutho();

  }

  // getAllUsers(){
  //
  //   this.userManagementService.getUsers().subscribe(
  //     userPage => {
  //       if (userPage != null) {
  //         this.appUsers = userPage.content;
  //       }
  //     }
  //     ,
  //     error => console.log('Users retrieval KO')
  //   );
  // }

  getAllUsersWithHighestAutho(){

    this.appUsersAuthoAndAuthoChange = [];
    this.userManagementService.getAllUsersWithHighestAutho().subscribe(
      usersAuthoPage => {
        if (usersAuthoPage != null) {
          this.appUsersAndHighestAutho = usersAuthoPage.content;

          this.appUsersAndHighestAutho.forEach((appUserAutho) => {

            this.appUserAuthoLevel = appUserAutho;
            if (appUserAutho.highestAuthorityLevel == 'ROLE_USER') {
              this.authoLevelChange = 'ROLE_ADMIN'
            } else {
              this.authoLevelChange = 'ROLE_USER'
            }

            this.appUserAuthoAndAuthoChange = {
              appUserLocal : this.appUserAuthoLevel,
              authoLevelChange : this.authoLevelChange
            }
            // Creation of List of AppUser together with their AuthoLevel and AuthoLevelChange
            this.appUsersAuthoAndAuthoChange.push(this.appUserAuthoAndAuthoChange);
          })
        }
      }
      ,
      error => console.log('Users retrieval KO')
    );
  }

  authoLevelSelectChange(authoLevelChange,appUser:AppUser){


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
         )
      } else {
        console.log ('GO CREATE ROLE ADMIN');
          this.userManagementService.createAppUserRole(appUser).subscribe(
          appUserAuthoPage => {
            this.getAllUsersWithHighestAutho();
          },
          error => console.log('AuthorityLevel creation KO')
        )
      }
    }
  }

  onSearch(searchForm) {

 }

  onDeleteUser(userToDelete:AppUserAuthoChange){

    const index: number = this.appUsersAuthoAndAuthoChange.indexOf(userToDelete);

    if(confirm ('Do you really want to delete user : ' +
      userToDelete.appUserLocal.appUser.completeName)) {
      this.userManagementService.deleteUser(userToDelete.appUserLocal.appUser.id).subscribe(
        status => {this.appUsersAuthoAndAuthoChange.splice(index, 1);},
        error => console.log('Delete user KO ' + error))
    }
  }

}
