import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UrlCreationService } from '../url-creation.service';
import { Router } from '@angular/router';
import { UrlLink } from '../url-link';
import { UrlLong } from '../url-long';


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  urlLinkForm ;
  urlLinks : UrlLink[];
  callUrlLink : boolean = false;
  urlLinkCreated : UrlLink;

  constructor(private formbuilder : FormBuilder,
    private urlCreationService : UrlCreationService,
    private routerNav : Router) {
    this.urlLinkForm = this.formbuilder.group (
        {
          urlLong : ''
        }
      )
   }

  ngOnInit() {
  }

  onSubmit(urlLong : string) {
    
    console.log(' on submit');
    this.urlCreationService.createUrlLink(urlLong).subscribe(
      urlLink => {
        urlLink = this.urlLinkCreated
        this.callUrlLink = true;
      //  this.urlLinks.push(urlLink);
         console.log('urlLink = ' + this.urlLinkCreated.urlShortKey);     
        },
      // Show error wrong login
      err => alert('UrlLink creation KO')
      );
    
       // clear user creation form once creation completed
       this.urlLinkForm.reset();
  }

  sortOnCreationDate() {

  }

  sortOnUrlLong() {

  }

  sortOnShort() {

  }

  sortOnClickNumber() {

  }

  sortOnExpirationDate() {

  }

  sortOnLastUpdateDate() {

  }

  sortOnMaxClickNumber() {

  }

}
