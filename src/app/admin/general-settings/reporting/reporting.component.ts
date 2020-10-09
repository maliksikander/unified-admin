import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {

  reportSettingForm: FormGroup;
  formErrors = {
    dbName: '',
    dbUsername: '',
    dbPwd: '',
    dbUrl: ''
  };
  validations;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService) { }

  ngOnInit() {

    this.validations = this.commonService.reportSettingErrorMessages;

    this.reportSettingForm = this.fb.group({
      dbName: ['', [Validators.required]],
      dbUsername: ['', [Validators.required]],
      dbPwd: ['', [Validators.required]],
      dbUrl: ['', [Validators.required]],
      enableReporting: [false]
    });
    this.reportSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.reportSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });
  }
  onSave() { }

}
