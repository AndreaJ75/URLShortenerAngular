import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ADMIN_URL, ADMIN_USER, API_URL} from '../app.constants';
import {Observable} from 'rxjs';
import {AppUser} from '../interfaces/app-user';
import {Pageable} from '../sort-Pagination/pagination/pageable';
import {SortableColumn} from '../sort-Pagination/sorting/sortable-column';
import {SearchForm} from '../interfaces/search-form';
import {Page} from '../sort-Pagination/pagination/page';
import {UrlLink} from '../interfaces/url-link';
import {SearchUser} from '../interfaces/search-user';

@Injectable({
  providedIn: 'root'
})

export class UserManagementService {

  dataTofilter: string;
  constructor(private http: HttpClient) { }

  getAllUsersWithAuthoLevel(pageable: Pageable, sortableColumn: SortableColumn)
    : Observable<any> {
    const urlForGetAllUserWithAuthoLevel = API_URL + ADMIN_USER
    + '/appUserAll'
    + '?page=' + pageable.pageNumber
    + '&size=' + pageable.pageSize
    + this.getSortParameters(sortableColumn);
    return this.http.get<any>(urlForGetAllUserWithAuthoLevel);
  }
  private getSortParameters(sortableColumn: SortableColumn): string {
    if (sortableColumn == null) {
      return '&sort=uid';
    }
    return '&sort=' + sortableColumn.name + ',' + sortableColumn.direction;
  }

  getAppUserFiltered(pageable: Pageable,
                     sortableColumn: SortableColumn,
                     searchForm: SearchUser): Observable<Page<AppUser>> {

    this.setDefaultFilterValues(searchForm);

    const urlForGetappUserFilteredAndSorted = API_URL + ADMIN_USER + '/getAppUserFiltered'
      + '?name=' + this.dataTofilter
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize
      + this.getSortParametersForFilter(sortableColumn);

    return this.http.get<Page<AppUser>>(urlForGetappUserFilteredAndSorted);
  }

  private getSortParametersForFilter(sortableColumn: SortableColumn): string {
    if (sortableColumn == null) {
      return '&sort=updateDate';
    }
    return '&sort=' + sortableColumn.name + ',' + sortableColumn.direction;
  }


  setDefaultFilterValues(searchForm: SearchUser) {
    this.dataTofilter = searchForm.name;

    if (searchForm.name == null) {
      this.dataTofilter = '';
    }
  }


  deleteUser(userIdToDelete: number): Observable<any> {
    const urlForDeleteUser = API_URL + ADMIN_USER + '/userId/' + userIdToDelete;
    return this.http.delete<any>(urlForDeleteUser);
  }

  removeAppUserRole(appUser: AppUser): Observable<any> {
    const urlForAppUserAuthoChange = API_URL + ADMIN_USER + '/removeAutho';
    return this.http.put<any>(urlForAppUserAuthoChange, appUser);
  }

  createAppUserRole(appUser: AppUser): Observable<any> {
    const urlForAppUserAuthoChange = API_URL + ADMIN_USER + '/createAutho';
    return this.http.put<any>(urlForAppUserAuthoChange, appUser);
  }
}
