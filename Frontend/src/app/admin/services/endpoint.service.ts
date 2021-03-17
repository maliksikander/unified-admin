import { SnackbarService } from './snackbar.service';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { throwError } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  configJSON: any = "assets/config/config.json";
  ADMIN_URL;
  MRE_URL;
  userRoles = [];
  CCM_URL;
  BOT_URL
  token;
  tenant;

  constructor(private snackbar: SnackbarService,
    private httpClient: HttpClient,
    private configService: ConfigService,) {

    let e = this.configService.configData;
    this.ADMIN_URL = e.Admin_URL;
    this.MRE_URL = e.MRE_URL;
    this.CCM_URL = e.CCM_URL;
    this.BOT_URL = e.BOT_URL;
    this.userRoles = e.BUSINESS_USER_ROLES;

    if (localStorage.getItem('token')) this.token = localStorage.getItem('token');
    if (localStorage.getItem('tenant')) this.tenant = localStorage.getItem('tenant');

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
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  get(reqServiceType): Observable<any> {
    return this.httpClient.get(`${this.MRE_URL}/${reqServiceType}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  update(data, id, reqServiceType): Observable<any> {
    return this.httpClient.put<any>(`${this.MRE_URL}/${reqServiceType}/${id}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  delete(id, reqServiceType): Observable<any> {
    return this.httpClient.delete<any>(`${this.MRE_URL}/${reqServiceType}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  ///////////////////// CCM CRUD ////////////////////////

  createChannel(data, reqServiceType): Observable<any> {
    return this.httpClient.post<any>(`${this.CCM_URL}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  getChannel(reqServiceType): Observable<any> {
    return this.httpClient.get(`${this.CCM_URL}/${reqServiceType}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  getByChannelType(reqServiceType, typeid): Observable<any> {
    return this.httpClient.get(`${this.CCM_URL}/${reqServiceType}?channelTypeId=${typeid}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  updateChannel(data, reqServiceType): Observable<any> {
    return this.httpClient.put<any>(`${this.CCM_URL}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  deleteChannel(id, reqServiceType): Observable<any> {
    return this.httpClient.delete<any>(`${this.CCM_URL}/${reqServiceType}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  getConnectorHealth(url): Observable<any> {
    return this.httpClient.get(`${url}/channel-connectors/health`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

  ///////////////// BOT CRUD ////////////

  createBotSetting(data): Observable<any> {

    return this.httpClient.post<any>(`${this.BOT_URL}/bot-connectors`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token,
        'Tenant': this.tenant
      })
    }).pipe(catchError(this.handleError));
  }

  getBotSetting(type): Observable<any> {

    return this.httpClient.get(`${this.BOT_URL}/bot-connectors?type=${type}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token,
        'Tenant': this.tenant
      })
    }).pipe(catchError(this.handleError));
  }

  updateBotSetting(data): Observable<any> {
    return this.httpClient.put<any>(`${this.BOT_URL}/bot-connectors/${data.botId}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Tenant': this.tenant
      })
    }).pipe(catchError(this.handleError));
  }

  deleteBotSetting(id): Observable<any> {
    return this.httpClient.delete<any>(`${this.BOT_URL}/bot-connectors/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Tenant': this.tenant
      })
    }).pipe(catchError(this.handleError));
  }

  /////////////// Keycloak /////////////////

  login(data): Observable<any> {
    return this.httpClient.post<any>(`${this.ADMIN_URL}/keycloakLogin`, data, {
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
        'Authorization': 'Bearer' + this.token
      })
    }).pipe(catchError(this.handleError));
  }

}