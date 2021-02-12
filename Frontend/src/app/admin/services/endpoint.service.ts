import { SnackbarService } from './snackbar.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";
import { throwError } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  configJSON: any = "assets/config/config.json";
  ADMIN_URL;
  MRE_URL;
  userRoles = [];
  token;

  constructor(private snackbar: SnackbarService,
    private httpClient: HttpClient,
    private configService: ConfigService,
    private _router: Router) {

    let e = this.configService.configData;
    this.ADMIN_URL = e.Admin_URL;
    this.MRE_URL = e.MRE_URL;
    this.userRoles = e.BUSINESS_USER_ROLES;

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }
  }

  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }


  //////////////////// General Group CRUD ////////////

  createSetting(data, reqServiceType): Observable<any> {
    return this.httpClient.post<any>(`${this.ADMIN_URL}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  getSetting(reqServiceType): Observable<any> {
    return this.httpClient.get<any>(`${this.ADMIN_URL}/${reqServiceType}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  updateSetting(data, reqServiceType): Observable<void> {
    return this.httpClient.put<void>(`${this.ADMIN_URL}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  ///////////////////// RE CRUD ////////////////////////

  create(data, reqServiceType): Observable<any> {
    return this.httpClient.post<any>(`${this.MRE_URL}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  get(reqServiceType): Observable<any> {
    return this.httpClient.get(`${this.MRE_URL}/${reqServiceType}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  update(data, id, reqServiceType): Observable<any> {
    return this.httpClient.put<any>(`${this.MRE_URL}/${reqServiceType}/${id}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  delete(id, reqServiceType): Observable<any> {
    return this.httpClient.delete<any>(`${this.MRE_URL}/${reqServiceType}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  /////////////// Keycloak /////////////////

  login(data): Observable<any> {
    return this.httpClient.post<any>(`${this.ADMIN_URL}/login`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getKeycloakUser(): Observable<any> {
    let url = this.ADMIN_URL + '/users';
    if (this.userRoles && this.userRoles.length > 0) {
      for (let i = 0; i < this.userRoles.length; i++) {
        if (url.indexOf('?') === -1) {
          url = url + '?roles[]=' + this.userRoles[i];
        } else {
          url = url + '&roles[]=' + this.userRoles[i];
        }
      }
    }
    return this.httpClient.get<any>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

}