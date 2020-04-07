import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UrlCreationService } from '../../services/url-creation.service';
import { Router } from '@angular/router';
import { UrlLink } from '../../interfaces/url-link';
import {API_URL_Short} from '../../app.constants';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  urlLinkForm ;
  urlLinks: UrlLink[];
  callUrlLink = false;
  urlLinkCreated: UrlLink;
  urlStart = API_URL_Short;

  constructor(private formbuilder: FormBuilder,
              private urlCreationService: UrlCreationService,
              private routerNav: Router) {
    this.urlLinkForm = this.formbuilder.group (
        {
          urlLong : ''
        }
      );
   }

  ngOnInit() {
  }

  onSubmit(urlLong: string) {
    this.urlCreationService.createUrlLink(urlLong).subscribe(
      urlLink => {
        this.urlLinkCreated = urlLink;
        this.callUrlLink = true;
        // this.urlLinks.push(urlLink);
        },
        // Show error wrong login
      err => alert('UrlLink creation KO')
      );

        // clear user creation form once creation completed
    this.urlLinkForm.reset();
  }

}
