import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlLink } from '../interfaces/url-link';
import {ADMIN_URL, API_URL, API_URL_SHORT, USER_URL} from '../app.constants';
import {UrlForUser} from '../interfaces/url-for-user';
import {UrlDateReformat} from '../interfaces/urlDateReformat';
import {DatePipe} from '@angular/common';
import {Pageable} from '../sort-Pagination/pagination/pageable';
import {SortableColumn} from '../sort-Pagination/sorting/sortable-column';
import {UrlRedirect} from '../interfaces/url-redirect';
import {Page} from '../sort-Pagination/pagination/page';
import {SearchForm} from '../interfaces/search-form';


@Injectable({
  providedIn: 'root'
})
export class UrlManagementService {

  dataTofilter: SearchForm;

  constructor(private http: HttpClient,
              public datepipe: DatePipe) {
  }

  createUrlLink(urlLong: string): Observable<UrlLink> {
    const urlForCreation = API_URL + 'urlLinks/guest';
    return this.http.post<UrlLink>(urlForCreation, urlLong);
  }

  getUrlLinkById(urlLinkId): Observable<UrlLink> {
    const urlForGetById = API_URL + USER_URL + '/getById/' + urlLinkId;
    return this.http.get<UrlLink>(urlForGetById);
  }
  getUrlLinksForAdmin(pageable: Pageable, sortableColumn: SortableColumn): Observable<any>{

    const urlForGetAdminsUrls = API_URL + ADMIN_URL + '/urlsAll'
      + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize
      + this.getSortParameters(sortableColumn);
    return this.http.get<any>(urlForGetAdminsUrls);
  }

  getUrlLinksForUser(pageable: Pageable, sortableColumn: SortableColumn): Observable<any> {

    const urlForGetUsersUrls = API_URL + USER_URL + '/getsorted'
    + '?page=' + pageable.pageNumber
    + '&size=' + pageable.pageSize
    + this.getSortParameters(sortableColumn);
    return this.http.get<any>(urlForGetUsersUrls);
  }
  private getSortParameters(sortableColumn: SortableColumn): string {

    if (sortableColumn == null) {
      return '&sort=updateDate';
    }
    return '&sort=' + sortableColumn.name + ',' + sortableColumn.direction;
  }

  getUrlLinkFilteredForOneUser(pageable: Pageable,
                               sortableColumn: SortableColumn,
                               searchFormData): Observable<Page<UrlLink>> {

    this.setDefaultFilterValues(searchFormData);

    const urlForOneUserFilteredAndSorted = API_URL + USER_URL + '/getFiltered'
      + '?urlLong=' + this.dataTofilter.urlLong
      + '&startDate=' + this.dataTofilter.startDate + 'T00:00:00.000'
      + '&endDate=' + this.dataTofilter.endDate + 'T23:59:00.000'
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize
      + this.getSortParameters(sortableColumn);

    return this.http.get<Page<UrlLink>>(urlForOneUserFilteredAndSorted);
  }

  getUrlLinkFilteredForAdmin(pageable: Pageable,
                             sortableColumn: SortableColumn,
                             searchFormData: SearchForm): Observable<Page<UrlLink>> {

    this.setDefaultFilterValues(searchFormData);

    const urlForAdminFilteredAndSorted = API_URL + ADMIN_URL + '/getFiltered'
      + '?name=' + this.dataTofilter.name
      + '&urlLong=' + this.dataTofilter.urlLong
      + '&startDate=' + this.dataTofilter.startDate + 'T00:00:00.000'
      + '&endDate=' + this.dataTofilter.endDate + 'T23:59:00.000'
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize
      + this.getSortParameters(sortableColumn);

    return this.http.get<Page<UrlLink>>(urlForAdminFilteredAndSorted);
  }

  getUrlLinkRedirectwithPassword(urlKey, urlPassword): Observable<UrlRedirect> {
    const urlForRedirectWithPassword = API_URL_SHORT + urlKey
    + '/' + urlPassword;
    return this.http.get<UrlRedirect>(urlForRedirectWithPassword);
  }


  createUrlLinkForUser(urlLongForUser: UrlForUser): Observable<UrlLink> {
    const urlForCreation = API_URL + USER_URL;
    const urlDateReformat = this.urlForUserDateReformat(urlLongForUser);
    return this.http.post<UrlLink>(urlForCreation, urlDateReformat);
  }

  updateUrlFeedLinkForUser(urlLongForUser: UrlForUser): Observable<UrlLink> {
    const urlForUpdate = API_URL + USER_URL;
    const urlDateReformat = this.urlForUserDateReformat(urlLongForUser);

    return this.http.put<UrlLink>(urlForUpdate, urlDateReformat);
  }

  delUrllLink(urlLinkIdToDelete: number): Observable<any>{
    const urlForDelete = API_URL + USER_URL + '/deleteUrl/' + urlLinkIdToDelete ;

    return this.http.delete<any>(urlForDelete);
  }

  urlForUserDateReformat(urlLongForUser: UrlForUser): UrlDateReformat {
    let date: string;
    let urlDateReformat: UrlDateReformat;
    // tslint:disable-next-line:no-unused-expression
    if (!urlLongForUser.expirationDate ) {
      date = this.datepipe.transform(new Date(Date.now()), 'yyyy-MM-ddT00:00:00.000');

      return urlDateReformat = {
        id: urlLongForUser.id,
        urlLong: urlLongForUser.urlLong,
        maxClickNumber: urlLongForUser.maxClickNumber,
        expirationDate: date,
        appPassword: urlLongForUser.appPassword
      };
    } else {
      return urlDateReformat = {
        id: urlLongForUser.id,
        urlLong: urlLongForUser.urlLong,
        maxClickNumber: urlLongForUser.maxClickNumber,
        expirationDate: urlLongForUser.expirationDate + 'T00:00:00.000',
        appPassword: urlLongForUser.appPassword
      };
    }
  }

  ReformatDate(datetoReformat) {
    let dateReformated: string;
    const dateTransfoYY = datetoReformat.substring(0, 4);
    const dateTransfoMM = datetoReformat.substring(5, 7);
    const dateTransfoDD = datetoReformat.substring(8, 10);

    dateReformated = dateTransfoYY + '-' + dateTransfoMM + '-' + dateTransfoDD;
    return dateReformated;
  }

  setDefaultFilterValues(searchFormData: SearchForm) {

    this.dataTofilter = searchFormData;

    if (searchFormData.name == null) {
      this.dataTofilter.name = '';
    }
    if(searchFormData.urlLong == null) {
      this.dataTofilter.urlLong = '';
    }
    if (searchFormData.startDate == null
    || searchFormData.startDate === '') {
      this.dataTofilter.startDate = '0001-01-01';
    }
    if (searchFormData.endDate == null
    || searchFormData.endDate === '') {
      this.dataTofilter.endDate = '9999-12-01';
    }
  }
}
