import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { CommonService } from "../services/common.service";
import { Router } from "@angular/router";
import { ConfigService } from "../services/config.service";
import { EndpointService } from "../services/endpoint.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-admin-main",
  templateUrl: "./admin-main.component.html",
  styleUrls: ["./admin-main.component.scss"],
})
export class AdminMainComponent implements OnInit {
  @ViewChild("sidenav", { static: true }) sidenav: MatSidenav;
  @Input() themeChange: string;
  elem;
  events: string[] = [];
  opened = true;
  rightBarOpened = false;
  otherTheme = false;
  barStatus = false;
  defaultTheme;
  appColor;
  defaultLanguage;
  sidebarPosition;
  isCustomTheme;
  isRightBarActive;
  isBarIconView;
  generalBool: boolean = false;
  botBool: boolean = false;
  formBool: boolean = false;
  reasonCodeBool: boolean = false;
  agentTeams: boolean = true;
  pullModeBool: boolean = false;
  webWidgetBool: boolean = false;
  channelBool: boolean = false;
  routingBool: boolean = false;
  calendarBool: boolean = false;
  agentDeskBool: boolean = false;
  agentMrdBool : boolean = false
  routingArrtibuteBool : boolean = false
  agentAttributeBool : boolean = false
  mrdBool : boolean = false
  queueBool : boolean = false
  subscription: Subscription;

  constructor(
    private commonService: CommonService,
    private endPointService: EndpointService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.configService.onReadConfig.subscribe((e) => {
      this.defaultTheme = this.configService.Theme;
      this.defaultLanguage = this.configService.DefaultLanguage;
      this.sidebarPosition = this.configService.sidebarPosition;
      this.isCustomTheme = this.configService.isCustomTheme;
      this.isRightBarActive = this.configService.isRightBarActive;
      this.barStatus = this.configService.isBarIconMode;
      if (this.configService.isCustomTheme === true) {
        this.appColor = this.configService.appThemeColor;
      }

      if (this.sidebarPosition === "left" && this.defaultLanguage === "ar") {
        this.sidebarPosition = "right";
      }
    });

    this.elem = document.documentElement;
    this.commonService.themeVersion.subscribe((data) => {
      // console.log(data);
      this.changeTheme();
    });
    let resources: Array<any> = JSON.parse(localStorage.getItem("resources"));

    this.enableResource(resources);
  }

  enableResource(resources: Array<any>) {
    try {
      resources.forEach((item: any) => {
        if (item.rsname === "general-settings") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.generalBool = true;
          });
        }

        if (item.rsname === "bot-settings") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.botBool = true;
          });
        }

        if (item.rsname === "forms") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.formBool = true;
          });
        }

        if (item.rsname === "reason-code") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.reasonCodeBool = true;
          });
        }
        if (item.rsname === "teams") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.agentTeams = true;
          });
        }

        if (item.rsname === "pull-mode-list") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.pullModeBool = true;
          });
        }

        if (item.rsname === "web-widget") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.webWidgetBool = true;
          });
        }

        if (item.rsname === "business-calendar") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.calendarBool = true;
          });
        }

        if (item.rsname === "channel-manager" && this.channelBool == false) {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.channelBool = true;
          });
        }

        if (item.rsname === "agent-desk-setting" && this.agentDeskBool == false) {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.agentDeskBool = true;
          });
        }

        if (item.rsname === "routing-engine") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.routingBool = true;
          });
        }

        if (item.rsname === "routing-attribute") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.routingArrtibuteBool = true;
          });
        }

        if (item.rsname === "mrd") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.mrdBool = true;
          });
        }

        if (item.rsname === "agent-mrd") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.agentMrdBool = true;
          });
        }

        if (item.rsname === "queue") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.queueBool = true;
          });
        }

        if (item.rsname === "agent-attributes") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") this.agentAttributeBool = true;
          });
        }
      });
    } catch (e) {
      console.log("[Enable Resource Error] :", e);
    }
  }

  clickEvent() {
    if (this.isBarIconView) {
      this.barStatus = true;
    } else {
      this.barStatus = !this.barStatus;
    }
  }

  changeTheme() {
    this.otherTheme = !this.otherTheme;
  }
}
