import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {UrlManagementService} from '../../services/url-management.service';
import {UrlLink} from '../../interfaces/url-link';
import {AccountService} from '../../services/account.service';
import {UrlForUser} from '../../interfaces/url-for-user';
import {API_URL_SHORT} from '../../app.constants';
import {UrlDateReformat} from '../../interfaces/urlDateReformat';
import DateTimeFormat = Intl.DateTimeFormat;

@Component({
  selector: 'app-url-update',
  templateUrl: './url-update.component.html',
  styleUrls: ['./url-update.component.css']
})
export class UrlUpdateComponent implements OnInit {

  urlLinkFormUser;
  urlLinkToEdit: UrlLink;
  callUrlLink = false;
  urlStart = API_URL_SHORT;
  dateReformated: string;

  constructor(private formbuilderUser: FormBuilder,
              private routeAct: ActivatedRoute,
              private routerNav: Router,
              private urlManagementService: UrlManagementService,
              private accountService: AccountService) {

    this.urlLinkFormUser = this.formbuilderUser.group (
      {
        id: '',
        urlLong: '',
        expirationDate: '',
        appPassword: '',
        maxClickNumber: ''
      }
    );
  }

  ngOnInit() {

    this.routeAct.paramMap.subscribe(params => {
      console.log('PARAM results = ' + params.get('urlInd'));
      this.urlManagementService.getUrlLinkById([params.get('urlInd')]).subscribe(
        urlLink => {
          this.urlLinkToEdit = urlLink;
          // Reformat expiration date
          this.dateReformated = this.urlManagementService
            .ReformatDate(this.urlLinkToEdit.expirationDate);
          // pre-filled the form with existing user's data
          this.urlLinkFormUser = this.formbuilderUser.group({
            id: this.urlLinkToEdit.id,
            urlLong: this.urlLinkToEdit.urlLong,
            expirationDate: this.dateReformated,
            appPassword: this.urlLinkToEdit.urlPassword,
            maxClickNumber: this.urlLinkToEdit.maxClickNumber
          })
          alert ('Please update required fields');
        },
        error => console.log('Unknown UrlId'));
    });
  }

  onUpdateUrlLink(urlLongForUser: UrlForUser) {

    console.log('UPDATE Url ID = ' + urlLongForUser.id);
    // Update urlLink on urlFeedLink data (3 attributes) for dedicated user
    this.urlManagementService.updateUrlFeedLinkForUser(urlLongForUser).subscribe(
      urlLink => {
        // Go to urlLinks
        this.routerNav.navigate(['my-url-links']);
      },
      error => alert('Urllink for Update KO')
    );
    // clear urlLink update form once update completed
    this.urlLinkFormUser.reset();
  }
}
