import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { file } from "@rxweb/reactive-form-validators";
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
  // licenseForm: FormGroup;
  fileName = "";
  // filePath;
  // fileURL;
  // fileData = new FormData();
  fileUploadData = {
    file: new FormData(),
  };

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
    this.commonService.tokenVerification();

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });
  }

  //to view selected image and save in base64 format and it accepts file properties as 'files' and change event as 'e'
  fileUpload(file, e) {
    // console.log("file==>", file[0]);
    // console.log("event==>", e[0]);
    // var reader = new FileReader();
    // this.filePath = files;
    // if (files.length != 0) {
    //   // if (files[0].size > 2097152) return this.snackbar.snackbarMessage('error-snackbar', 'Image Size greater than 2Mb', 3);
    //   reader.readAsDataURL(files[0]);
    //   reader.onload = (_event) => {
    //     this.fileURL = reader.result;
    //     this.licenseFile.setValue(this.fileURL);
    //     this.fileName = e.target.files[0].name;
    //   }
    // }
    // let fd: any = new FormData();
    this.licenseFile.setValue(file[0]);
    this.fileName = file[0].name;
    this.fileUploadData.file.append("file", file[0]);
    console.log(this.fileUploadData.file.get('file'))
  }

  onSave(mode) {
    if (mode == "upload") {
      this.endPointService.fileUpload(this.fileUploadData).subscribe(
        (res: any) => {
          this.spinner = false;
          // this.channelTypes = res;
          // if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "No Channel Type Found", 2);
        },
        (error) => {
          this.spinner = false;
          console.log("Error fetching:", error);
          // if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
        }
      );
    }
  }
}
