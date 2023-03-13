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
    {
      code: "ar",
      name: "Arabic",
      flag:"data:image/png;base64,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"

    }
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
