import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { from, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar.service';
import { CommonService } from '../../services/common.service'
declare var require: any
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
  timeZones = [];
  searchTerm: string;
  selected=[];
  constructor(private snackbar: SnackbarService,
    private commonService: CommonService,
    private fb: FormBuilder) {

  }

  ngOnInit() {

    this.validations = this.commonService.localeSettingErrorMessages;

    this.localeSettingForm = this.fb.group({
      timezone: ['', [Validators.required]],
      language: ['', [Validators.required]],
      supportedLanguages: ['', [Validators.required]]
    });

    this.timezoneList();

    this.localeSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.localeSettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];

       this.selected = this.localeSettingForm.value.supportedLanguages;

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

  timezoneList() {
    var moment = require('moment-timezone');
    let timeZoneList = moment.tz.names();
    this.timeZones = [];
    if (timeZoneList.length != 0) {
      timeZoneList.filter((e) => {
        this.timeZones.push({ "name": e });
      });
      let i = 1;
      this.timeZones.forEach(t => {
        t.id = i;
        i++;
      });
      const index = this.timeZones.findIndex(item => item.name === 'UTC');
      this.localeSettingForm.patchValue({
        timezone: this.timeZones[index],
        supportedLanguages:[this.languages[0]]
      });
    }
    // this.selected = this.localeSettingForm.value.supportedLanguages.length;
  }

chip(e){ console.log("chip E-->",e)}
change(e){ console.log("change E-->",e)}
  onSave() { }

}
