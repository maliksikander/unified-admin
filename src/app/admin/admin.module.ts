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



@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(adminRoutes),
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        FilterPipeModule
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
