import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from "../../../services/common.service";
import { EndpointService } from "../../../services/endpoint.service";
import { SnackbarService } from "../../../services/snackbar.service";

@Component({
  selector: "app-channel-settings",
  templateUrl: "./channel-settings.component.html",
  styleUrls: ["./channel-settings.component.scss"],
})
export class ChannelSettingsComponent implements OnInit, OnChanges {
  @Input() parentChannelBool;
  @Input() channelTypeData;
  @Input() channelData;
  @Output() childChannelBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  spinner = true;
  channelSettingForm: FormGroup;
  modeVal = ["BOT", "AGENT", "HYBRID"];
  formErrors = {
    channelName: "",
    serviceIdentifier: "",
    channelConnector: "",
    channelMode: "",
    responseSla: "",
    customerActivityTimeout: "",
    botID: "",
    agentSelectionPolicy: "",
    defaultQueue: "",
    routingMode: "",
    routingObjectID: "",
    agentRequestTTL: "",
  };
  validations;
  channelConnectorList = [];
  agentPolicy = ["LEAST_SKILLED", "MOST_SKILLED", "LONGEST_AVAILABLE"];
  routingModeList = ["PULL", "PUSH"];
  queueList = [];
  botList = [];
  pullModeListData = [];

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.channelFormErrorMessages;

    this.channelSettingForm = this.formBuilder.group({
      channelName: ["", [Validators.required]],
      serviceIdentifier: ["", [Validators.required]],
      channelConnector: [, [Validators.required]],
      channelMode: ["BOT", [Validators.required]],
      responseSla: ["", [Validators.required]],
      customerActivityTimeout: ["", [Validators.required]],
      agentSelectionPolicy: [""],
      routeToLastAgent: [true],
      routingMode: ["PUSH"],
      routingObjectID: [""],
      agentRequestTTL: [""],
      botID: ["", [Validators.required]],
    });

    //setting form validation messages
    this.channelSettingForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.channelSettingForm,
        this.formErrors,
        this.validations
      );
    });

    this.getChannelConnector(this.channelTypeData?.id);
  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) {}

  //to get channel connector list, it accepts channel type id as `typeId` parameter
  getChannelConnector(typeId) {
    //calling endpoint service method to get connector list which accepts resource name as 'reqType' and channnel type id as `typeId` object as parameter
    this.endPointService.getConnectorByChannelType(typeId).subscribe(
      (res: any) => {
        // this.spinner = false;
        this.channelConnectorList = res;
        this.getQueue();
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get queue list
  getQueue() {
    //calling endpoint service method to get connector list which accepts resource name as 'reqType' and channnel type id as `typeId` object as parameter
    this.endPointService.getQueue().subscribe(
      (res: any) => {
        this.queueList = res;
        this.getBotList();
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get bot settings list, it accepts bot type as `type` parameter
  getBotList() {
    //calling bot setting endpoint, it accepts bot type as `type` parameter
    this.endPointService.getBotSetting().subscribe(
      (res: any) => {
        this.botList = res;
        this.getPullModeList();
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get pull mode list
  getPullModeList() {
    this.endPointService.getPullModeList().subscribe(
      (res: any) => {
        this.pullModeListData = res;
        if (
          this.queueList?.length > 0 &&
          this.channelConnectorList?.length > 0 &&
          this.channelData
        ) {
          this.patchFormValues();
        } else {
          this.spinner = false;
        }
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  patchFormValues() {
    let routingIndex;
    let connectorIndex = this.channelConnectorList.findIndex(
      (item) => item.id == this.channelData.channelConnector.id
    );
    if (this.channelData.channelConfig.routingPolicy.routingMode == "PUSH") {
      routingIndex = this.queueList.findIndex(
        (item) =>
          item.id ==
          this.channelData.channelConfig.routingPolicy.routingObjectId
      );
    } else {
      routingIndex = this.pullModeListData.findIndex(
        (item) =>
          item.id ==
          this.channelData.channelConfig.routingPolicy.routingObjectId
      );
    }
    let botIndex = this.botList.findIndex(
      (item) => item.botId == this.channelData.channelConfig.botId
    );
    this.channelSettingForm.patchValue({
      channelName: this.channelData.channelName,
      serviceIdentifier: this.channelData.serviceIdentifier,
      channelMode: this.channelData.channelConfig.channelMode,
      responseSla: this.channelData.channelConfig.responseSla,
      customerActivityTimeout:
        this.channelData.channelConfig.customerActivityTimeout,
      botID: botIndex != -1 ? this.botList[botIndex] : null,
      channelConnector:
        connectorIndex != -1 ? this.channelConnectorList[connectorIndex] : null,
      agentSelectionPolicy:
        this.channelData.channelConfig.routingPolicy.agentSelectionPolicy,
      routeToLastAgent:
        this.channelData.channelConfig.routingPolicy.routeToLastAgent,
      routingMode: this.channelData.channelConfig.routingPolicy.routingMode,
      routingObjectID:
        routingIndex != -1
          ? this.patchRoutingObjectValue(
              routingIndex,
              this.channelData.channelConfig.routingPolicy.routingMode
            )
          : null,
      agentRequestTTL:
        this.channelData.channelConfig.routingPolicy.agentRequestTtl,
    });
    this.onChannelModeSelection(this.channelSettingForm.value.channelMode);
    this.spinner = false;
  }

  patchRoutingObjectValue(index, mode) {
    if (mode == "PUSH") {
      return this.queueList[index];
    } else {
      return this.pullModeListData[index];
    }
  }

  //to create 'data' object and pass it to the parent component
  onSave() {
    let routingPolicyData = {
      agentSelectionPolicy: this.channelSettingForm.value.agentSelectionPolicy,
      routeToLastAgent: this.channelSettingForm.value.routeToLastAgent,
      routingObjectId: this.channelSettingForm.value.routingObjectID?.id,
      routingMode: this.channelSettingForm.value.routingMode,
      agentRequestTtl: this.channelSettingForm.value.agentRequestTTL,
    };

    let channelConfigData = {
      botId: this.channelSettingForm.value.botID.botId,
      channelMode: this.channelSettingForm.value.channelMode,
      conversationBot: "",
      customerActivityTimeout:
        this.channelSettingForm.value.customerActivityTimeout,
      responseSla: this.channelSettingForm.value.responseSla,
      routingPolicy:
        this.channelSettingForm.value.channelMode != "BOT"
          ? routingPolicyData
          : {},
    };

    let data: any = {
      channelName: this.channelSettingForm.value.channelName,
      serviceIdentifier: this.channelSettingForm.value.serviceIdentifier,
      channelConnector: {
        id: this.channelSettingForm.value.channelConnector.id,
      },
      tenant: {},
      channelConfig: channelConfigData,
    };
    if (this.channelData) data.id = this.channelData.id;

    // console.log("save==>", data);
    this.formSaveData.emit(data);
    this.channelSettingForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childChannelBool.emit(!this.parentChannelBool);
    this.channelSettingForm.reset();
  }

  // to reset routing object id form control on routing mode selection change
  resetRoutingObjecIdFormControl() {
    this.channelSettingForm.controls["routingObjectID"].reset();
  }

  //to set/remove validations on channel mode selection on routing policy attributes, it accepts the channel mode value('BOT','AGENT','HYBRID') as val parameter

  onChannelModeSelection(val) {
    if (val != "BOT") {
      this.setRoutingPolicyAttrValidation();
    } else {
      this.resetAndRemoveRoutingPolicyAttrValidation();
    }
    this.cd.detectChanges();
  }

  // to set validations  on routing policy attributes
  setRoutingPolicyAttrValidation() {
    this.channelSettingForm.controls["agentRequestTTL"].setValidators([
      Validators.required,
    ]);
    this.channelSettingForm.controls["agentSelectionPolicy"].setValidators([
      Validators.required,
    ]);
    this.channelSettingForm.controls["routeToLastAgent"].setValidators([
      Validators.required,
    ]);
    this.channelSettingForm.controls["routingMode"].setValidators([
      Validators.required,
    ]);
    this.channelSettingForm.controls["routingObjectID"].setValidators([
      Validators.required,
    ]);
  }

  //to reset form controls and remove validations on routing policy attributes
  resetAndRemoveRoutingPolicyAttrValidation() {
    this.channelSettingForm.controls["agentRequestTTL"].setValidators(null);
    this.channelSettingForm.controls["agentSelectionPolicy"].setValidators(
      null
    );
    this.channelSettingForm.controls["routeToLastAgent"].setValidators(null);
    this.channelSettingForm.controls["routingMode"].setValidators(null);
    this.channelSettingForm.controls["routingObjectID"].setValidators(null);

    this.channelSettingForm.controls["agentRequestTTL"].reset();
    this.channelSettingForm.controls["agentSelectionPolicy"].reset();
    this.channelSettingForm.controls["routingMode"].reset();
    this.channelSettingForm.controls["routingObjectID"].reset();
  }
}
