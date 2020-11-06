import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CommonService } from './common.service';
import { EndpointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})

export class ConfigService {
  onReadConfig = new Subject<any>();
  DefaultLanguage = 'en';
  Theme = 'dark-theme';
  sidebarPosition = 'left';
  appThemeColor = 'black';
  isCustomTheme;
  isRightBarActive;
  isBarIconMode;

  constructor(private http: HttpClient,
    private commonService: CommonService,
    private endPointService: EndpointService,) {
    this.readConfig();
  }

  readConfig() {
    this.http.get('assets/config/config.json').subscribe((data: any) => {
      console.log("config service-->", data);
      this.endPointService.endpointUrl = data.Admin_URL;
      this.endPointService.MRE_MICRO_URL = data.MRE_URL;

      console.log("service config-->", this.endPointService.endpointUrl, this.endPointService.MRE_MICRO_URL);
      this.setConfigurations(data);
    }, (error) => {
      alert('Unable to read configurations, Please contact administrator');
      console.error(error);
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
