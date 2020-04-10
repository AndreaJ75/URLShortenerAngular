import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { UrlLink } from '../interfaces/url-link';
import {API_URL} from '../app.constants';
import {UrlForUser} from '../interfaces/url-for-user';
import {stringify} from 'querystring';
import {TokenInt} from '../interfaces/token-int';
import {Token} from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class UrlCreationService {

  autoCheck;

  constructor(private http: HttpClient) {

  }

  createUrlLink(urlLong: string): Observable<UrlLink> {
    const urlForCreation = API_URL + 'urlLinks/guest';
    return this.http.post<UrlLink>(urlForCreation, urlLong);
  }

  getUrlLinks(): Observable<any> {
    const urlForCreation = API_URL + 'urlLinks/user/getsorted';
    return this.http.get<UrlLink>(urlForCreation);
  }

  createUrlLinkForUser(urlLongForUser: UrlForUser):Observable<UrlLink> {

    const urlForCreation = API_URL + 'urlLinks/user';
    return this.http.post<UrlLink>(urlForCreation, urlLongForUser);
  }
}
