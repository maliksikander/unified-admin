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
  // @Input() botData;
  @Output() childBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  widgetConfigForm: FormGroup;
  formErrors = {
    customerReconnectTime: "",
    dynamicLink: "",
    downloadTranscript: "",
    emoji: "",
    fileTransfer: "",
    fontResize: "",
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
    private snackbar: SnackbarService,
    private endPointService: EndpointService
  ) {}

  ngOnInit(): void {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.webWidgetFormErrorMessages;
    this.themeList = this.endPointService.widgetThemes;

    this.widgetConfigForm = this.formBuilder.group({
      customerReconnectTime: ["", [Validators.required]],
      dynamicLink: [true, [Validators.required]],
      downloadTranscript: [true, [Validators.required]],
      emoji: [true, [Validators.required]],
      fileTransfer: [true, [Validators.required]],
      fontResize: [true, [Validators.required]],
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

    this.getLocalSettings();
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
    try {
      if (this.editWebWidgetData) {
        // const mrdIndex = this.mrdData.findIndex(
        //   (item) => item.id === this.editData.mediaRoutingDomain
        // );
        // const formIndex = this.formsList.findIndex(
        //   (item: any) => item.id === this.editData?.channelConfigSchema
        // );
        this.widgetConfigForm.patchValue({
          typeName: this.editWebWidgetData.typeName,
          isInteractive: this.editWebWidgetData.isInteractive,
          // channelConfigSchema: this.formsList[formIndex],
          // mediaRoutingDomain: this.mrdData[mrdIndex],
          channelLogo: " ",
        });

        this.widgetConfigForm.controls["typeName"].disable();
        // this.getFileStats(this.editData.channelLogo);
        // this.imageData = `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${this.editData?.channelLogo}`;
      }
    } catch (e) {
      console.error("Error==>", e);
      this.spinner = false;
    }
  }

  //on save callback function to create
  onSave() {
    // this.spinner = true;

    let data: any = this.setChannelTypeRequestPayload();
    // if (data.id) {
    //   this.updateChannel(data);
    // } else {
    //   this.createChannelType(data);
    // }
    console.log("data==>", data);
  }

  // to create request payload, it receives selected file for logo as filename parameter
  setChannelTypeRequestPayload() {
    // console.log("Fprm value==>",this.widgetConfigForm.value)
    let data = JSON.parse(JSON.stringify(this.widgetConfigForm.value));
    console.log("data==>", data);
    // data.channelConfigSchema = data.channelConfigSchema.id;
    // data.channelLogo = filename;
    // data.mediaRoutingDomain = data.mediaRoutingDomain.id;
    if (this.editWebWidgetData) {
      if (!data.widgetIdentifier)
        data.widgetIdentifier = this.editWebWidgetData.widgetIdentifier;
      data.id = this.editWebWidgetData.id;
    }
    // console.log("data==>", data);

    return data;
  }

  // to send event msg and reset form after success response
  emitMsgAndResetForm(status) {
    let msg = `${status} Successfully`;
    this.formSaveData.emit(msg);
    this.widgetConfigForm.reset();
  }

  //to create channel, it accepts `data` object as parameter containing channel type properties
  createChannelType(data) {
    //calling endpoint service method which accepts resource name as 'reqEndpoint' and `data` object as parameter
    this.endPointService.createChannelType(data).subscribe(
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
  updateChannel(data) {
    //calling endpoint service method which accepts resource endpoint as 'reqEndpoint' and `data` object as parameter
    this.endPointService
      .updateChannelType(data, data.widgetIdentifier)
      .subscribe(
        (res: any) => {
          this.emitMsgAndResetForm("Updated");
        },
        (error: any) => {
          this.spinner = false;
          console.error("Error fetching:", error);
        }
      );
  }

  getLocalSettings(){
     //calling endpoint service method to get web widget list
     this.endPointService.getLocaleSetting().subscribe(
      (res: any) => {
        // this.webWidgetList = res;
        console.log("res==>",res)
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching web widget list:", error);
      }
    );
  }
}
