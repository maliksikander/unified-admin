import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { from, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar.service';
import { CommonService } from '../../services/common.service'
// import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-locale',
  templateUrl: './locale.component.html',
  styleUrls: ['./locale.component.scss']
})
export class LocaleComponent implements OnInit {

  localeSettingForm: FormGroup;
  languages = [
    { name: 'English', id: 1 },
    { name: 'French', id: 2 },
    { name: 'Spanish', id: 3 },
    { name: 'Italian', id: 4 },
    { name: 'German', id: 5 }
  ];
  formErrors = {
    timezone: '',
    language: '',
    supportedLanguages: ''
  };
  validations;

  searchTerm: string;
  constructor(private snackbar: SnackbarService,
    private commonService: CommonService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.validations = this.commonService.localeSettingErrorMessages;

    this.localeSettingForm = this.fb.group({
      timezone: ['', [Validators.required]],
      language: ['', [Validators.required]],
      supportedLanguages: ['', [Validators.required]]
    });

    this.localeSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.localeSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });
  }

  onLanguageRemoved(lang) {
    const languages = this.localeSettingForm.controls['supportedLanguages'].value;;
    this.removeFirst(languages, lang);
    this.localeSettingForm.controls.supportedLanguages.setValue(languages);
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  onSave() { }

}
