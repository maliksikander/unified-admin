import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AdminMainComponent} from './admin-main/admin-main.component';
import {TopBarComponent} from '../top-bar/top-bar.component';
import {HttpClientModule} from '@angular/common/http';
import {SnackbarService} from './services/snackbar.service';
import {SharedModule} from '../shared/shared.module';
import { DisplayComponent } from './general-settings/display/display.component';
import { LocaleComponent } from './general-settings/locale/locale.component';
import { DatabaseComponent } from './general-settings/database/database.component';
import { LoggingComponent } from './general-settings/logging/logging.component';
import { ReportingComponent } from './general-settings/reporting/reporting.component';
import { AmqComponent } from './general-settings/amq/amq.component';
import { SecurityComponent } from './general-settings/security/security.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { EndpointService } from './services/endpoint.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { AttributeComponent } from './route-settings/attribute/attribute.component';
import { MrdComponent } from './route-settings/mrd/mrd.component';
import { PrecisionQueueComponent } from './route-settings/precision-queue/precision-queue.component';
import { UsersComponent } from './route-settings/users/users.component';
import { CalendarComponent } from './general-settings/calendar/calendar.component';
import { LicenseManagerComponent } from './general-settings/license-manager/license-manager.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';



@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(adminRoutes),
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        FilterPipeModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
          }),
    ],
    declarations: [
        AdminMainComponent,
        TopBarComponent,
        DisplayComponent,
        LocaleComponent,
        DatabaseComponent,
        LoggingComponent,
        ReportingComponent,
        AmqComponent,
        SecurityComponent,
        AttributeComponent,
        MrdComponent,
        PrecisionQueueComponent,
        UsersComponent,
        CalendarComponent,
        LicenseManagerComponent,
    ],
    providers: [
        HttpClientModule,
        SnackbarService,
        EndpointService,
        HttpInterceptorService,
    ],
    exports: [],

    entryComponents: [

    ],

})
export class AdminModule {

}
