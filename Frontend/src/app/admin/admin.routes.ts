import { AdminMainComponent } from './admin-main/admin-main.component';
import { Routes } from '@angular/router';
import { DisplayComponent } from './general-settings/display/display.component';
import { LocaleComponent } from './general-settings/locale/locale.component';
import { DatabaseComponent } from './general-settings/database/database.component';
import { LoggingComponent } from './general-settings/logging/logging.component';
import { ReportingComponent } from './general-settings/reporting/reporting.component';
import { AmqComponent } from './general-settings/amq/amq.component';
import { SecurityComponent } from './general-settings/security/security.component';
import { AttributeComponent } from './route-settings/attribute/attribute.component';
import { MrdComponent } from './route-settings/mrd/mrd.component';
import { PrecisionQueueComponent } from './route-settings/precision-queue/precision-queue.component';
import { UsersComponent } from './route-settings/users/users.component';
import { LoginComponent } from '../authentication/login/login.component';
import { CalendarComponent } from './general-settings/calendar/calendar.component';
import { LicenseManagerComponent } from './general-settings/license-manager/license-manager.component';
import { ChannelListComponent } from './channel-manager/channel/channel-list.component';
import { ChannelConnectorComponent } from './channel-manager/channel-connector/channel-connector.component';
import { BotListComponent } from './bot/bot-list/bot-list.component';
import { FormsComponent } from './forms/forms.component';


export const adminRoutes: Routes = [
  {
    path: '', component: AdminMainComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      // { path: '', redirectTo: 'general/amq-settings', pathMatch: 'full' },
      { path: 'general/business-calendar', component: CalendarComponent },
      { path: 'general/display-settings', component: DisplayComponent },
      { path: 'general/locale-settings', component: LocaleComponent },
      { path: 'general/database-settings', component: DatabaseComponent },
      { path: 'general/license-manager', component: LicenseManagerComponent },
      { path: 'general/logging-settings', component: LoggingComponent },
      { path: 'general/reporting-settings', component: ReportingComponent },
      { path: 'general/amq-settings', component: AmqComponent },
      { path: 'general/security-settings', component: SecurityComponent },
      { path: 'routing/attributes', component: AttributeComponent },
      { path: 'routing/media-routing-domain', component: MrdComponent },
      { path: 'routing/precision-queue', component: PrecisionQueueComponent },
      { path: 'routing/agents', component: UsersComponent },
      { path: 'channel/channel-manager', component: ChannelListComponent },
      { path: 'channel/channel-connector', component: ChannelConnectorComponent },
      { path: 'bot-settings', component: BotListComponent },
      { path: 'form', component: FormsComponent },
    ]
  }
];
