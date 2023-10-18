import { CommonService } from "./common.service";
import { SnackbarService } from "./snackbar.service";
import { Injectable, OnInit } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class HttpInterceptorService {
  url;
  i = 1;
  snackbar_ref;
  evt_type;

  constructor(
    private snackbar: SnackbarService,
    private commonService: CommonService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
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
      
        let statusCode: number | undefined;
        let description: string | undefined;
        let reason: string | undefined;
        let msg: string;
      
        if (error.status) {
          statusCode = error.status;
        }
      
        if (error.error && error.error.error_message) {
          msg = error.error.error_message;
        } else {
          msg = error.error || error.message;
        }
      
        if (error.error && error.error.error_detail) {
          if (error.error.error_detail.error_description) {
            description = error.error.error_detail.error_description;
          }
          if (error.error.error_detail.reason) {
            reason = error.error.error_detail.reason;
          }
        }
      
        // Construct the error message dynamically based on the available information
        let errorMessage = `${statusCode}: ${msg}`;
        if (description) {
          errorMessage += ` Description: ${description}`;
        }
        if (reason) {
          if (description) {
            errorMessage += `, Reason: ${reason}`;
          } else {
            errorMessage += ` Reason: ${reason}`;
          }
        }
        if (!statusCode && !description && !reason) {
          errorMessage = 'An error occurred without specific details.';
        }

        this.snackbar.snackbarMessage("error-snackbar", errorMessage, 5);
        this.commonService._spinnerSubject.next(false);
      
        return throwError(error);
      })
      
    );
  }
}
