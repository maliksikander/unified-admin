import { SnackbarService } from './snackbar.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";
import { throwError } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  endpointUrl;

  constructor(private snackbar: SnackbarService,
    private httpClient: HttpClient,
    private _router: Router) {

    // this.endpointUrl = location.origin + "/v1";
    this.endpointUrl = "http://localhost:3000/v1";

  }

  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }

  createSetting(data,reqServiceType): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointUrl}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getSetting(reqServiceType): Observable<any> {
    return this.httpClient.get<any>(`${this.endpointUrl}/${reqServiceType}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  updateSetting(data,reqServiceType): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }


  //////////////////////// AMQ Settings /////////////////////////////

  createAmqSetting(data): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getAmqSetting(): Observable<any> {
    return this.httpClient.get<any>(`${this.endpointUrl}/amq-setting`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  updateAmqSetting(data): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

   //////////////////////// Database Settings /////////////////////////////

   createDatabaseSetting(data): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getDatabaseSetting(): Observable<any> {
    return this.httpClient.get<any>(`${this.endpointUrl}/amq-setting`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  updateDatabaseSetting(data): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

   //////////////////////// Display Settings /////////////////////////////

   createDisplaySetting(data): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getDisplaySetting(): Observable<any> {
    return this.httpClient.get<any>(`${this.endpointUrl}/amq-setting`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  updateDisplaySetting(data): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

   //////////////////////// Locale Settings /////////////////////////////

   createLocaleSetting(data): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getLocaleSetting(): Observable<any> {
    return this.httpClient.get<any>(`${this.endpointUrl}/amq-setting`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  updateLocaleSetting(data): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

   //////////////////////// Log Settings /////////////////////////////

   createLogSetting(data): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getLogSetting(): Observable<any> {
    return this.httpClient.get<any>(`${this.endpointUrl}/amq-setting`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  updateLogSetting(data): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

   //////////////////////// Report Settings /////////////////////////////

   createReportSetting(data): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getReportSetting(): Observable<any> {
    return this.httpClient.get<any>(`${this.endpointUrl}/amq-setting`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  updateReportSetting(data): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

   //////////////////////// Security Settings /////////////////////////////

  createSecuritySetting(data): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  getSecuritySetting(): Observable<any> {
    return this.httpClient.get<any>(`${this.endpointUrl}/amq-setting`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  updateSecuritySetting(data): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/amq-setting`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }
}
