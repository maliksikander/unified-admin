import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
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
    companyName: '',
    companyLogo: ''
  };
  validations;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService) { }

  ngOnInit() {


    this.validations = this.commonService.displaySettingErrorMessages;

    this.displaySettingForm = this.fb.group({
      agentAlias: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companyLogo: ['']
    });

    this.displaySettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.displaySettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });
  }

  selectFile() { }

  onSave() { }

}
