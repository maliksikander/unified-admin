import { AdminMainComponent } from "./admin-main/admin-main.component";
import { Routes } from "@angular/router";
import { DisplayComponent } from "./general-settings/display/display.component";
import { LocaleComponent } from "./general-settings/locale/locale.component";
import { DatabaseComponent } from "./general-settings/database/database.component";
import { LoggingComponent } from "./general-settings/logging/logging.component";
import { ReportingComponent } from "./general-settings/reporting/reporting.component";
import { AmqComponent } from "./general-settings/amq/amq.component";
import { SecurityComponent } from "./general-settings/security/security.component";
import { AttributeComponent } from "./route-settings/attribute/attribute.component";
import { MrdComponent } from "./route-settings/mrd/mrd.component";
import { PrecisionQueueComponent } from "./route-settings/precision-queue/precision-queue.component";
import { UsersComponent } from "./route-settings/users/users.component";
import { LoginComponent } from "../authentication/login/login.component";
import { CalendarComponent } from "./general-settings/calendar/calendar.component";
import { LicenseManagerComponent } from "./general-settings/license-manager/license-manager.component";
import { ChannelListComponent } from "./channel-manager/channel/channel-list.component";
import { ChannelConnectorComponent } from "./channel-manager/channel-connector/channel-connector.component";
import { BotListComponent } from "./bot/bot-list/bot-list.component";
import { FormsComponent } from "./forms/forms.component";
import { ChannelTypeComponent } from "./channel-manager/channel-type/channel-type.component";
import { ReasonCodesComponent } from "./reason-codes/reason-codes.component";
import { PullModeRoutingComponent } from "./pull-mode-routing/pull-mode-routing.component";
import { WebWidgetListComponent } from "./web-widget-list/web-widget-list.component";
import { ChannelProviderComponent } from "./channel-manager/channel-provider/channel-provider.component";
import { AuthGuard } from "./services/auth.guard";
import { NotFoundComponent } from "../authentication/not-found/not-found.component";
import {MrdTasksComponent} from "./route-settings/mrd-tasks/mrd-tasks.component";
import {AgentDeskSettingsComponent} from "./agent-desk-settings/agent-desk-settings.component";
import {EmailSignatureComponent} from './email/email-signature/email-signature.component';
import {EmailAutoResponseComponent} from './email/email-auto-response/email-auto-response.component';

export const adminRoutes: Routes = [
  {
    path: "",
    component: AdminMainComponent,
    children: [
      { path: "", redirectTo: "/login", pathMatch: "full" },

      // { path: '', redirectTo: 'general/amq-settings', pathMatch: 'full' },
      // { path: "business-calendar", component: CalendarComponent },
      // { path: "general/display-settings", component: DisplayComponent },
      {
        path: "general/locale-settings",
        component: LocaleComponent,
        canActivate: [AuthGuard],
      },
      // { path: "general/database-settings", component: DatabaseComponent },
      {
        path: "general/license-manager",
        component: LicenseManagerComponent,
        canActivate: [AuthGuard],
      },
      // { path: "general/logging-settings", component: LoggingComponent },
      // { path: "general/reporting-settings", component: ReportingComponent },
      // { path: "general/amq-settings", component: AmqComponent },
      // { path: "general/security-settings", component: SecurityComponent },
      {
        path: "routing/attributes",
        component: AttributeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "routing/media-routing-domain",
        component: MrdComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "routing/precision-queue",
        component: PrecisionQueueComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "routing/agents",
        component: UsersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "routing/mrd-tasks",
        component: MrdTasksComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "channel/channel-type",
        component: ChannelTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "channel/channel-connector",
        component: ChannelConnectorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "channel/channel-manager",
        component: ChannelListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "channel/channel-provider",
        component: ChannelProviderComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "bot-settings",
        component: BotListComponent,
        canActivate: [AuthGuard],
      },
      { path: "form", component: FormsComponent, canActivate: [AuthGuard] },
      {
        path: "reason-code",
        component: ReasonCodesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "pull-mode-list",
        component: PullModeRoutingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "web-widget",
        component: WebWidgetListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "agent-desk",
        component: AgentDeskSettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "email/signature",
        component: EmailSignatureComponent,
      }, {
        path: "email/auto-response",
        component: EmailAutoResponseComponent,
      },
      {
        path: "not-found",
        component: NotFoundComponent,
      },
      // { path: "**", redirectTo: "/not-found", pathMatch: "full" },
    ],
  },
];
