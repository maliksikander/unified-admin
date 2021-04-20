import { CommonService } from './common.service';
import { SnackbarService } from './snackbar.service';
import { Injectable, OnInit } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  permissionDeniedText;
  unAuthorized_text;
  licenseExpired_text;
  internal_server_error_text;
  url;
  i = 1;
  index;
  snackbar_ref;
  evt_type;
  error_msg;


  constructor(private snackbar: SnackbarService,
    private commonService: CommonService,) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      tap((evt: any) => {
        this.evt_type = evt.type;
        this.snackbar_ref = this.snackbar;
        if (evt.type != 0) {
          this.i = 1;
          if (this.snackbar_ref.snackbar._openedSnackBarRef != null) {
            this.snackbar_ref.snackbar.dismiss();
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {

        this.url = error.url;
        let code;
        let msg: string

        if (error.error.message) {
          msg = error.error.message;
          if (msg) msg = msg.toUpperCase();
          // code = error.error.code;
          // if (code) {
          this.snackbar.snackbarMessage('error-snackbar', msg, 2);
          // }
        }
        else {
          msg = error.error;
          if (msg && typeof (msg) == 'string') {
            msg = msg.toUpperCase();
            this.snackbar.snackbarMessage('error-snackbar', msg, 2);
          }
          else {
            this.snackbar.snackbarMessage('error-snackbar', error.message, 2);
          }
        }
        this.commonService._spinnerSubject.next(false);
        return throwError(error);

      })
    )
  };
}
