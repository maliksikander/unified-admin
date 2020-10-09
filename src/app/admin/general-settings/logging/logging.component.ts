import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent implements OnInit {

  logSettingForm: FormGroup;
  formErrors = {
    agentLogLevel: '',
    agentLogMaxFiles: '',
    agentLogFileSize: '',
    agentLogFilePath: ''
  };
  validations;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService) { }

  ngOnInit() {

    this.validations = this.commonService.logSettingErrorMessages;

    this.logSettingForm = this.fb.group({
      agentLogLevel: ['', [Validators.required]],
      agentLogMaxFiles: ['', [Validators.required]],
      agentLogFileSize: ['', [Validators.required]],
      agentLogFilePath: ['', [Validators.required]],
      enableLogs: [false]
    });

    this.logSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.logSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });
  }

  onSave() { }
}
