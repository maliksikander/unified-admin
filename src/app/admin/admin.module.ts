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


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(adminRoutes),
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
    ],
    declarations: [
        AdminMainComponent,
        TopBarComponent
    ],
    providers: [
        HttpClientModule,
        SnackbarService
    ],
    exports: [],

    entryComponents: [

    ],

})
export class AdminModule {

}
