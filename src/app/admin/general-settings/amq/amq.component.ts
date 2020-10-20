import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    amqUsername: '',
    amqPwd: '',
    amqHost: '',
    amqPort: '',
    amqUrl: ''
  };
  validations;
  reqServiceType = 'amq-setting';
  spinner: any = true;
  editData: any;


  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {

    this.validations = this.commonService.amqSettingErrorMessages;

    this.amqSettingForm = this.fb.group({
      amqUser: ['', [Validators.required]],
      amqPwd: ['', [Validators.required]],
      amqHost: ['', [Validators.required]],
      amqPort: ['', [Validators.required]],
      amqUrl: ['', [Validators.required]],
    });

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

  getAmqSetting() {
    this.endPointService.getSetting(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200 && res.amqSetting.length > 0) {
          this.editData = res.amqSetting[0];
          this.amqSettingForm.patchValue({
            amqHost: this.editData.amqHost,
            amqPort: this.editData.amqPort,
            amqUser: this.editData.amqUser,
            amqPwd: this.editData.amqPwd,
            amqUrl: this.editData.amqUrl,
          });
        }
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if(error && error.status == 0)  this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  createAmqSetting(data) {
    this.spinner = true;
    this.endPointService.createSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) this.snackbar.snackbarMessage('success-snackbar', "Settings Created", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error creating", error);
        if(error && error.status == 0)  this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      }
    );
  }


  updateAmqSetting(data) {
    this.endPointService.updateSetting(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.status == 200) this.snackbar.snackbarMessage('success-snackbar', "Settings Updated", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error updating", error);
        if(error && error.status == 0)  this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      }
    );
  }

  onSave() {
    let data = this.amqSettingForm.value;
    if (this.editData) {
      data.id = this.editData.id;
      this.updateAmqSetting(data);
    }
    else {
      this.createAmqSetting(data);
    }

  }

}
