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
        id:'',
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

  onCreateUrlLink(urlLongForUser:UrlForUser) {

    this.accountService.ngOnInit();
    this.token = this.accountService.token;
    console.log('urlLong.exp date = ' + urlLongForUser.expirationDate);

    this.urlCreationService.createUrlLinkForUser(urlLongForUser).subscribe(
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
    this.urlCreationService.getUrlLinkById(urlLinkId).subscribe(
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
    this.urlCreationService.updateUrlFeedLinkForUser(urlLongForUser).subscribe(
      urlLink => {
          // Get all urlLinks for dedicated user
        this.ngOnInit();
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
       this.urlCreationService.delUrllLink(urlLinkToDelete.id).subscribe(
       status => {
       this.urlLinks.splice(index, 1)},
      err => console.log('Delete UrlLink KO' + err)
      );
    }
  }
}
