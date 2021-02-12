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
  valid = true;

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
      rcDBUrl: [''],
      rcDBUser: [''],
      rcDBPwd: [''],
      rcDBName: [''],
    });

    this.reportSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.reportSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
      if (this.reportSettingForm.status == "INVALID") {
        this.valid = false;
      }
      else {
        this.valid = true;
      }

    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.getReportSetting();

  }

  getReportSetting() {
    this.endPointService.getSetting(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200 && res.reportSetting.length > 0) {
          this.editData = res.reportSetting[0];
          this.setValidation(this.editData.reportingEnabled);
          this.reportSettingForm.patchValue({
            rcDBName: this.editData.rcDBName,
            rcDBUser: this.editData.rcDBUser,
            rcDBPwd: this.editData.rcDBPwd,
            rcDBUrl: this.editData.rcDBUrl,
            reportingEnabled: this.editData.reportingEnabled,
          });
        }
        else if (res.status == 200 && res.reportSetting.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  createReportSetting(data) {
    this.spinner = true;
    if (data.reportingEnabled == false) {
      data.rcDBUrl = '';
      data.rcDBUser = '';
      data.rcDBPwd = '';
      data.rcDBName = '';
    }
    this.endPointService.createSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.resetForm();
        if (res.status == 200) {
          this.snackbar.snackbarMessage('success-snackbar', "Settings Created", 1);
          this.getReportSetting();
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error creating", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  updateReportSetting(data) {
    if (data.reportingEnabled == false) {
      data.rcDBUrl = '';
      data.rcDBUser = '';
      data.rcDBPwd = '';
      data.rcDBName = '';
    }
    this.endPointService.updateSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.resetForm();
        if (res.status == 200) this.snackbar.snackbarMessage('success-snackbar', "Settings Updated", 1);
        this.getReportSetting();
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

  onChange(e) {
    this.setValidation(e.checked);
  }

  setValidation(val) {
    if (val == true) {
      this.valid = false;
      this.reportSettingForm.controls['rcDBUrl'].setValidators([Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)]);
      this.reportSettingForm.controls['rcDBUser'].setValidators([Validators.required, Validators.maxLength(40)]);
      this.reportSettingForm.controls['rcDBPwd'].setValidators([Validators.required, Validators.maxLength(256)]);
      this.reportSettingForm.controls['rcDBName'].setValidators([Validators.required, Validators.maxLength(40)]);
    }
    else {
      this.valid = true;
      this.reportSettingForm.controls['rcDBUrl'].setValidators(null);
      this.reportSettingForm.controls['rcDBUser'].setValidators(null);
      this.reportSettingForm.controls['rcDBPwd'].setValidators(null);
      this.reportSettingForm.controls['rcDBName'].setValidators(null);
    }
  }

  resetForm() {
    this.reportSettingForm.setValue({
      rcDBName: " ",
      rcDBUser: " ",
      rcDBPwd: " ",
      rcDBUrl: " ",
      reportingEnabled: false,
    });
  }
}