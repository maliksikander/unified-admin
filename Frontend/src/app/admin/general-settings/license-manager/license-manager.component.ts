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
  fileUploadData: any = {
    file: "",
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
    this.licenseFile.reset();
    this.fileName = "";
    let fd = new FormData();
    // this.fileUploadData.file.;
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

    if (file[0]) {
      this.licenseFile.setValue(file[0]);
      this.fileName = file[0].name;
      fd.append("file", file[0]);
      this.fileUploadData.file = fd;
      // console.log(this.fileUploadData.file.get('file'))
    }
  }

  onUpload() {
    this.spinner = true;
    this.endPointService.fileUpload(this.fileUploadData).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) {
          this.snackbar.snackbarMessage("success-snackbar", res.message, 2);
        } else {
          this.snackbar.snackbarMessage("error-snackbar", res.message, 2);
        }
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
      }
    );
  }

  onSave() {}
}
