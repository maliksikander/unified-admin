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
  ) { }

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
        let code;
        let msg: string;

        if (error && error?.error?.error_detail && error?.error?.error_detail?.reason && error?.error?.error_message) {
         
          let statusCode: number = error.status || 500;
          let msg: string = error.error?.error_message || "Unknown Error without specific Details";
          let reason: string | undefined = error.error?.error_detail?.reason?.error_description || error.error?.error_detail?.reason.error || error.error?.error_detail?.reason;

          // Construct the error message dynamically based on the available information
          let errorMessage = `${statusCode}: ${msg}`;
          if (reason === undefined) {
            reason = "No specific reason is provided";
          }
          errorMessage += `. Reason: ${reason}`;
          this.snackbar.snackbarMessage("error-snackbar", errorMessage, 4);
        }
        else {
          // Handle other error cases here (if necessary)
          if (error.error && error.error.message) {
            msg = error.error.message;
            if (msg) msg = msg.toUpperCase();
            this.snackbar.snackbarMessage("error-snackbar", msg, 2);
          } else {
            msg = error.error;
            if (msg && typeof msg == "string") {
              msg = msg.toUpperCase();
              this.snackbar.snackbarMessage("error-snackbar", msg, 2);
            } else {
              this.snackbar.snackbarMessage("error-snackbar", error.message, 2);
            }
          }
        }

        this.commonService._spinnerSubject.next(false);
        return throwError(error);

      })
    );
  }
}
