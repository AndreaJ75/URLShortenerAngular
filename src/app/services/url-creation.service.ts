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

  getUrlLinks(token:string): Observable<any> {
    const urlForCreation = API_URL + 'urlLinks/user/getsorted';

    this.autoCheck = 'Bearer ' + token;

      console.log('token in service = ' + token);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.autoCheck });
    let options = { headers: headers };

    console.log('tokennFull = ' + this.autoCheck);

    return this.http.get<UrlLink>(urlForCreation,options);
  }

  createUrlLinkForUser(urlLongForUser: UrlForUser, token:string):Observable<UrlLink> {
    // AVOIR : Rajout du Header avec token provided
    // create headers
    console.log('token in service = ' + token);
    this.autoCheck = 'Bearer ' + token;
    console.log('autocheck = ' + this.autoCheck);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.autoCheck });
    let options = { headers: headers };

    const urlForCreation = API_URL + 'urlLinks/user';
    return this.http.post<UrlLink>(urlForCreation, urlLongForUser, options);

  }
}
