import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UrlLink } from '../interfaces/url-link';
import {API_URL, USER_URL} from '../app.constants';
import {UrlForUser} from '../interfaces/url-for-user';


@Injectable({
  providedIn: 'root'
})
export class UrlCreationService {

  constructor(private http: HttpClient) {
  }

  createUrlLink(urlLong: string): Observable<UrlLink> {
    const urlForCreation = API_URL + 'urlLinks/guest';
    return this.http.post<UrlLink>(urlForCreation, urlLong);
  }

  getUrlLinkById(urlLinkId): Observable<UrlLink> {
    console.log('********** get UrllinkById');
    const urlForGetById = API_URL + USER_URL + '/getById/' + urlLinkId;
    console.log('URL for GETBy ID = ' + urlForGetById);
    return this.http.get<UrlLink>(urlForGetById);
  }

  getUrlLinks(): Observable<any> {
    const urlForGetUsersUrls = API_URL + USER_URL + '/getsorted';
    return this.http.get<any>(urlForGetUsersUrls);
  }

  createUrlLinkForUser(urlLongForUser: UrlForUser):Observable<UrlLink> {
    const urlForCreation = API_URL + USER_URL;
    return this.http.post<UrlLink>(urlForCreation, urlLongForUser);
  }

  updateUrlFeedLinkForUser(urlLongForUser:UrlForUser): Observable<UrlLink> {
    const urlForUpdate = API_URL + USER_URL;
    return this.http.put<UrlLink>(urlForUpdate, urlLongForUser);
  }

  delUrllLink(urlLinkIdToDelete:number) : Observable<any>{
    const urlForDelete = API_URL + USER_URL +'/deleteurl/'+ urlLinkIdToDelete ;
    console.log('urlfor delete = ' + urlForDelete);
    //return this.http.delete<any>(urlForDelete +`${urlLinkIdToDelete}`);
    return this.http.delete<any>(urlForDelete);
  }
}
