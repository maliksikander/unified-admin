import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  displaySettingForm: FormGroup;
  formErrors = {
    agentAlias: '',
    companyDisplayName: '',
    companyLogo: ''
  };
  validations;
  public imagePath;
  imageName = '';
  imgURL: any;
  reqServiceType = 'display-setting';
  spinner: any = true;
  editData: any;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.validations = this.commonService.displaySettingErrorMessages;

    this.displaySettingForm = this.fb.group({
      agentAlias: ['', [Validators.required, Validators.maxLength(40)]],
      companyDisplayName: ['', [Validators.required, Validators.maxLength(40)]],
      companyLogo: ['']
    });

    this.displaySettingForm.controls['companyLogo'].disable();
    this.displaySettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.displaySettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.getDisplaySetting();

  }

  preview(files, e) {
    var reader = new FileReader();
    this.imagePath = files;
    if (files.length != 0) {
      if (files[0].size > 2097152) return this.snackbar.snackbarMessage('error-snackbar', 'Image Size greater than 2Mb', 3);
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
        this.imageName = e.target.files[0].name;
      }
    }
  }

  getDisplaySetting() {
    this.endPointService.getSetting(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200 && res.displaySetting.length > 0) {
          this.editData = res.displaySetting[0];
          this.displaySettingForm.patchValue({
            agentAlias: this.editData.agentAlias,
            companyDisplayName: this.editData.companyDisplayName,
          });
          this.imgURL = this.editData.companyLogo;
        }
        else if (res.status == 200 && res.displaySetting.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  createDisplaySetting(data) {
    this.spinner = true;
    this.endPointService.createSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) {
          this.snackbar.snackbarMessage('success-snackbar', "Settings Created", 1);
          this.editData = res.displaySetting;
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error creating", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  updateDisplaySetting(data) {
    this.endPointService.updateSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) this.snackbar.snackbarMessage('success-snackbar', "Settings Updated", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error updating", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  onSave() {
    let data = this.displaySettingForm.value;
    if (this.imgURL) {
      data.companyLogo = this.imgURL;
    } else {
      this.imgURL = 'data:image/png;base64,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'
      data.companyLogo = this.imgURL;
    }
    if (this.editData) {
      data.id = this.editData.id;
      this.spinner = true;
      this.updateDisplaySetting(data);
    }
    else {
      this.createDisplaySetting(data);
    }
  }

}