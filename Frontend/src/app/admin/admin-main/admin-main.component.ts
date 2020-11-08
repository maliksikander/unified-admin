import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {ConfigService} from '../services/config.service';
import { EndpointService } from '../services/endpoint.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})

export class AdminMainComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @Input() themeChange: string;

  elem;
  // document;
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

  constructor(
    private commonService: CommonService,
    private endPointService:EndpointService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private configService: ConfigService) {

  }

  ngOnInit() {


    this.configService.onReadConfig.subscribe((e) => {

    
      // this.endPointService.endpointUrl = e.Admin_URL;
      // this.endPointService.MRE_MICRO_URL = e.MRE_URL;
      //   console.log("comp data-->",this.endPointService.endpointUrl)
      this.defaultTheme = this.configService.Theme;
      this.defaultLanguage = this.configService.DefaultLanguage;
      this.sidebarPosition = this.configService.sidebarPosition;
      this.isCustomTheme = this.configService.isCustomTheme;
      this.isRightBarActive = this.configService.isRightBarActive;
      this.barStatus = this.configService.isBarIconMode;
      if (this.configService.isCustomTheme === true) {
        this.appColor = this.configService.appThemeColor;
      }

      if (this.sidebarPosition === 'left' && this.defaultLanguage === 'ar') {
        this.sidebarPosition = 'right';
      }
    });

    this.elem = document.documentElement;
    this.commonService.themeVersion.subscribe((data) => {
      console.log(data);
      this.changeTheme();
    });
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
