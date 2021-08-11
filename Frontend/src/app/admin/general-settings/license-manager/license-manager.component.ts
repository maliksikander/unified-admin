import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-license-manager',
  templateUrl: './license-manager.component.html',
  styleUrls: ['./license-manager.component.scss']
})
export class LicenseManagerComponent implements OnInit {

  spinner = false;
  licenseForm: FormGroup;
  fileName = '';
  filePath;
  fileURL;

  licenseKey = new FormControl('', [Validators.required]);
  licenseFile = new FormControl('', [Validators.required]);

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {

    this.commonService.tokenVerification();

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });
  }

  //to view selected image and save in base64 format and it accepts file properties as 'files' and change event as 'e'
  fileUpload(files, e) {
    var reader = new FileReader();
    this.filePath = files;
    if (files.length != 0) {
      // if (files[0].size > 2097152) return this.snackbar.snackbarMessage('error-snackbar', 'Image Size greater than 2Mb', 3);
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.fileURL = reader.result;
        this.licenseFile.setValue(this.fileURL);
        this.fileName = e.target.files[0].name;
        // console.log("1==>", this.filePath)
        // console.log("2==>", this.fileName)
        // console.log("3==>", this.fileURL)
        // console.log("4==>", reader)

      }
    }

  }

  onSave() { }

}
