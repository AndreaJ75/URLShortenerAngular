import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlLink } from '../interfaces/url-link';
import {ADMIN_URL, API_URL, USER_URL} from '../app.constants';
import {UrlForUser} from '../interfaces/url-for-user';
import {UrlDateReformat} from '../interfaces/urlDateReformat';
import {DatePipe} from '@angular/common';
import {Pageable} from '../sort-Pagination/pagination/pageable';
import {SortableColumn} from '../sort-Pagination/sorting/sortable-column';


@Injectable({
  providedIn: 'root'
})
export class UrlManagementService {

  urlDateReformat: UrlDateReformat;
  dateReformated: string;

  constructor(private http: HttpClient,
              public datepipe: DatePipe) {
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
  getUrlLinksForAdmin(pageable: Pageable, sortableColumn: SortableColumn): Observable<any>{
    console.log('Admin urlLinks');
    const urlForGetAdminsUrls = API_URL + ADMIN_URL + '/urlsAll'
      + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize
      + this.getSortParameters(sortableColumn);
    return this.http.get<any>(urlForGetAdminsUrls);
  }

  getUrlLinksForUser(pageable: Pageable, sortableColumn: SortableColumn): Observable<any> {
    console.log('User urlLinks');
    const urlForGetUsersUrls = API_URL + USER_URL + '/getsorted'
    + '?page=' + pageable.pageNumber
    + '&size=' + pageable.pageSize
    + this.getSortParameters(sortableColumn);
    return this.http.get<any>(urlForGetUsersUrls);
  }
  private getSortParameters(sortableColumn: SortableColumn): string {
    console.log('sortable column name = ' + sortableColumn.name);
    console.log('sortable column direction = ' + sortableColumn.direction);
    if (sortableColumn == null) {
      return '&sort=expirationDate';
    }
    return '&sort=' + sortableColumn.name + ',' + sortableColumn.direction;
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
    let date: string;
    // tslint:disable-next-line:no-unused-expression
    if (!urlLongForUser.expirationDate ) {
      date = this.datepipe.transform(new Date(Date.now()), 'yyyy-MM-ddT00:00:00.000');

      return this.urlDateReformat = {
        id: urlLongForUser.id,
        urlLong: urlLongForUser.urlLong,
        maxClickNumber: urlLongForUser.maxClickNumber,
        expirationDate: date,
        appPassword: urlLongForUser.appPassword
      };
    } else {
      return this.urlDateReformat = {
        id: urlLongForUser.id,
        urlLong: urlLongForUser.urlLong,
        maxClickNumber: urlLongForUser.maxClickNumber,
        expirationDate: urlLongForUser.expirationDate + 'T00:00:00.000',
        appPassword: urlLongForUser.appPassword
      };
    }
  }

  ReformatDate(datetoReformat) {
    const dateTransfoYY = datetoReformat.substring(0, 4);
    const dateTransfoMM = datetoReformat.substring(5, 7);
    const dateTransfoDD = datetoReformat.substring(8, 10);

    console.log('datetoReformat = ' + datetoReformat);
    console.log('dateTransfoDD = '    + dateTransfoDD);
    console.log('dateTransfoMM = '    + dateTransfoMM);
    console.log('dateTransfoYYYY = '  + dateTransfoYY);
    this.dateReformated = dateTransfoYY + '-' + dateTransfoMM + '-' + dateTransfoDD;
    return this.dateReformated;
  }
}
