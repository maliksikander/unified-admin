import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-database",
  templateUrl: "./database.component.html",
  styleUrls: ["./database.component.scss"],
})
export class DatabaseComponent implements OnInit {
  databaseSettingForm: FormGroup;
  formErrors = {
    mongoUrl: "",
    eabcDBUrl: "",
    eabcDBDriver: "",
    eabcDBDialect: "",
    eabcDBUser: "",
    eabcDBPwd: "",
    ecmDBDialect: "",
    ecmDBDriver: "",
    ecmDBPwd: "",
    ecmDBUrl: "",
    ecmDBUser: "",
    ecmDBEngine: "",
  };
  validations;
  spinner: any = true;
  editData: any;
  hide1 = true;
  hide2 = true;

  constructor(
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.databaseSettingErrorMessages;

    this.databaseSettingForm = this.fb.group({
      mongoUrl: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /((([A-Za-z]{2,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
          ),
        ],
      ],
      eabcDBUrl: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /((([A-Za-z]{2,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
          ),
        ],
      ],
      eabcDBDriver: ["", [Validators.required, Validators.maxLength(256)]],
      eabcDBDialect: ["", [Validators.required, Validators.maxLength(256)]],
      eabcDBUser: ["", [Validators.required, Validators.maxLength(40)]],
      eabcDBPwd: ["", [Validators.required, Validators.maxLength(256)]],
      ecmDBDialect: ["", [Validators.required, Validators.maxLength(256)]],
      ecmDBDriver: ["", [Validators.required, Validators.maxLength(256)]],
      ecmDBPwd: ["", [Validators.required, Validators.maxLength(256)]],
      ecmDBUrl: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /((([A-Za-z]{2,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
          ),
        ],
      ],
      ecmDBUser: ["", [Validators.required, Validators.maxLength(40)]],
      ecmDBEngine: ["", [Validators.required, Validators.maxLength(256)]],
    });

    //checking for Database Setting form validation failures
    this.databaseSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(
        this.databaseSettingForm,
        this.formErrors,
        this.validations
      );
      this.formErrors = result[0];
      this.validations = result[1];
    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.getDatabaseSetting();
  }

  //to get database setting list and set the local variable with the response
  getDatabaseSetting() {
    this.endPointService.getDatabaseSetting().subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.length > 0) {
          this.editData = res[0];
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
            ecmDBEngine: this.editData.ecmDBEngine,
          });
        } else if (res.length == 0)
          this.snackbar.snackbarMessage("error-snackbar", "NO DATA FOUND", 2);
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to create database setting object and it accepts amq setting object as `data`
  createDatabaseSetting(data) {
    this.spinner = true;
    this.endPointService.createDatabaseSetting(data).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Settings Created",
          1
        );
        this.editData = res;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error creating", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update database setting object and it accepts amq setting object as `data`
  updateDatabaseSetting(data) {
    this.endPointService.updateDatabaseSetting(data).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Settings Updated",
          1
        );
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error updating", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  onSave() {
    let data = JSON.parse(JSON.stringify(this.databaseSettingForm.value));
    if (this.editData) {
      data.id = this.editData.id;
      this.spinner = true;
      this.updateDatabaseSetting(data);
    } else {
      this.createDatabaseSetting(data);
    }
  }
}
