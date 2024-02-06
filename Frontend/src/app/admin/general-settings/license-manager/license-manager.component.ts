import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-license-manager",
  templateUrl: "./license-manager.component.html",
  styleUrls: ["./license-manager.component.scss"],
})
export class LicenseManagerComponent implements OnInit {
  spinner = true;
  fileName = "";
  fileToBeUploaded = new FormData();
  licenseKey = new FormControl("", [Validators.required]);
  licenseFile = new FormControl({value:"", disabled: true}, [Validators.required]);
  managePermission: boolean = false;

  constructor(
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.getMasterKey();
    this.managePermission = this.commonService.checkManageScope("general-settings");
  }

  //to select file and save in local variable, it accepts selected file as 'file' parameter
  fileUpload(file):void {
    this.licenseFile.reset();
    this.fileName = "";
    const fd = new FormData();
    if (file && file[0]) {
      const selectedFile = file[0];
      this.licenseFile.setValue(selectedFile);
      this.fileName = selectedFile.name;
      fd.append("file", selectedFile);
      this.fileToBeUploaded = fd;
    }
  }

  //to get save master key and disable the master key field
  getMasterKey() {
    this.endPointService.getMasterKey().subscribe(
      (res: any) => {
        if (res && res.masterKey) this.patchMasterKeyValue(res.masterKey);
        this.spinner = false;
      },
      (error) => {
        this.spinner = false;
        console.error("[License Master Key] Error :", error);
      }
    );
  }

  patchMasterKeyValue(value) {
    this.licenseKey.patchValue(value);
    this.licenseKey.disable();
  }

  //to upload offline verification file
  onUpload() {
    this.spinner = true;
    this.endPointService.fileUpload(this.fileToBeUploaded).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.ProductsList) {
          this.snackbar.snackbarMessage("success-snackbar", res.message, 3);
        } else {
          this.snackbar.snackbarMessage("error-snackbar", res.message, 2);
        }
      },
      (error) => {
        this.spinner = false;
        console.error("[License File Upload] Error:", error);
      }
    );
  }

  onSave() {
    this.spinner = true;
    let key = this.licenseKey.value;
    this.saveMasterKey(key);
  }

  saveMasterKey(key) {
    this.endPointService.saveMasterKey(key).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.ProductsList) {
          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Saved Successfully",
            2
          );
          this.getMasterKey();
        } else {
          this.snackbar.snackbarMessage("error-snackbar", res.message, 2);
        }
      },
      (error) => {
        this.spinner = false;
        console.error("[Save Master Key] Error:", error);
      }
    );
  }
}
