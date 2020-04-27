import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlLink } from '../interfaces/url-link';
import {ADMIN_URL, API_URL, USER_URL} from '../app.constants';
import {UrlForUser} from '../interfaces/url-for-user';
import {UrlDateReformat} from '../interfaces/urlDateReformat';


@Injectable({
  providedIn: 'root'
})
export class UrlManagementService {

  urlDateReformat: UrlDateReformat;

  constructor(private http: HttpClient) {
  }

  createUrlLink(urlLong: string): Observable<UrlLink> {
    const urlForCreation = API_URL + 'urlLinks/guest';
    return this.http.post<UrlLink>(urlForCreation, urlLong);
  }

  getUrlLinkById(urlLinkId): Observable<UrlLink> {
    const urlForGetById = API_URL + USER_URL + '/getById/' + urlLinkId;
    console.log('URL for GETBy ID = ' + urlForGetById);
    return this.http.get<UrlLink>(urlForGetById);
  }
  getUrlLinksForAdmin(): Observable<any>{
    console.log('Admin urlLinks');
    const urlForGetAdminsUrls = API_URL + ADMIN_URL + '/urlsAll';
    return this.http.get<any>(urlForGetAdminsUrls);
  }

  getUrlLinksForUser(): Observable<any> {
    console.log('User urlLinks');
    const urlForGetUsersUrls = API_URL + USER_URL + '/getsorted';
    return this.http.get<any>(urlForGetUsersUrls);
  }

  createUrlLinkForUser(urlLongForUser: UrlForUser): Observable<UrlLink> {
    const urlForCreation = API_URL + USER_URL;
    console.log('BEF CREATE expiration date =' + urlLongForUser.expirationDate);
    this.urlDateReformat = this.urlForUserDateReformat(urlLongForUser);
    return this.http.post<UrlLink>(urlForCreation, this.urlDateReformat);
  }

  updateUrlFeedLinkForUser(urlLongForUser: UrlForUser): Observable<UrlLink> {
    const urlForUpdate = API_URL + USER_URL;
    this.urlDateReformat = this.urlForUserDateReformat(urlLongForUser);
    console.log('LIEN UPDATE = ' + urlForUpdate);
    return this.http.put<UrlLink>(urlForUpdate, this.urlDateReformat);
  }

  delUrllLink(urlLinkIdToDelete: number): Observable<any>{
    const urlForDelete = API_URL + USER_URL + '/deleteUrl/' + urlLinkIdToDelete ;
    console.log('urlfor delete = ' + urlForDelete);
    return this.http.delete<any>(urlForDelete);
  }
  urlForUserDateReformat(urlLongForUser: UrlForUser): UrlDateReformat {
    return this.urlDateReformat = {
      id: urlLongForUser.id,
      urlLong: urlLongForUser.urlLong,
      maxClickNumber: urlLongForUser.maxClickNumber,
      expirationDate: urlLongForUser.expirationDate + 'T00:00:00.000',
      appPassword: urlLongForUser.appPassword
    };
  }
}
