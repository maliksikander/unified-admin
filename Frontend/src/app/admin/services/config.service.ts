import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

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

  constructor(private http: HttpClient) {
    this.readConfig();
  }

  readConfig() {
    this.http.get('assets/config/config.json').subscribe((data) => {
      // console.log('[ConfigService console]', data);
      this.setConfigurations(data);
    }, (error) => {
      alert('Unable to read configurations, Please contact administrator');
      console.error(error);
    });

  }

  setConfigurations(data) {
    // console.log('config data', data);
    this.DefaultLanguage = data.defaultLanguage.trim();
    this.Theme = data.theme;
    this.isRightBarActive = data.rightSidebarActive;
    this.appThemeColor = data.customThemeColor;
    this.sidebarPosition = data.defaultSidebarPosition;
    this.isCustomTheme = data.customThemeMode;
    this.isBarIconMode = data.primaryBarIconMode;
    this.onReadConfig.next();

  }
}
