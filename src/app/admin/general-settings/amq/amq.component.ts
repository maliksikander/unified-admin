import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
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

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService) { }

  ngOnInit() {

    this.validations = this.commonService.amqSettingErrorMessages;

    this.amqSettingForm = this.fb.group({
      amqUsername: ['', [Validators.required]],
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
  }

  onSave() { }

}
