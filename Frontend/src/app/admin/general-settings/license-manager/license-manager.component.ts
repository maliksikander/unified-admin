import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {

    this.commonService.tokenVerification();


    this.licenseForm = this.fb.group({
      licenseKey: ['',Validators.required],
    });

    // this.licenseForm.valueChanges.subscribe((data) => {
    //   let result = this.commonService.logValidationErrors(this.amqSettingForm, this.formErrors, this.validations);
    //   this.formErrors = result[0];
    //   this.validations = result[1];
    // });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });
  }

  onSave() { }

}
