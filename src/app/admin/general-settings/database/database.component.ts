import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  databaseSettingForm: FormGroup;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.databaseSettingForm = this.fb.group({
      dbUsername: [''],
      dbPwd: [''],
      dbDialect: [''],
      dbDriver: [''],
      dbUrl: [''],
      dbEngine: [''],
    });
  }

  onSave() { }

}
