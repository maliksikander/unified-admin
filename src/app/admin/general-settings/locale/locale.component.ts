import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-locale',
  templateUrl: './locale.component.html',
  styleUrls: ['./locale.component.scss']
})
export class LocaleComponent implements OnInit {

  localeSettingForm: FormGroup;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.localeSettingForm = this.fb.group({
      timezone: [''],
      language: [''],
      supportedLanguages: [''],
    });

  }
  onSave() { }

}
