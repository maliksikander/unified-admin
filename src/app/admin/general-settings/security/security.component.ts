import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  securitySettingForm: FormGroup;
  formErrors = {
    certificatePath: '',
    certificateKeyPath: '',
    ssl: '',
    certificateBundlePath: '',
    privateKey: ''
  };
  validations;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService) { }

  ngOnInit() {

    this.validations = this.commonService.securitySettingErrorMessages;

    this.securitySettingForm = this.fb.group({
      certificatePath: ['',[Validators.required]],
      certificateKeyPath: ['',[Validators.required]],
      ssl: ['',[Validators.required]],
      certificateBundlePath: ['',[Validators.required]],
      privateKey: ['',[Validators.required]],
    });

    this.securitySettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.securitySettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });
  }

  onSave() { }
}
