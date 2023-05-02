import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
// import { EndpointService } from './endpoint.service';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class ConfigService {
  onReadConfig = new Subject<any>();
  DefaultLanguage = "en";
  Theme = "dark-theme";
  sidebarPosition = "left";
  appThemeColor = "dark-theme";
  isCustomTheme;
  isRightBarActive;
  isBarIconMode;
  configData;

  private get http() {
    return this._injector.get(HttpClient);
  }
  // private get endPointService() { return this._injector.get(EndpointService) };

  constructor(
    // private http: HttpClient,
    // private endPointService: EndpointService,
    private _injector: Injector
  ) {
    // this.readConfig();
  }

  readConfig() {
    return new Promise((resolve) => {
      this.http.get("assets/config/config.json").subscribe((config) => {
        this.configData = config;
        this.setConfigurations(config);
        resolve(config);
      });
    });
  }

  setConfigurations(data) {
    // console.log('config data', data);
    // this.DefaultLanguage = data.defaultLanguage.trim();
    this.DefaultLanguage = "en";
    // this.Theme = data.theme;
    this.Theme = "light-theme";
    // this.isRightBarActive = data.rightSidebarActive;
    this.isRightBarActive = false;
    this.appThemeColor = data.customThemeColor;
    // this.sidebarPosition = data.defaultSidebarPosition;
    this.sidebarPosition = "left";
    // this.isCustomTheme = data.customThemeMode;
    this.isCustomTheme = false;
    // this.isBarIconMode = data.primaryBarIconMode;
    this.isBarIconMode = false;
    this.onReadConfig.next(data);
  }
}
