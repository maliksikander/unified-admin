import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  databaseSettingForm: FormGroup;
  formErrors = {
    mongoUrl: '',
    eabcDBUrl: '',
    eabcDBDriver: '',
    eabcDBDialect: '',
    eabcDBUser: '',
    eabcDBPwd: '',
    ecmDBDialect: '',
    ecmDBDriver: '',
    ecmDBPwd: '',
    ecmDBUrl: '',
    ecmDBUser: '',
    ecmDBEngine: ''
  };
  validations;
  reqServiceType = 'database-setting';
  spinner: any = true;
  editData: any;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef,) { }

  ngOnInit() {

    this.validations = this.commonService.databaseSettingErrorMessages;

    this.databaseSettingForm = this.fb.group({
      mongoUrl: ['', [Validators.required]],
      eabcDBUrl: ['', [Validators.required]],
      eabcDBDriver: ['', [Validators.required]],
      eabcDBDialect: ['', [Validators.required]],
      eabcDBUser: ['', [Validators.required]],
      eabcDBPwd: ['', [Validators.required]],
      ecmDBDialect: ['', [Validators.required]],
      ecmDBDriver: ['', [Validators.required]],
      ecmDBPwd: ['', [Validators.required]],
      ecmDBUrl: ['', [Validators.required]],
      ecmDBUser: ['', [Validators.required]],
      ecmDBEngine: ['', [Validators.required]],
    });

    this.databaseSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.databaseSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.getDatabaseSetting();
  }

  getDatabaseSetting() {
    this.endPointService.getSetting(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("res-->", res);
        if (res.status == 200 && res.databaseSetting.length > 0) {
          this.editData = res.databaseSetting[0];
          this.databaseSettingForm.patchValue({
            mongoUrl: this.editData.mongoUrl,
            eabcDBUrl: this.editData.eabcDBUrl,
            eabcDBDriver: this.editData.eabcDBDriver,
            eabcDBDialect: this.editData.eabcDBDialect,
            eabcDBUser: this.editData.eabcDBUser,
            eabcDBPwd: this.editData.eabcDBPwd,
            ecmDBDialect: this.editData.ecmDBDialect,
            ecmDBDriver: this.editData.ecmDBDriver,
            ecmDBPwd: this.editData.ecmDBPwd,
            ecmDBUrl: this.editData.ecmDBUrl,
            ecmDBUser: this.editData.ecmDBUser,
            ecmDBEngine: this.editData.ecmDBEngine
          });
        }
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if(error && error.status == 0)  this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  createDatabaseSetting(data) {
    this.spinner = true;
    this.endPointService.createSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) this.snackbar.snackbarMessage('success-snackbar', "Settings Created", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error creating", error);
        if(error && error.status == 0)  this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      }
    );
  }


  updateDatabaseSetting(data) {
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
    let data = this.databaseSettingForm.value;
    if (this.editData) {
      data.id = this.editData.id;
      this.updateDatabaseSetting(data);
    }
    else {
      this.createDatabaseSetting(data);
    }
  }

}
