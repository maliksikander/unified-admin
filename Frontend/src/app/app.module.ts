import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FilterPipeModule } from 'ngx-filter-pipe';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MainComponent} from './main/main.component';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import {AdminModule} from './admin/admin.module';
import {SharedModule} from './shared/shared.module';
import { HttpInterceptorService } from './admin/services/http-interceptor.service';
// import { SearchFilterPipe } from './shared/search-filter.pipe';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AdminModule,
    HttpClientModule,
    
    // FilterPipeModule
  ],
  providers: [ [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
],],
  bootstrap: [MainComponent],
})
export class AppModule { }
