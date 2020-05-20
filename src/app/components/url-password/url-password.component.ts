import {Component, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {UrlManagementService} from '../../services/url-management.service';
import {ActivatedRoute} from '@angular/router';
import {UrlRedirect} from '../../interfaces/url-redirect';


@Component({
  selector: 'app-url-password',
  templateUrl: './url-password.component.html',
  styleUrls: ['./url-password.component.css']
})
export class UrlPasswordComponent implements OnInit {

  urlPassForm;
  urlKey;
  urlRedirect: UrlRedirect;

  constructor(private formBuilder: FormBuilder,
              private urlManagementService: UrlManagementService,
              private routeAct: ActivatedRoute) {
    this.urlPassForm = this.formBuilder.group (
      {
        urlPassword : ''
      }
    );
  }

  ngOnInit() {
    this.routeAct.paramMap.subscribe(params => {
      this.urlKey = params.get('urlKey');
    },
      err => console.log('wrong param key')
    );
  }

  onSubmit(urlPassForm) {
    this.urlManagementService
      .getUrlLinkRedirectwithPassword(this.urlKey, urlPassForm.urlPassword)
      .subscribe(newUrl => {
        this.urlRedirect = newUrl;
        window.location.href = this.urlRedirect.urlLongForRedirect;
      },
        err => alert('Wrong password, please type password')
    );
  }
}
