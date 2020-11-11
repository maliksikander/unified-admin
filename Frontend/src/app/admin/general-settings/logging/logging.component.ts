import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent implements OnInit {

  logSettingForm: FormGroup;
  formErrors = {
    logLevel: '',
    agentLogsMaxFiles: '',
    agentLogsFileSize: '',
    logFilePath: ''
  };
  validations;
  reqServiceType = 'log-setting';
  spinner: any = true;
  editData: any;
  logLevel=['all','debug','error','fatal','info','off','trace','warn'];
  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {

    this.validations = this.commonService.logSettingErrorMessages;

    this.logSettingForm = this.fb.group({
      logLevel: ['warn', [Validators.required]],
      agentLogsMaxFiles: ['', [Validators.required,Validators.min(1),,Validators.max(1000)]],
      agentLogsFileSize: ['', [Validators.required,Validators.min(1),,Validators.max(1024)]],
      logFilePath: ['', [Validators.required,Validators.maxLength(256)]],
    });

    this.logSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.logSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });
    this.endPointService.readConfigJson().subscribe((e) => {
    this.getLogSetting();
    });
  }

  getLogSetting() {
    this.endPointService.getSetting(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("res->",res);
        if (res.status == 200 && res.logSetting.length > 0) {
          this.editData = res.logSetting[0];
          this.logSettingForm.patchValue({
            logLevel: this.editData.logLevel,
            agentLogsMaxFiles: this.editData.agentLogsMaxFiles,
            agentLogsFileSize: this.editData.agentLogsFileSize,
            logFilePath: this.editData.logFilePath,
          });
        }
        else if(res.status == 200 && res.logSetting.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if(error && error.status == 0)  this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  createLogSetting(data) {
    this.spinner = true;
    this.endPointService.createSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) {
          this.snackbar.snackbarMessage('success-snackbar', "Settings Created", 1);
          this.editData = res.logSetting;
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error creating", error);
        if(error && error.status == 0)  this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      }
    );
  }

  updateLogSetting(data) {
    this.endPointService.updateSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) this.snackbar.snackbarMessage('success-snackbar', "Settings Updated", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error updating", error);
        if(error && error.status == 0)  this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      }
    );
  }

  onSave() {
    let data = this.logSettingForm.value;
    if (this.editData) {
      data.id = this.editData.id;
      this.spinner = true;
      this.updateLogSetting(data);
    }
    else {
      this.createLogSetting(data);
    }
  }
}
