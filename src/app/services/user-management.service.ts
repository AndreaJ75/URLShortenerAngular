import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ADMIN_USER, API_URL} from '../app.constants';
import {Observable} from 'rxjs';
import {AppUser} from '../interfaces/app-user';
import {Pageable} from '../sort-Pagination/pagination/pageable';
import {SortableColumn} from '../sort-Pagination/sorting/sortable-column';

@Injectable({
  providedIn: 'root'
})

export class UserManagementService {

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
