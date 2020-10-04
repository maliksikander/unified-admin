import {AdminMainComponent} from './admin-main/admin-main.component';
import {Routes} from '@angular/router';
import { DisplayComponent } from './general-settings/display/display.component';
import { LocaleComponent } from './general-settings/locale/locale.component';
import { DatabaseComponent } from './general-settings/database/database.component';
import { LoggingComponent } from './general-settings/logging/logging.component';
import { ReportingComponent } from './general-settings/reporting/reporting.component';
import { AmqComponent } from './general-settings/amq/amq.component';
import { SecurityComponent } from './general-settings/security/security.component';
export const adminRoutes: Routes = [
    {
        path: '', component: AdminMainComponent,
        children: [
          { path: '', redirectTo: 'general/display-settings', pathMatch: 'full' },
          { path: 'general/display-settings', component: DisplayComponent},
          { path: 'general/locale-settings', component: LocaleComponent},
          { path: 'general/database-settings', component: DatabaseComponent},
          { path: 'general/logging-settings', component: LoggingComponent},
          { path: 'general/reporting-settings', component: ReportingComponent},
          { path: 'general/amq-settings', component: AmqComponent},
          { path: 'general/security-settings', component: SecurityComponent},
        ]
    }
];
