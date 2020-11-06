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
  configJSON: any = "assets/config/config.json"
  endpointUrl="http://localhost:3000/api";
  MRE_MICRO_URL = "https://hcdev.expertflow.com/mre-microservice/mre/api";
  // MRE_MICRO_URL = "";

  constructor(private snackbar: SnackbarService,
    private httpClient: HttpClient,
    private _router: Router) {
    this.readConfigJson().subscribe((e) => {
      // this.endpointUrl = e.Admin_URL;
      // this.MRE_MICRO_URL = e.MRE_URL;   
      // console.log("service end-->",this.endpointUrl,this.MRE_MICRO_URL);        
  });


  }


  readConfigJson(): Observable<any> {
    return this.httpClient.get(this.configJSON);
}


  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }


  //////////////////// General Group ////////////

  createSetting(data, reqServiceType): Observable<any> {
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

  updateSetting(data, reqServiceType): Observable<void> {
    return this.httpClient.put<void>(`${this.endpointUrl}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  ///////////////////// MRE Endpoints ////////////////////////

  create(data,reqServiceType): Observable<any> {
    return this.httpClient.post<any>(`${this.MRE_MICRO_URL}/${reqServiceType}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  get(reqServiceType): Observable<any> {
    return this.httpClient.get(`${this.MRE_MICRO_URL}/${reqServiceType}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      })
    }).pipe(catchError(this.handleError));
  }

  update(data, id,reqServiceType): Observable<any> {
    return this.httpClient.put<any>(`${this.MRE_MICRO_URL}/${reqServiceType}/${id}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }

  delete(id,reqServiceType): Observable<any> {
    return this.httpClient.delete<any>(`${this.MRE_MICRO_URL}/${reqServiceType}/${id}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '
      })
    }).pipe(catchError(this.handleError));
  }


}

