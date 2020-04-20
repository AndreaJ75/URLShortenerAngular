import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ADMIN_USER, API_URL} from '../app.constants';
import {Observable} from 'rxjs';
import {AppUser} from '../interfaces/app-user';
import {AppUserLocal} from '../interfaces/app-user-local';

@Injectable({
  providedIn: 'root'
})

export class UserManagementService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any>{
    const urlForGetUsers = API_URL + ADMIN_USER + '/appUserAll';
    console.log('URLforGetUsers = ' + urlForGetUsers);
    return this.http.get<any>(urlForGetUsers);
  }

  getAllUsersWithHighestAutho(): Observable<any> {
    const urlForGetAllUserHighestAutho = API_URL + ADMIN_USER
      + '/appUserAllWithHighestAutho';
    return this.http.get<any>(urlForGetAllUserHighestAutho);
  }


  deleteUser(userIdToDelete: number): Observable<any>{
    const urlForDeleteUser = API_URL + ADMIN_USER + '/userId/'+ userIdToDelete;
    return this.http.delete<any>(urlForDeleteUser);
  }
  removeAppUserRole(appUser: AppUser): Observable<any> {
    const urlForAppUserAuthoChange = API_URL + ADMIN_USER + '/removeAutho';
    return this.http.put<any>(urlForAppUserAuthoChange, appUser);
  }

  createAppUserRole(appUser: AppUser): Observable<any> {
    const urlForAppUserAuthoChange = API_URL + ADMIN_USER +'/createAutho';
    return this.http.put<any>(urlForAppUserAuthoChange, appUser);
  }
}
