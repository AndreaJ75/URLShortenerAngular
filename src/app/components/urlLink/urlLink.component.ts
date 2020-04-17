import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UrlManagementService } from '../../services/url-management.service';
import { UrlLink } from '../../interfaces/url-link';
import {API_URL_Short} from '../../app.constants';
import {AccountService} from '../../services/account.service';
import {UrlForUser} from '../../interfaces/url-for-user';
import {LoginAuthoLevel} from '../../interfaces/login-autho-level';


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
  token:string;
  urlLinks:UrlLink[] =[];
  loginAuthoLevel: LoginAuthoLevel;
  isAdmin:boolean;


  constructor(private formbuilder: FormBuilder,
              private formbuilderUser: FormBuilder,
              private urlManagementService: UrlManagementService,
              private accountService: AccountService) {

    this.urlLinkForm = this.formbuilder.group (
        {
          urlLong : ''
        }
      );
    this.urlLinkFormUser = this.formbuilderUser.group (
      {
        id:'',
        urlLong: '',
        expirationDate: '',
        appPassword: '',
        maxClickNumber: ''
      }
    );
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
          if (this.loginAuthoLevel.authoLevel =='ROLE_ADMIN') {
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
        error=> console.log('AuthoLevelAccess error')
      )
    }


  getUrlLinksForAdmin() {

    this.urlManagementService.getUrlLinksForAdmin().subscribe(
      urlLinkList =>
      {if (urlLinkList !=null) {
        this.urlLinks = urlLinkList.content
      }
      },
      err => console.log('UrlLinks for admin   not accessible')
    );
  }
  getUrlLinksForUser(){

    this.urlManagementService.getUrlLinksForUser().subscribe(
      urlLinkList =>
      {if (urlLinkList !=null) {
        this.urlLinks = urlLinkList.content
      }
      },
      err => console.log('UrlLinks for users not accessible')
    );
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

  onCreateUrlLink(urlLongForUser:UrlForUser) {

    this.accountService.ngOnInit();
    this.token = this.accountService.token;
    console.log('urlLong.exp date = ' + urlLongForUser.expirationDate);

    this.urlManagementService.createUrlLinkForUser(urlLongForUser).subscribe(
      urlLink => {
        this.urlLinks.push(urlLink);
      },
      // Show error wrong login
      err => alert('UrlLink for UrlLink creation KO')
    );

    // clear user creation form once creation completed
    this.urlLinkFormUser.reset();
  }

  onEditUrlLink(urlLinkToEdit:UrlLink) {

    // pre-filled the form with existing user's data
    this.urlLinkFormUser = this.formbuilderUser.group({
      id: urlLinkToEdit.id,
      urlLong: urlLinkToEdit.urlLong,
      expirationDate: urlLinkToEdit.expirationDate,
      appPassword: urlLinkToEdit.urlPassword,
      maxClickNumber: urlLinkToEdit.maxClickNumber
    });

    alert ('Please update required fields');
  }

  onEditUrlLinkById(urlLinkId : number){

    // Retrieve user data from database using its userId
    this.urlManagementService.getUrlLinkById(urlLinkId).subscribe(
      urlLink => {
        // If Response Entity OK => pre-fill the form with user's retrieved data
        this.urlLinkFormUser = this.formbuilderUser.group({
            id: urlLink.id,
            urlLong: urlLink.urlLong,
            expirationDate: urlLink.expirationDate,
            appPassword: urlLink.urlPassword,
            maxClickNumber: urlLink.maxClickNumber
        }
        );
        alert ('Please update required fields');
      },
      err => alert ('urlLink data retrieval failure : ' + err)
    )
  }

  onUpdateUrlLink(urlLongForUser: UrlForUser) {

    // Update urlLink on urlFeedLink data (3 attributes) for dedicated user
    this.urlManagementService.updateUrlFeedLinkForUser(urlLongForUser).subscribe(
      urlLink => {
        if(this.accountService.isAdmin) {
          // Get all urlLinks for Admin
          this.getUrlLinksForAdmin();
        } else {
          // Get all urlLinks for dedicated user
          this.getUrlLinksForUser();
        }
      },
      error => alert('Urllink for Update KO')
    );
    // clear user creation form once creation completed
    this.urlLinkFormUser.reset();
  }


  onDeleteUrlLink(urlLinkToDelete : UrlLink) {
    console.log('****** on delete ');
    // Retrieve UrlLink data from database using its urlLinkId
    const index: number = this.urlLinks.indexOf(urlLinkToDelete);

    if (confirm ('Do you really want to Delete urlLink ' + urlLinkToDelete.urlShortKey)) {
       this.urlManagementService.delUrllLink(urlLinkToDelete.id).subscribe(
       status => {
       this.urlLinks.splice(index, 1)},
      err => console.log('Delete UrlLink KO' + err)
      );
    }
  }
}
