import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-amq',
  templateUrl: './amq.component.html',
  styleUrls: ['./amq.component.scss']
})
export class AmqComponent implements OnInit {

  amqSettingForm: FormGroup;
  formErrors = {
    amqUser: '',
    amqPwd: '',
    amqHost: '',
    amqPort: '',
    amqUrl: ''
  };
  validations;
  reqServiceType = 'amq-setting';
  spinner: any = true;
  editData: any;
  hide = true;
  authorized: boolean = false;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {

    this.commonService.tokenVerification();

    //  this.commonService.getPermissionResourcesList();
    // if (!permittedResources.includes('general-settings')) { this.router.navigate(['/general/amq-settings']); }


    //setting local form validation messages 
    this.validations = this.commonService.amqSettingErrorMessages;

    this.amqSettingForm = this.fb.group({
      amqUser: ['', [Validators.required, Validators.maxLength(40)]],
      amqPwd: ['', [Validators.required, Validators.maxLength(256)]],
      amqHost: ['', [Validators.required, Validators.maxLength(256), Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)]],
      amqPort: ['', [Validators.required, Validators.min(10), Validators.max(100000)]],
      amqUrl: ['', [Validators.required, Validators.pattern(/((([A-Za-z]{2,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)]],
    });

    //checking for AMQ Setting form validation failures
    this.amqSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.amqSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.getAmqSetting();

  }

  //to get amq setting list and set the local variable with the response 
  getAmqSetting() {
    this.endPointService.getSetting(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200 && res.amqSetting.length > 0) {
          this.editData = res.amqSetting[0];
          this.amqSettingForm.patchValue({
            amqHost: this.editData.amqHost,
            amqPort: JSON.parse(this.editData.amqPort),
            amqUser: this.editData.amqUser,
            amqPwd: this.editData.amqPwd,
            amqUrl: this.editData.amqUrl,
          });
        }
        else if (res.status == 200 && res.amqSetting.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
      },
      error => {
        this.spinner = false;
        console.log("Error:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);

      });
  }

  //to create amq setting object and it accepts amq setting object as `data` 
  createAmqSetting(data) {
    this.spinner = true;
    this.endPointService.createSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) {
          this.snackbar.snackbarMessage('success-snackbar', "Settings Created", 1);
          this.editData = res.amqSetting;
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);

      });
  }

  //to update amq setting object and it accepts amq setting object as `data` 
  updateAmqSetting(data) {
    this.endPointService.updateSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) this.snackbar.snackbarMessage('success-snackbar', "Settings Updated", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      }
    );
  }

  onSave() {
    let data = this.amqSettingForm.value;
    data.amqPort = JSON.stringify(this.amqSettingForm.value.amqPort)
    if (this.editData) {
      data.id = this.editData.id;
      this.spinner = true;
      this.updateAmqSetting(data);
    }
    else {
      this.createAmqSetting(data);
    }
  }

}