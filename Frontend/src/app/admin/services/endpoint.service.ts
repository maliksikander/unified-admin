import { SnackbarService } from "./snackbar.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { ConfigService } from "./config.service";
import { isDevMode } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EndpointService {
  configJSON: any = "assets/config/config.json";
  ADMIN_URL;
  MRE_URL;
  userRoles = [];
  CCM_URL;
  BOT_URL;
  LICENSE_URL;
  BUSINESS_CALENDAR_URL;
  FILE_ENGINE_URL;
  widgetThemes = [];
  token;
  tenant;

  endpoints = {
    botSetting: "bot-connectors",
    businessCalendars: {
      calendars: "calendars",
    },
    ccm: {
      channelType: "channel-types",
      channelConnector: "channel-connectors",
      channel: "channels",
      channelProvider: "channel-provider-interfaces",
      channelMapping: "channels/routing-id",
    },
    forms: "forms",
    formValidation: "formValidation",
    fileEngine: {
      uploadFile: "api/uploadFileStream",
      downloadFileStream: "api/downloadFileStream",
      fileStat: "api/getFileStat",
    },
    general: {
      amq: "amq-setting",
      database: "database-setting",
      display: "display-setting",
      locale: "locale-setting",
      log: "log-setting",
      report: "report-setting",
      security: "security-setting",
    },
    license: {
      fileUpload: "licenses/attachment",
      saveMasterKey: "licenses",
      getMasterKey: "masterKey",
    },
    pullMode: "pull-mode-list",
    reason: "reasons",
    routing: {
      attribute: "routing-attributes",
      mrd: "media-routing-domains",
      pq: {
        queue: "precision-queues",
        step: "steps",
      },
      agent: "agents",
    },
    webWidget: "widget-configs",
    keycloakLogin: "keycloakLogin",
    keycloakUsers: "users",
    agentDeskSettings:"agent-desk-settings"
  };

  constructor(
    private snackbar: SnackbarService,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    let e = this.configService.configData;
    this.ADMIN_URL = e.ADMIN_URL;
    this.MRE_URL = e.MRE_URL;
    this.CCM_URL = e.CCM_URL;
    this.BOT_URL = e.BOT_FRAMEWORK_URL;
    this.BUSINESS_CALENDAR_URL = e.BUSINESS_CALENDAR_URL;
    this.LICENSE_URL = e.LICENSE_MANAGER_URL;
    this.FILE_ENGINE_URL = e.FILE_ENGINE_URL;
    this.userRoles = e.BUSINESS_USER_ROLES;
    this.widgetThemes = e.WIDGET_THEMES;

    if (isDevMode()) this.ADMIN_URL = "http://localhost:3000";

    this.getStorageValues();
  }

  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }

  getStorageValues() {
    this.token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : sessionStorage.getItem("token");
    this.tenant = localStorage.getItem("tenant")
      ? localStorage.getItem("tenant")
      : sessionStorage.getItem("tenant");
  }

  //////////////////// General Group CRUD ////////////

  //////  AMQ Setting CRUD //////

  createAmqSetting(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.general.amq}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getAmqSetting(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.ADMIN_URL}/${this.endpoints.general.amq}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateAmqSetting(data): Observable<void> {
    return this.httpClient
      .put<void>(`${this.ADMIN_URL}/${this.endpoints.general.amq}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////  Database Setting CRUD //////

  createDatabaseSetting(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.general.database}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getDatabaseSetting(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.ADMIN_URL}/${this.endpoints.general.database}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateDatabaseSetting(data): Observable<void> {
    return this.httpClient
      .put<void>(`${this.ADMIN_URL}/${this.endpoints.general.database}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////  Display Setting CRUD //////

  createDisplaySetting(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.general.display}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getDisplaySetting(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.ADMIN_URL}/${this.endpoints.general.display}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateDisplaySetting(data): Observable<void> {
    return this.httpClient
      .put<void>(`${this.ADMIN_URL}/${this.endpoints.general.display}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////  Locale Setting CRUD //////

  createLocaleSetting(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.general.locale}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getLocaleSetting(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.ADMIN_URL}/${this.endpoints.general.locale}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateLocaleSetting(data): Observable<void> {
    return this.httpClient
      .put<void>(`${this.ADMIN_URL}/${this.endpoints.general.locale}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////  Log Setting CRUD //////

  createLogSetting(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.general.log}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getLogSetting(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.ADMIN_URL}/${this.endpoints.general.log}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateLogSetting(data): Observable<void> {
    return this.httpClient
      .put<void>(`${this.ADMIN_URL}/${this.endpoints.general.log}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////  Reporting Setting CRUD //////

  createReportSetting(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.general.report}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getReportSetting(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.ADMIN_URL}/${this.endpoints.general.report}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateReportSetting(data): Observable<void> {
    return this.httpClient
      .put<void>(`${this.ADMIN_URL}/${this.endpoints.general.report}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////  Security Setting CRUD //////

  createSecuritySetting(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.general.security}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getSecuritySetting(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.ADMIN_URL}/${this.endpoints.general.security}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateSecuritySetting(data): Observable<void> {
    return this.httpClient
      .put<void>(`${this.ADMIN_URL}/${this.endpoints.general.security}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  ///////////////////// Routing Engine ////////////////////////

  //////// Attribute CRUD /////////

  createAttribute(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.MRE_URL}/${this.endpoints.routing.attribute}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getAttribute(): Observable<any> {
    return this.httpClient
      .get(`${this.MRE_URL}/${this.endpoints.routing.attribute}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateAttribute(data, id): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.MRE_URL}/${this.endpoints.routing.attribute}/${id}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteAttribute(id): Observable<any> {
    return this.httpClient
      .delete<any>(
        `${this.MRE_URL}/${this.endpoints.routing.attribute}/${id}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /////////////// MRD CRUD ///////////

  createMrd(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.MRE_URL}/${this.endpoints.routing.mrd}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getMrd(): Observable<any> {
    return this.httpClient
      .get(`${this.MRE_URL}/${this.endpoints.routing.mrd}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateMrd(data, id): Observable<any> {
    return this.httpClient
      .put<any>(`${this.MRE_URL}/${this.endpoints.routing.mrd}/${id}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  deleteMrd(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.MRE_URL}/${this.endpoints.routing.mrd}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  ///////////////////  Precision Queue  /////////////////////

  ///////////////  Queue CRUD ///////////

  createQueue(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.MRE_URL}/${this.endpoints.routing.pq.queue}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getQueue(): Observable<any> {
    return this.httpClient
      .get(`${this.MRE_URL}/${this.endpoints.routing.pq.queue}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateQueue(data, id): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.MRE_URL}/${this.endpoints.routing.pq.queue}/${id}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteQueue(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.MRE_URL}/${this.endpoints.routing.pq.queue}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  ///////////////  Step CRUD ///////////

  createStep(data, queueId): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.MRE_URL}/${this.endpoints.routing.pq.queue}/${queueId}/${this.endpoints.routing.pq.step}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer" + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  // getStep(): Observable<any> {
  //   return this.httpClient
  //     .get(`${this.MRE_URL}/${this.endpoints.routing.pq.queue}`, {
  //       headers: new HttpHeaders({
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + this.token,
  //       }),
  //     })
  //     .pipe(catchError(this.handleError));
  // }

  updateStep(data, queueId, stepId): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.MRE_URL}/${this.endpoints.routing.pq.queue}/${queueId}/${this.endpoints.routing.pq.step}/${stepId}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteStep(queueId, stepId): Observable<any> {
    return this.httpClient
      .delete<any>(
        `${this.MRE_URL}/${this.endpoints.routing.pq.queue}/${queueId}/${this.endpoints.routing.pq.step}/${stepId}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /////////////// Agent/Users CRUD ///////////

  createAgent(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.MRE_URL}/${this.endpoints.routing.agent}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getAgent(): Observable<any> {
    return this.httpClient
      .get(`${this.MRE_URL}/${this.endpoints.routing.agent}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateAgent(data, id): Observable<any> {
    return this.httpClient
      .put<any>(`${this.MRE_URL}/${this.endpoints.routing.agent}/${id}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  deleteAgent(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.MRE_URL}/${this.endpoints.routing.agent}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  ///////////////////// Channel Manager ////////////////////////

  ///////// Channel Type CRUD ///////////

  createChannelType(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.CCM_URL}/${this.endpoints.ccm.channelType}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getChannelType(): Observable<any> {
    return this.httpClient
      .get(`${this.CCM_URL}/${this.endpoints.ccm.channelType}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateChannelType(data, id): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.CCM_URL}/${this.endpoints.ccm.channelType}/${id}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteChannelType(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.CCM_URL}/${this.endpoints.ccm.channelType}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getMRDMappedChannelType(mrdID): Observable<any> {
    return this.httpClient
      .get(
        `${this.CCM_URL}/${this.endpoints.ccm.channelType}/media-routing-domains/${mrdID}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer" + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  ///////////////// Channel Connector CRUD //////////

  createConnector(data): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.CCM_URL}/${this.endpoints.ccm.channelConnector}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer" + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getConnector(): Observable<any> {
    return this.httpClient
      .get(`${this.CCM_URL}/${this.endpoints.ccm.channelConnector}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getConnectorByChannelType(typeid): Observable<any> {
    return this.httpClient
      .get(
        `${this.CCM_URL}/${this.endpoints.ccm.channelConnector}?channelTypeId=${typeid}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer" + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  updateConnector(data, id): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.CCM_URL}/${this.endpoints.ccm.channelConnector}/${id}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteConnector(id): Observable<any> {
    return this.httpClient
      .delete<any>(
        `${this.CCM_URL}/${this.endpoints.ccm.channelConnector}/${id}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getConnectorHealth(url): Observable<any> {
    return this.httpClient
      .get(`${url}/${this.endpoints.ccm.channelConnector}/health`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  ////////////  Channel Provider CRUD ////////////////

  createChannelProvider(data): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.CCM_URL}/${this.endpoints.ccm.channelProvider}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer" + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getChannelProvider(): Observable<any> {
    return this.httpClient
      .get(`${this.CCM_URL}/${this.endpoints.ccm.channelProvider}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateChannelProvider(data): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.CCM_URL}/${this.endpoints.ccm.channelProvider}/${data?.id}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteChannelProvider(id): Observable<any> {
    return this.httpClient
      .delete<any>(
        `${this.CCM_URL}/${this.endpoints.ccm.channelProvider}/${id}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /////////// Channel CRUD /////////////

  createChannel(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.CCM_URL}/${this.endpoints.ccm.channel}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getChannel(): Observable<any> {
    return this.httpClient
      .get(`${this.CCM_URL}/${this.endpoints.ccm.channel}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getChannelByChannelType(typeid): Observable<any> {
    return this.httpClient
      .get(
        `${this.CCM_URL}/${this.endpoints.ccm.channel}?channelTypeId=${typeid}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer" + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  updateChannel(data, id): Observable<any> {
    return this.httpClient
      .put<any>(`${this.CCM_URL}/${this.endpoints.ccm.channel}/${id}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  deleteChannel(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.CCM_URL}/${this.endpoints.ccm.channel}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getChannelMapping(id): Observable<any> {
    return this.httpClient
      .get(`${this.CCM_URL}/${this.endpoints.ccm.channelMapping}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getBotMappedChannel(botID): Observable<any> {
    return this.httpClient
      .get(`${this.CCM_URL}/${this.endpoints.ccm.channel}/bot-id/${botID}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////////////////  FILE ENGINE API's ////////////////

  uploadToFileEngine(data): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.FILE_ENGINE_URL}/${this.endpoints.fileEngine.uploadFile}`,
        data,
        {
          headers: new HttpHeaders({
            // "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
            // "enctype": "multipart/form-data"
            // 'Authorization': 'Bearer'
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getFromFileEngine(fileName): Observable<any> {
    return this.httpClient
      .get(
        `${this.FILE_ENGINE_URL}/${this.endpoints.fileEngine.downloadFileStream}?filename=${fileName}`,
        {
          headers: new HttpHeaders({
            // "Content-Type": "application/json",
            // Authorization: "Bearer" + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getFileStats(fileName): Observable<any> {
    return this.httpClient
      .get(
        `${this.FILE_ENGINE_URL}/${this.endpoints.fileEngine.fileStat}?filename=${fileName}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            // Authorization: "Bearer" + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  ///////////////// BOT CRUD ////////////

  createBotSetting(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.BOT_URL}/${this.endpoints.botSetting}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
          Tenant: this.tenant,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getBotSetting(): Observable<any> {
    return this.httpClient
      .get(`${this.BOT_URL}/${this.endpoints.botSetting}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
          Tenant: "",
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getBotSettingByType(type): Observable<any> {
    return this.httpClient
      .get(`${this.BOT_URL}/${this.endpoints.botSetting}?type=${type}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
          Tenant: this.tenant,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateBotSetting(data): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.BOT_URL}/${this.endpoints.botSetting}/${data.botId}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
            Tenant: this.tenant,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteBotSetting(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.BOT_URL}/${this.endpoints.botSetting}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
          Tenant: this.tenant,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////// Forms ///////

  createForm(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.forms}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getForm(): Observable<any> {
    return this.httpClient
      .get(`${this.ADMIN_URL}/${this.endpoints.forms}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getFormByID(id): Observable<any> {
    return this.httpClient
      .get(`${this.ADMIN_URL}/${this.endpoints.forms}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateForm(data): Observable<any> {
    return this.httpClient
      .put<any>(`${this.ADMIN_URL}/${this.endpoints.forms}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  deleteForm(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.ADMIN_URL}/${this.endpoints.forms}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  ////////////////// Form Validation //////////////////////

  getFormValidation(): Observable<any> {
    return this.httpClient
      .get(`${this.ADMIN_URL}/${this.endpoints.formValidation}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////// Reason Code ///////

  createReasonCode(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.reason}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getReasonCode(): Observable<any> {
    return this.httpClient
      .get(`${this.ADMIN_URL}/${this.endpoints.reason}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getReasonCodeByID(id): Observable<any> {
    return this.httpClient
      .get(`${this.ADMIN_URL}/${this.endpoints.reason}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateReasonCode(data): Observable<any> {
    return this.httpClient
      .put<any>(`${this.ADMIN_URL}/${this.endpoints.reason}/${data.id}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  deleteReasonCode(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.ADMIN_URL}/${this.endpoints.reason}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////// Pull Mode List ///////

  createPullModeList(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.pullMode}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getPullModeList(): Observable<any> {
    return this.httpClient
      .get(`${this.ADMIN_URL}/${this.endpoints.pullMode}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getPullModeListByID(id): Observable<any> {
    return this.httpClient
      .get(`${this.ADMIN_URL}/${this.endpoints.pullMode}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updatePullModeList(data): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.ADMIN_URL}/${this.endpoints.pullMode}/${data.id}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deletePullModeList(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.ADMIN_URL}/${this.endpoints.pullMode}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////// Web Widget Config ///////

  createWebWidget(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.CCM_URL}/${this.endpoints.webWidget}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getWebWidgetList(): Observable<any> {
    return this.httpClient
      .get(`${this.CCM_URL}/${this.endpoints.webWidget}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateWebWidgetConfig(data, identifier): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.CCM_URL}/${this.endpoints.webWidget}/${identifier}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteWebWidget(id): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.CCM_URL}/${this.endpoints.webWidget}/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////////// License Manager /////////////

  //////////////// save master key //////////////

  saveMasterKey(key): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.LICENSE_URL}/${this.endpoints.license.saveMasterKey}?license-key=${key}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  ////////////  Get Master Key ////////////////
  getMasterKey(): Observable<any> {
    return this.httpClient
      .get(`${this.LICENSE_URL}/${this.endpoints.license.getMasterKey}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //////////////// file upload //////////////
  fileUpload(data): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.LICENSE_URL}/${this.endpoints.license.fileUpload}`,
        data,
        {
          headers: new HttpHeaders({
            // "Content-Type": undefined,
            // 'Authorization': 'Bearer'
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  ////////////////// Business Calendars ////////////////

  //////// Calendars  CRUD ///////

  createCalendars(data): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.BUSINESS_CALENDAR_URL}/${this.endpoints.businessCalendars.calendars}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getCalendars(): Observable<any> {
    return this.httpClient
      .get(
        `${this.BUSINESS_CALENDAR_URL}/${this.endpoints.businessCalendars.calendars}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getCalendarByID(id): Observable<any> {
    return this.httpClient
      .get(
        `${this.BUSINESS_CALENDAR_URL}/${this.endpoints.businessCalendars.calendars}/${id}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  updateCalendar(data): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.BUSINESS_CALENDAR_URL}/${this.endpoints.businessCalendars.calendars}/${data.id}`,
        data,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteCalendar(id): Observable<any> {
    return this.httpClient
      .delete<any>(
        `${this.BUSINESS_CALENDAR_URL}/${this.endpoints.businessCalendars.calendars}/${id}`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /////////////// Keycloak /////////////////

  login(data): Observable<any> {
    return this.httpClient
      .post<any>(`${this.ADMIN_URL}/${this.endpoints.keycloakLogin}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          // 'Authorization': 'Bearer'
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getKeycloakUser(): Observable<any> {
    let url = `${this.ADMIN_URL}/${this.endpoints.keycloakUsers}`;
    if (this.userRoles && this.userRoles.length > 0) {
      for (let i = 0; i < this.userRoles.length; i++) {
        if (url.indexOf("?") === -1) {
          url = url + "?roles[]=" + this.userRoles[i];
        } else {
          url = url + "&roles[]=" + this.userRoles[i];
        }
      }
    }
    return this.httpClient
      .get<any>(url, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }
  getAgentDeskSettings(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.ADMIN_URL}/${this.endpoints.agentDeskSettings}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }
  updateAgentDeskSettings(data): Observable<void> {
    return this.httpClient
      .put<void>(`${this.ADMIN_URL}/${this.endpoints.agentDeskSettings}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        }),
      })
      .pipe(catchError(this.handleError));
  }
}
