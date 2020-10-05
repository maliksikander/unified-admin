import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    { name: 'Spanish', id: 3 }];

  searchTerm:string;
  constructor(private snackbar: SnackbarService,
    private commonService: CommonService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.localeSettingForm = this.fb.group({
      timezone: [''],
      language: [''],
      supportedLanguages: [''],
      // languageFilter:['']
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
