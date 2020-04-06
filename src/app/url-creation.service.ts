import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UrlLink } from './url-link';

@Injectable({
  providedIn: 'root'
})
export class UrlCreationService {

  constructor(private http:HttpClient) { }


  createUrlLink(urlLong:string): Observable<UrlLink> {

    
    const urlForCreation = 'http://localhost:8080/api/urllinks/guest'
     return this.http.post<UrlLink>(urlForCreation, urlLong);

  }
}
