import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  databaseSettingForm: FormGroup;
  formErrors = {
    dbUsername: '',
    dbPwd: '',
    dbDialect: '',
    dbDriver: '',
    dbUrl: '',
    dbEngine: ''
  };
  validations;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService) { }

  ngOnInit() {

    this.validations = this.commonService.databaseSettingErrorMessages;

    this.databaseSettingForm = this.fb.group({
      dbUsername: ['', [Validators.required]],
      dbPwd: ['', [Validators.required]],
      dbDialect: ['', [Validators.required]],
      dbDriver: ['', [Validators.required]],
      dbUrl: ['', [Validators.required]],
      dbEngine: ['', [Validators.required]],
    });

    this.databaseSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.databaseSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });
  }

  onSave() { }

}
