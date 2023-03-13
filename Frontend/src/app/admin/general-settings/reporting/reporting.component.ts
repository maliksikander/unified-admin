import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";
@Component({
  selector: "app-reporting",
  templateUrl: "./reporting.component.html",
  styleUrls: ["./reporting.component.scss"],
})
export class ReportingComponent implements OnInit {
  reportSettingForm: FormGroup;
  formErrors = {
    rcDBName: "",
    rcDBUser: "",
    rcDBPwd: "",
    rcDBUrl: "",
  };
  validations;
  spinner: any = true;
  editData: any;
  hide = true;
  valid = true;

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
    this.validations = this.commonService.reportSettingErrorMessages;

    this.reportSettingForm = this.fb.group({
      reportingEnabled: [false],
      rcDBUrl: [""],
      rcDBUser: [""],
      rcDBPwd: [""],
      rcDBName: [""],
    });

    this.reportSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(
        this.reportSettingForm,
        this.formErrors,
        this.validations
      );
      this.formErrors = result[0];
      this.validations = result[1];
      if (this.reportSettingForm.status == "INVALID") {
        this.valid = false;
      } else {
        this.valid = true;
      }
    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.getReportSetting();
  }

  //to get log setting list and set the local variable with the response
  getReportSetting() {
    this.endPointService.getReportSetting().subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.length > 0) {
          this.editData = res[0];
          this.setValidation(this.editData.reportingEnabled);
          this.reportSettingForm.patchValue({
            rcDBName: this.editData.rcDBName,
            rcDBUser: this.editData.rcDBUser,
            rcDBPwd: this.editData.rcDBPwd,
            rcDBUrl: this.editData.rcDBUrl,
            reportingEnabled: this.editData.reportingEnabled,
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

  //to create log setting object and it accepts log setting object as `data`
  createReportSetting(data) {
    this.spinner = true;
    if (data.reportingEnabled == false) {
      data.rcDBUrl = "";
      data.rcDBUser = "";
      data.rcDBPwd = "";
      data.rcDBName = "";
    }
    this.endPointService.createReportSetting(data).subscribe(
      (res: any) => {
        this.resetForm();

        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Settings Created",
          1
        );
        this.getReportSetting();
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error creating", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update log setting object and it accepts amq setting object as `data`
  updateReportSetting(data) {
    if (data.reportingEnabled == false) {
      data.rcDBUrl = "";
      data.rcDBUser = "";
      data.rcDBPwd = "";
      data.rcDBName = "";
    }
    this.endPointService.updateReportSetting(data).subscribe(
      (res: any) => {
        this.resetForm();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Settings Updated",
          1
        );
        this.getReportSetting();
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
    let data = JSON.parse(JSON.stringify(this.reportSettingForm.value));
    if (this.editData) {
      data.id = this.editData.id;
      this.spinner = true;
      this.updateReportSetting(data);
    } else {
      this.createReportSetting(data);
    }
  }

  onChange(e) {
    this.setValidation(e.checked);
  }

  //set dynamic validations on form controls on the status of enabled option
  setValidation(val) {
    if (val == true) {
      this.valid = false;
      this.reportSettingForm.controls["rcDBUrl"].setValidators([
        Validators.required,
        Validators.pattern(
          /((([A-Za-z]{2,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        ),
      ]);
      this.reportSettingForm.controls["rcDBUser"].setValidators([
        Validators.required,
        Validators.maxLength(40),
      ]);
      this.reportSettingForm.controls["rcDBPwd"].setValidators([
        Validators.required,
        Validators.maxLength(256),
      ]);
      this.reportSettingForm.controls["rcDBName"].setValidators([
        Validators.required,
        Validators.maxLength(40),
      ]);
    } else {
      this.valid = true;
      this.reportSettingForm.controls["rcDBUrl"].setValidators(null);
      this.reportSettingForm.controls["rcDBUser"].setValidators(null);
      this.reportSettingForm.controls["rcDBPwd"].setValidators(null);
      this.reportSettingForm.controls["rcDBName"].setValidators(null);
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
