import {
  AfterViewInit,
  ChangeDetectorRef,
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
export class WebWidgetFormComponent implements OnInit, AfterViewInit {
  @Input() parentBool;
  @Input() editWebWidgetData;
  @Output() childBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  widgetConfigForm: FormGroup;
  formErrors = {
    enableDynamicLink: "",
    enableDownloadTranscript: "",
    enableEmoji: "",
    enableFileTransfer: "",
    enableFontResize: "",
    form: "",
    language: "",
    subTitle: "",
    theme: "",
    title: "",
    widgetIdentifier: "",
    // WebRtc Configs
    enableWebRtc: "",
    enabledSipLogs: "",
    diallingUri: "",
    sipExtension: "",
    extensionPassword: "",
    channel: "",
    websocket: "",
    wssFs: "",
    uriFs: "",
    // Callback Configs
    enableCallback: "",
    callbackUrl: "",
    campaignId: "",
    allowDuplicate: "",
    callBackForm: "",
    standaloneCallback: "",
    // Webhook Configs
    enableWebhook: "",
    webhookUrl: "",
  }
  inputValue: string = '';
  tokens: string[] = [];
  validations;
  spinner = true;
  formsList = [];
  themeList = [];
  languageList = [];
  toggle = false;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    //setting local form validation messages
    this.validations = this.commonService.webWidgetFormErrorMessages;
    this.themeList = this.endPointService.widgetThemes;
    this.widgetConfigForm = this.formBuilder.group({
      enableDynamicLink: [true, [Validators.required]],
      enableDownloadTranscript: [true, [Validators.required]],
      enableEmoji: [true, [Validators.required]],
      enableFileTransfer: [true, [Validators.required]],
      enableFontResize: [true, [Validators.required]],
      form: ["", [Validators.required]],
      language: ["", [Validators.required]],
      subTitle: ["", [Validators.required, Validators.maxLength(100)]],
      theme: ["#2889e9", [Validators.required]],

      //WebRtc Configs
      enableWebRtc: [false],
      enabledSipLogs: [false],
      wssFs: [""],
      uriFs: [""],
      diallingUri: [""],
      sipExtension: [""],
      extensionPassword: [""],
      channel: [""],
      websocket: [""],
      iceServers: [""],

      // Callback Configs
      enableCallback: [false],
      callbackUrl: [""],
      campaignId: [""],
      allowDuplicate: [""],
      callBackForm: [""],
      standaloneCallback: [false],

      // Webhook Configs
      enableWebhook: [false],
      webhookUrl: [""],

      title: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$"),
        ],
      ],
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
    this.getForms();
  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) { }

  ngAfterViewInit() {
    this.widgetConfigForm.get('enableWebRtc').valueChanges.subscribe(() => {
      this.changeDetector.detectChanges();
      if (this.widgetConfigForm.get('enableWebRtc').value) {
        this.widgetConfigForm.get('wssFs').setValidators([Validators.required, Validators.maxLength(50)]);
        this.widgetConfigForm.get('uriFs').setValidators([Validators.required, Validators.maxLength(50)]);
        this.widgetConfigForm.get('diallingUri').setValidators([Validators.required]);
        this.widgetConfigForm.get('sipExtension').setValidators([Validators.required]);
        this.widgetConfigForm.get('extensionPassword').setValidators([Validators.required]);
        this.widgetConfigForm.get('channel').setValidators([Validators.required]);
        this.widgetConfigForm.get('websocket').setValidators([Validators.required]);
      }
      else if (!this.widgetConfigForm.get('enableWebRtc').value) {
        this.widgetConfigForm.get('wssFs').setValidators(null);
        this.widgetConfigForm.get('uriFs').setValidators(null);
        this.widgetConfigForm.get('diallingUri').setValidators(null);
        this.widgetConfigForm.get('sipExtension').setValidators(null);
        this.widgetConfigForm.get('extensionPassword').setValidators(null);
        this.widgetConfigForm.get('channel').setValidators(null);
        this.widgetConfigForm.get('websocket').setValidators(null);
      }
    });

    this.widgetConfigForm.get('enableCallback').valueChanges.subscribe(() => {
      this.changeDetector.detectChanges();
      if (this.widgetConfigForm.get('enableCallback').value) {
        this.widgetConfigForm.get('callbackUrl').setValidators([Validators.required, Validators.maxLength(50)]);
        this.widgetConfigForm.get('campaignId').setValidators([Validators.required, Validators.maxLength(10)]);
        this.widgetConfigForm.get('allowDuplicate').setValidators([Validators.required, Validators.maxLength(50)]);
        this.widgetConfigForm.get('callBackForm').setValidators([Validators.required, Validators.maxLength(50)]);
      } else if (!this.widgetConfigForm.get('enableCallback').value) {
        this.widgetConfigForm.get('callbackUrl').setValidators(null);
        this.widgetConfigForm.get('campaignId').setValidators(null);
        this.widgetConfigForm.get('allowDuplicate').setValidators(null);
        this.widgetConfigForm.get('callBackForm').setValidators(null);
      }
    });

    this.widgetConfigForm.get('enableWebhook').valueChanges.subscribe(() => {
      this.changeDetector.detectChanges();
      if (this.widgetConfigForm.get('enableWebhook').value) {
        this.widgetConfigForm.get('webhookUrl').setValidators([Validators.required, Validators.maxLength(250)]);
      } else if (!this.widgetConfigForm.get('enableWebhook').value) {
        this.widgetConfigForm.get('webhookUrl').setValidators(null);
      }
    });
  }

  addToken() {
    if (this.inputValue.trim() !== '') {
      this.tokens.push(this.inputValue.trim());
      this.inputValue = '';
    }
  }
  getEditToken(data) {
    this.tokens = data;
    return this.tokens
  }
  removeToken(tokenToRemove: string) {
    this.tokens = this.tokens.filter(token => token !== tokenToRemove);
  }

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
        // webRtc Object
        wssFs: this.editWebWidgetData.webRtc.wssFs,
        uriFs: this.editWebWidgetData.webRtc.uriFs,
        websocket: this.editWebWidgetData.webRtc.websocket,
        sipExtension: this.editWebWidgetData.webRtc.sipExtension,
        diallingUri: this.editWebWidgetData.webRtc.diallingUri,
        channel: this.editWebWidgetData.webRtc.channel,
        enableWebRtc: this.editWebWidgetData.webRtc.enableWebRtc,
        enabledSipLogs: this.editWebWidgetData.webRtc.enabledSipLogs,
        extensionPassword: this.editWebWidgetData.webRtc.extensionPassword,
        // callback Object
        enableCallback: this.editWebWidgetData.callback.enableCallback,
        callbackUrl: this.editWebWidgetData.callback.callbackUrl,
        campaignId: this.editWebWidgetData.callback.campaignId,
        allowDuplicate: this.editWebWidgetData.callback.allowDuplicate,
        callBackForm: this.editWebWidgetData.callback.callBackForm,
        standaloneCallback: this.editWebWidgetData.callback.standaloneCallback,
        // webhook Object
        enableWebhook: this.editWebWidgetData.webhook.enableWebhook,
        webhookUrl: this.editWebWidgetData.webhook.webhookUrl,
      });
      if (this.editWebWidgetData.webRtc.enableWebRtc == true) this.getEditToken(this.editWebWidgetData.webRtc.iceServers[0].urls);
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
  }

  // To Get webRtc Object after submitting the form.
  getWebRtcObj() {
    return {
      enableWebRtc: this.widgetConfigForm.value.enableWebRtc,
      wssFs: this.widgetConfigForm.value.wssFs,
      uriFs: this.widgetConfigForm.value.uriFs,
      diallingUri: this.widgetConfigForm.value.diallingUri,
      sipExtension: this.widgetConfigForm.value.sipExtension,
      enabledSipLogs: this.widgetConfigForm.value.enabledSipLogs,
      extensionPassword: this.widgetConfigForm.value.extensionPassword,
      channel: this.widgetConfigForm.value.channel,
      websocket: this.widgetConfigForm.value.websocket,
      iceServers: [
        {
          urls: this.tokens
        }
      ]
    }
  }

  // To Get callback Object after submitting the form
  getCallbackObj() {
    return {
      enableCallback: this.widgetConfigForm.value.enableCallback,
      callbackUrl: this.widgetConfigForm.value.callbackUrl,
      campaignId: this.widgetConfigForm.value.campaignId,
      allowDuplicate: this.widgetConfigForm.value.allowDuplicate,
      callBackForm: this.widgetConfigForm.value.callBackForm,
      standaloneCallback: this.widgetConfigForm.value.standaloneCallback,
    }
  }

  // To Get Webhook Object after submitting the form
  getWebhookObj() {
    return {
      enableWebhook: this.widgetConfigForm.value.enableWebhook,
      webhookUrl: this.widgetConfigForm.value.webhookUrl,
    }
  }

  // to create request payload
  setWidgetRequestPayload() {
    if (this.widgetConfigForm.value.enableWebRtc != null) { this.widgetConfigForm.value.webRtc = this.getWebRtcObj() }
    if (this.widgetConfigForm.value.enableCallback != null) { this.widgetConfigForm.value.callback = this.getCallbackObj() }
    if (this.widgetConfigForm.value.enableWebhook != null) { this.widgetConfigForm.value.webhook = this.getWebhookObj() }
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

  //to get form list and set the local variable with the response
  getForms() {
    this.endPointService.getForm().subscribe(
      (res: any) => {
        this.formsList = res;
        if (this.formsList.length == 0)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "No Form Found",
            1
          );
        this.spinner = false;
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching available forms:", error);
      }
    );
  }

  getLocaleSettings() {
    //calling endpoint service method to get local settings
    this.endPointService.getLocaleSetting().subscribe(
      (res: any) => {
        this.languageList = res[0]?.supportedLanguages
          ? res[0]?.supportedLanguages
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