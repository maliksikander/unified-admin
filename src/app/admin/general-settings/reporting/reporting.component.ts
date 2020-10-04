import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {

  reportSettingForm: FormGroup;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder) {
      this.reportSettingForm = this.fb.group({
      dbName: [''],
      dbUsername: [''],
      dbPwd: [''],
      dbUrl: [''],
      enableReporting:[false]
    });}

  ngOnInit() {
  }
  onSave() { }

}
