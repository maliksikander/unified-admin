import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-web-widget-form",
  templateUrl: "./web-widget-form.component.html",
  styleUrls: ["./web-widget-form.component.scss"],
})
export class WebWidgetFormComponent implements OnInit {
  @Input() parentBool;
  @Input() editWebWidgetData;
  @Output() childBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  widgetConfigForm: FormGroup;
  formErrors = {
    customerReconnectTime: "",
    enableDynamicLink: "",
    enableDownloadTranscript: "",
    enableEmoji: "",
    enableFileTransfer: "",
    enableFontResize: "",
    language: "",
    subTitle: "",
    theme: "",
    title: "",
    widgetIdentifier: "",
  };
  validations;

  spinner = true;
  themeList = [];
  languageList = [];

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private endPointService: EndpointService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.webWidgetFormErrorMessages;
    this.themeList = this.endPointService.widgetThemes;

    this.widgetConfigForm = this.formBuilder.group({
      customerReconnectTime: ["", [Validators.required]],
      enableDynamicLink: [true, [Validators.required]],
      enableDownloadTranscript: [true, [Validators.required]],
      enableEmoji: [true, [Validators.required]],
      enableFileTransfer: [true, [Validators.required]],
      enableFontResize: [true, [Validators.required]],
      language: ["", [Validators.required]],
      subTitle: ["", [Validators.required]],
      theme: ["", [Validators.required]],
      title: ["", [Validators.required]],
      widgetIdentifier: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("^[a-zA-Z0-9*_-]*$"),
        ],
      ],
    });

    //setting form validation messages
    this.widgetConfigForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.widgetConfigForm,
        this.formErrors,
        this.validations
      );
    });

    this.getLocaleSettings();
  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) {}

  //to cancel form editing
  onClose() {
    this.childBool.emit(!this.parentBool);
    this.widgetConfigForm.reset();
  }

  //patch value to form to be edited
  patchEditValues() {
    let languageIndex = -1;
    try {
      if (this.languageList.length > 0) {
        languageIndex = this.languageList.findIndex(
          (item) => item.code === this.editWebWidgetData.language.code
        );
      }
      this.widgetConfigForm.patchValue(this.editWebWidgetData);
      this.widgetConfigForm.patchValue({
        language: languageIndex != -1 ? this.languageList[languageIndex] : null,
      });
      this.widgetConfigForm.controls["widgetIdentifier"].disable();
    } catch (e) {
      console.error("Error==>", e);
      this.spinner = false;
    }
  }

  //on save callback function
  onSave() {
    this.spinner = true;
    let data: any = this.setWidgetRequestPayload();
    if (data.id) {
      this.updateWidgetConfig(data);
    } else {
      this.createWebWidget(data);
    }
    // console.log("data==>", data);
  }

  // to create request payload
  setWidgetRequestPayload() {
    let data = JSON.parse(JSON.stringify(this.widgetConfigForm.value));
    if (this.editWebWidgetData) {
      if (!data.widgetIdentifier)
        data.widgetIdentifier = this.editWebWidgetData.widgetIdentifier;
      data.id = this.editWebWidgetData.id;
    }
    return data;
  }

  // to send event msg and reset form after success response
  emitMsgAndResetForm(status) {
    let msg = `${status} Successfully`;
    this.formSaveData.emit(msg);
    this.widgetConfigForm.reset();
  }

  //to create channel, it accepts `data` object as parameter containing channel type properties
  createWebWidget(data) {
    //calling endpoint service method which accepts resource name as 'reqEndpoint' and `data` object as parameter
    this.endPointService.createWebWidget(data).subscribe(
      (res: any) => {
        this.emitMsgAndResetForm("Created");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
      }
    );
  }

  //to update channel type, it accepts `data` object as parameter containing channel type properties
  updateWidgetConfig(data) {
    //calling endpoint service method which accepts resource endpoint as 'reqEndpoint' and `data` object as parameter
    this.endPointService
      .updateWebWidgetConfig(data, data.widgetIdentifier)
      .subscribe(
        (res: any) => {
          this.emitMsgAndResetForm("Updated");
        },
        (error: any) => {
          this.spinner = false;
          console.error("Error Updating widget:", error);
        }
      );
  }

  getLocaleSettings() {
    //calling endpoint service method to get local settings
    this.endPointService.getLocaleSetting().subscribe(
      (res: any) => {
        this.languageList = res?.localeSetting[0]?.supportedLanguages
          ? res?.localeSetting[0]?.supportedLanguages
          : [];
        if (this.languageList.length == 0)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "No Language Found",
            1
          );
        if (this.editWebWidgetData) this.patchEditValues();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching locale settings:", error);
      }
    );
  }
}
