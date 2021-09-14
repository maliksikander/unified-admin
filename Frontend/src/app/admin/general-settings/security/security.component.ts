import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";
@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.scss"],
})
export class SecurityComponent implements OnInit {
  securitySettingForm: FormGroup;
  formErrors = {
    certificatePath: "",
    certificateKeypath: "",
    certificatePassphrase: "",
    certificateAuthorityPath: "",
    certificateAuthorityPassphrase: "",
    keystorePath: "",
    keystorePwd: "",
    truststorePath: "",
    truststorePwd: "",
    jksKeystorePath: "",
    jksKeystorePwd: "",
    jksKeymanagerPwd: "",
    amqCertificatePath: "",
    amqCertificatePassphrase: "",
    corsOrigin: "",
    commBypassSSL: "",
    enableSSL: "",
    minioSSL: "",
    mongoSSL: "",
    stompSSLEnabled: "",
  };
  validations;
  // reqServiceType = 'security-setting';
  spinner: any = true;
  editData: any;
  hide1 = true;
  hide2 = true;
  hide3 = true;
  hide4 = true;

  constructor(
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.securitySettingErrorMessages;

    this.securitySettingForm = this.fb.group({
      certificatePath: ["", [Validators.required, Validators.maxLength(256)]],
      certificateKeypath: [
        "",
        [Validators.required, Validators.maxLength(256)],
      ],
      certificatePassphrase: [
        "",
        [Validators.required, Validators.maxLength(256)],
      ],
      certificateAuthorityPath: [
        "",
        [Validators.required, Validators.maxLength(256)],
      ],
      certificateAuthorityPassphrase: [
        "",
        [Validators.required, Validators.maxLength(256)],
      ],
      keystorePath: ["", [Validators.required, Validators.maxLength(256)]],
      keystorePwd: ["", [Validators.required, Validators.maxLength(256)]],
      truststorePath: ["", [Validators.required, Validators.maxLength(256)]],
      truststorePwd: ["", [Validators.required, Validators.maxLength(256)]],
      jksKeystorePath: ["", [Validators.required, Validators.maxLength(256)]],
      jksKeystorePwd: ["", [Validators.required, Validators.maxLength(256)]],
      jksKeymanagerPwd: ["", [Validators.required, Validators.maxLength(256)]],
      amqCertificatePath: [
        "",
        [Validators.required, Validators.maxLength(256)],
      ],
      amqCertificatePassphrase: [
        "",
        [Validators.required, Validators.maxLength(256)],
      ],
      corsOrigin: ["", [Validators.required, Validators.maxLength(40)]],
      commBypassSSL: [true],
      enableSSL: [true],
      minioSSL: [true],
      mongoSSL: [true],
      stompSSLEnabled: [true],
    });

    this.securitySettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(
        this.securitySettingForm,
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

    this.getSecuritySetting();
  }

  //to get security setting list and set the local variable with the response
  getSecuritySetting() {
    this.endPointService.getSecuritySetting().subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200 && res.securitySetting.length > 0) {
          this.editData = res.securitySetting[0];
          this.securitySettingForm.patchValue({
            certificatePath: this.editData.certificatePath,
            certificateKeypath: this.editData.certificateKeypath,
            certificatePassphrase: this.editData.certificatePassphrase,
            certificateAuthorityPath: this.editData.certificateAuthorityPath,
            certificateAuthorityPassphrase:
              this.editData.certificateAuthorityPassphrase,
            keystorePath: this.editData.keystorePath,
            keystorePwd: this.editData.keystorePwd,
            truststorePath: this.editData.truststorePath,
            truststorePwd: this.editData.truststorePwd,
            jksKeystorePath: this.editData.jksKeystorePath,
            jksKeystorePwd: this.editData.jksKeystorePwd,
            jksKeymanagerPwd: this.editData.jksKeymanagerPwd,
            amqCertificatePath: this.editData.amqCertificatePath,
            amqCertificatePassphrase: this.editData.amqCertificatePassphrase,
            corsOrigin: this.editData.corsOrigin,
            commBypassSSL: this.editData.commBypassSSL,
            enableSSL: this.editData.enableSSL,
            minioSSL: this.editData.minioSSL,
            mongoSSL: this.editData.mongoSSL,
            stompSSLEnabled: this.editData.stompSSLEnabled,
          });
        } else if (res.status == 200 && res.securitySetting.length == 0)
          this.snackbar.snackbarMessage("error-snackbar", "NO DATA FOUND", 2);
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to create security setting object and it accepts security setting object as `data`
  createSecuritySetting(data) {
    this.spinner = true;
    this.endPointService.createSecuritySetting(data).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) {
          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Settings Created",
            1
          );
          this.editData = res.securitySetting;
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error creating", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update security setting object and it accepts security setting object as `data`
  updateSecuritySetting(data) {
    this.endPointService.updateSecuritySetting(data).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200)
          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Settings Updated",
            1
          );
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error updating", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  onSave() {
    let data = this.securitySettingForm.value;
    if (this.editData) {
      data.id = this.editData.id;
      this.spinner = true;
      this.updateSecuritySetting(data);
    } else {
      this.createSecuritySetting(data);
    }
  }
}
