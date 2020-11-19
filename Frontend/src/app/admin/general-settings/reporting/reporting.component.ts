import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {

  reportSettingForm: FormGroup;
  formErrors = {
    rcDBName: '',
    rcDBUser: '',
    rcDBPwd: '',
    rcDBUrl: ''
  };
  validations;
  reqServiceType = 'report-setting';
  spinner: any = true;
  editData: any;
  hide = true;


  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.validations = this.commonService.reportSettingErrorMessages;

    this.reportSettingForm = this.fb.group({
      reportingEnabled: [false],
      rcDBUrl: ['', [Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)]],
      rcDBUser: ['', [Validators.required, Validators.maxLength(40)]],
      rcDBPwd: ['', [Validators.required, Validators.maxLength(256)]],
      rcDBName: ['', [Validators.required, Validators.maxLength(40)]],
    });

    this.reportSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.reportSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];

    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.endPointService.readConfigJson().subscribe((e) => {
      this.getReportSetting();
    });
  }

  getReportSetting() {
    this.endPointService.getSetting(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200 && res.reportSetting.length > 0) {
          this.editData = res.reportSetting[0];
          this.reportSettingForm.patchValue({
            rcDBName: this.editData.rcDBName,
            rcDBUser: this.editData.rcDBUser,
            rcDBPwd: this.editData.rcDBPwd,
            rcDBUrl: this.editData.rcDBUrl,
            reportingEnabled: this.editData.reportingEnabled,
          });
        }
        else if(res.status == 200 && res.reportSetting.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  createReportSetting(data) {
    this.spinner = true;
    this.endPointService.createSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) {
          this.snackbar.snackbarMessage('success-snackbar', "Settings Created", 1);
          this.editData = res.reportSetting;
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error creating", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  updateReportSetting(data) {
    this.endPointService.updateSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) this.snackbar.snackbarMessage('success-snackbar', "Settings Updated", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error updating", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  onSave() {
    let data = this.reportSettingForm.value;
    if (this.editData) {
      data.id = this.editData.id;
      this.spinner = true;
      this.updateReportSetting(data);
    }
    else {
      this.createReportSetting(data);
    }
  }

}