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
  spinner = false;
  fileName = "";
  fileToBeUploaded = new FormData();
  licenseKey = new FormControl("", [Validators.required]);
  licenseFile = new FormControl("", [Validators.required]);

  constructor(
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.commonService.checkTokenExistenceInStorage();

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });
  }

  //to select file and save in local variable, it accepts selected file as 'file' parameter
  fileUpload(file) {
    this.licenseFile.reset();
    this.fileName = "";
    let fd = new FormData();
    if (file[0]) {
      this.licenseFile.setValue(file[0]);
      this.fileName = file[0].name;
      fd.append("file", file[0]);
      this.fileToBeUploaded = fd;
    }
  }

  //to upload offline verification file
  onUpload() {
    this.spinner = true;
    this.endPointService.fileUpload(this.fileToBeUploaded).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.ProductsList) {
          this.snackbar.snackbarMessage("success-snackbar", "File Uploaded", 2);
        } else {
          this.snackbar.snackbarMessage("error-snackbar", res.message, 2);
        }
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
      }
    );
  }

  onSave() {}
}
