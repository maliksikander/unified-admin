import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { loginRoute } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MainComponent} from './main/main.component';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import {AdminModule} from './admin/admin.module';
import {SharedModule} from './shared/shared.module';
import { HttpInterceptorService } from './admin/services/http-interceptor.service';
import { LoginComponent } from './authentication/login/login.component';
@NgModule({
  declarations: [
    MainComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(loginRoute),
    SharedModule,
    AdminModule,
    HttpClientModule,
  ],
  providers: [ [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
],],
  bootstrap: [MainComponent],
})
export class AppModule { }