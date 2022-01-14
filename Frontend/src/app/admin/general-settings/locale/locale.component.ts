import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SnackbarService } from "../../services/snackbar.service";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";

declare var require: any;
@Component({
  selector: "app-locale",
  templateUrl: "./locale.component.html",
  styleUrls: ["./locale.component.scss"],
})
export class LocaleComponent implements OnInit {
  localeSettingForm: FormGroup;
  languages = [
    {
      code: "en",
      name: "English",
      flag: "data:image/png;base64,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",
    },
    {
      code: "fr",
      name: "French",
      flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAf9JREFUSIm9l0Fu2kAUhv83pFGyqqtE6rIWSFGz865lxw1CbuB10wr3BnACO1LpFuUE5QZlF6RUipsVSZSE7lopqPbOioL/LoDiAEZuMfNtLI9H883zG72ZATJydvHzgKRL8ivJc045H7e5j73rg6zjbSz9aroG1GbtjfXSAcRI6WWNnxWSTmB/CIbdM09F0fGLvh+kDa1SpaWmDfXsDoK6CNKkc4jAgEg93t6+u98rV/9NXPzkAmhBUqPMgiEFfBnsl91s4mKzBRFnBeEszuD129ZycbHpQWDnKB0hYg/2y95icalpQ1DLXTqllsz5SGy6BsiFucgTKaD127SMqVhtOisupKwY8daWMxWD6/zFTxGpAcAGSp+rAHVEO8G43ytXFciKRikAQAqoKMjfkqcNkpYC8Uq3WESeKwhM3WIAVvomsWYUyB/areR3BZG+di8QKBC+brGI+AoiHd1iDtFRuHnXBhHqszLcvTptT1a1t7RzvnjAZJOIHzwtUZOhiqKEuP8xgEj+J49Zbyz25OQ5LSCjXB+vz8rG7tVpe/L6tHLdHjkAT9YgPdnpdevJpvmSefPezjVysrHT686lcXGtvj1yADlcacGRIYc4nI10uRgY5Tx+MEE0CGaeAMEQZENFkZnM6X/z7eJXlaRHskPST1za/HGb93h5mXplmeUPyl7lPr2ykPIAAAAASUVORK5CYII=",
    },
    {
      code: "spa",
      name: "Spanish",
      flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAADdAAAA3QFwU6IHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAGxQTFRF/////wAA3wAg4wAczAAz/9FG3wAg2QAm1gAp2QAm/9pE2AAn2AAn2QAm2AAn/9tE1wAo62w22AAn2AAn/9pE1wAo2AAn1wAo62c1/9pE7G812AAn2AAn2AAn7XQ2/9pE7nk42AAn7no3/9pE0jjBrQAAACF0Uk5TAAMICQoLEBQZSUtjcHJ8k5rCw8bHztHV1d7i5efr8PT8zncmfQAAAKJJREFUOMuFk0cOw0AMA+nee+9W8v8/5mDEMWLvcq4cYItE4MQKkrxcljJPAgt3rHiWkzn+V8xrfCjmNXcruVG5v9xr5IHG++Z+J490/pEbrShoDQBAJEoiALAntTDZAFLRkAJO0Y/r/npgX8e+cBC+tYTI9EKGWi/UGPTCgE0vbFygR9BL0mfSj6JfTYfFx00Xhq8cXVq+9rw4vHq8vOr6fwD8G2e55TJPUgAAAABJRU5ErkJggg==",
    },
    {
      code: "ita",
      name: "Italian",
      flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAgZJREFUSIm910Fu2kAUBuD/PVFUtYv6AJXKNo1UQasmW3dBtiE38AWQXakHgBPY0AOgnKCsySIsukJC0EWSVUXCulJxVUUNVf13AQEKmDqJmX9jaWz5m/EbzYyBhDn7Pjwk6ZM8JdnjPL1pm38zGB4mfV9m413ftjTz2H33/JWHKLJinspPr3YEel/LH0Y/Tj8H+PmrVrjsj+JerbFovehAHw0AVAQSh66JWBSp8Gl20NvZK90Nrh/4gDQgdwHXdEDlU3f3rZ8MrhcbALz7g0s81Ou+3G9shmvFABAnLXSGC5zu7n6wHq4XHYi4aaMzHHAXaz6BfdsCsbYWaYaKRi+Xt+awZr2HTaSkESt6kvXmMLi1T7xCC1wAyODjQQmEgdHOaKu3s1dSRLTNoZNEKrZCZkuesQiZV1BemIYBPFMIcsZZkXz8JrHlKMAr8yy/KIBL8y5GCqJv3BXpK1TapmGN2FaUW02AoSmUZFi46DQns5oS/Of5NBMAt5tENA5MjJpkqNfjBfh9ewRJ/+SxHCWc25PnfAEpt5oga9tCSVYLF53mrBP/3HVPPBDHW2CP35x3Kostq0um23LSHDnJ6uuzzkoZ16/V7okHwdFDJhzJUCIeLY90MwxMav7ndw5AFUTyDhAhyapej3OLNb13zr8NSiQDkm2S/YWftv60LbgZDGN/WZbzF01s670z3bQWAAAAAElFTkSuQmCC",
    },
    {
      code: "ger",
      name: "German",
      flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAZFJREFUSInF10Fu00AUBuDvjSpWoJoTAOoBSHqCcAJyA3yELNiX7pEaTtByAKRyg5yApvtWlBPUETsWGRZ2AqSNcNrG/aUnR7KTb2b8MnFC+7zFAD0UzRGmqJrjBF83+My1KXCAa+SWdd28p7grWm4I3jaA4abo0T3A1Tpqix4/ILqo4/+h4y2gixqvQ8stoota3vOAHsUTvsc9OrFNMtUvXk2pduALI1tGmxQY7fEh4LJu/S5gqPZ4ni7qde8KheKCYYp6G+w0wSDlP3tuZ8n0UvCiazjYjcv6+9V50mOgC/jHI7jnKXPVtZqpUtRPDp0mmKZcP650mswk4OdHVYTdTtBs9uy9YgeevjEWDrqA5fp3OSCfKcxd2fass5nkZfRVCaKvkpRbRSEpo6+qXzaJvlPZp62h2WH0nS69G+e/OcG7B2Y/x/6/K3pjy4x95YPOPDtcRbllxsvrzwzNndy54epGKv9e3lZwgxfmRhi1HkA2w1gyXjTSxvDKIIbmBmL5p+11c+oclWwqmayb4Wp+A0WLz8dIzJT5AAAAAElFTkSuQmCC",
    },
  ];
  formErrors = {
    timezone: "",
    defaultLanguage: "",
    supportedLanguages: "",
  };
  validations;
  timeZones = [];
  searchTerm: string;
  defLangSearchTerm: string;
  langSearchTerm: string;
  selectedCount = [];
  selectedLanguages = [];
  spinner: any = true;
  editData: any;
  managePermission: boolean = false;

  constructor(
    private snackbar: SnackbarService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private endPointService: EndpointService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.localeSettingErrorMessages;

    this.localeSettingForm = this.fb.group({
      timezone: [{}, [Validators.required]],
      defaultLanguage: [{}, [Validators.required]],
      supportedLanguages: [[], [Validators.required]],
    });

    this.timezoneList();

    //checking for laocle setting form validation failures
    this.localeSettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(
        this.localeSettingForm,
        this.formErrors,
        this.validations
      );
      this.formErrors = result[0];
      this.validations = result[1];
      this.selectedCount = this.localeSettingForm.value.supportedLanguages;
      this.selectedLanguages = this.localeSettingForm.value.supportedLanguages;
    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.managePermission = this.commonService.checkManageScope("general");
  }

  //callback for language removed event
  onLanguageRemoved(lang) {
    const languages =
      this.localeSettingForm.controls["supportedLanguages"].value;
    if (languages.length > 1) {
      if (this.localeSettingForm.value.defaultLanguage.name == lang.name) {
        const length = this.selectedLanguages.length;
        const itemIndex = this.selectedLanguages.indexOf(
          this.localeSettingForm.value.defaultLanguage
        );
        let newIndex;
        if (itemIndex != -1) {
          if (itemIndex < length - 1) {
            newIndex = itemIndex + 1;
          } else {
            newIndex = itemIndex - 1;
          }
        }
        this.localeSettingForm.controls["defaultLanguage"].setValue(
          this.localeSettingForm.value.supportedLanguages[newIndex]
        );
      }
      this.removeFirst(languages, lang);
      this.localeSettingForm.controls.supportedLanguages.setValue(languages);
    }
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  //get timezone list using moment library
  timezoneList() {
    var moment = require("moment-timezone");
    let timeZoneList = moment.tz.names();
    this.timeZones = [];
    if (timeZoneList.length != 0) {
      let i = 1;
      timeZoneList.filter((e) => {
        this.timeZones.push({ name: e, id: i });
        i++;
      });
    }

    this.getLocaleSetting();
  }

  //setting default values for locale setting form
  defaultValues() {
    const index = this.timeZones.findIndex((item) => item.name === "UTC");
    this.localeSettingForm.patchValue({
      timezone: this.timeZones[index],
      supportedLanguages: [this.languages[0]],
      defaultLanguage: this.languages[0],
    });
    this.selectedLanguages = this.localeSettingForm.value.supportedLanguages;
  }

  // manupilating list timezone list
  supportedLangVal(data) {
    let temp = [];
    this.languages.forEach((lang) => {
      data.forEach((selected) => {
        if (selected.name == lang.name) temp.push(lang);
      });
    });
    return temp;
  }

  //to get locale setting list and set the local variable with the response
  getLocaleSetting() {
    this.endPointService.getLocaleSetting().subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.length > 0) {
          this.editData = res[0];
          this.selectedLanguages = this.editData.supportedLanguages;
          let supportedTemp = [];
          if (this.editData && this.editData.supportedLanguages.length > 0)
            supportedTemp = this.supportedLangVal(
              this.editData.supportedLanguages
            );
          const tzIndex = this.timeZones.findIndex(
            (item) => item.name === this.editData.timezone.name
          );
          const defLangIndex = this.languages.findIndex(
            (item) => item.name === this.editData.defaultLanguage.name
          );
          let value = {
            timezone: this.timeZones[tzIndex],
            supportedLanguages: supportedTemp,
            defaultLanguage: this.languages[defLangIndex],
          };
          this.localeSettingForm.setValue(value);
        } else {
          if (res.length == 0)
            this.snackbar.snackbarMessage("error-snackbar", "NO DATA FOUND", 2);
          this.defaultValues();
        }
      },
      (error) => {
        this.defaultValues();
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to create locale setting object and it accepts locale setting object as `data`
  createLocaleSetting(data) {
    this.spinner = true;
    this.endPointService.createLocaleSetting(data).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Settings Created",
          1
        );
        this.editData = res;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error creating", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update locale setting object and it accepts locale setting object as `data`
  updateLocaleSetting(data) {
    this.endPointService.updateLocaleSetting(data).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Settings Updated",
          1
        );
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error updating", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  onSave() {
    let data = JSON.parse(JSON.stringify(this.localeSettingForm.value));
    if (this.editData) {
      data.id = this.editData.id;
      this.spinner = true;
      this.updateLocaleSetting(data);
    } else {
      this.createLocaleSetting(data);
    }
  }

  //deselecting any language option and it accepts change event as 'e'
  manualDeselect(e) {
    if (e.value.length == 0)
      this.localeSettingForm.controls["supportedLanguages"].setValue([
        this.languages[0],
      ]);
  }

  panelClose(e) {
    if (e == false) this.searchTerm = "";
  }
}
