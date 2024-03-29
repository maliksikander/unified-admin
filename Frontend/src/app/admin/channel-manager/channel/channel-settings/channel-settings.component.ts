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
// import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogComponent } from "../../../../shared/confirm-dialog/confirm-dialog.component";
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
  @Input() editChannelData;
  @Input() channelList;
  @Output() childChannelBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();

  spinner = true;
  channelSettingForm: FormGroup;
  modeVal = ["HYBRID"];
  formErrors = {
    name: "",
    serviceIdentifier: "",
    channelConnector: "",
    channelMode: "",
    // responseSla: "",
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
  agentPolicy = ["LONGEST_AVAILABLE"];
  routingModeList = ["PULL", "PUSH", "EXTERNAL"];
  queueList = [];
  botList = [];
  pullModeListData = [];

  constructor(
    private commonService: CommonService,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.channelFormErrorMessages;

    this.channelSettingForm = this.formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9_-]+(?:\040[a-zA-Z0-9_-]+)*$/),
        ],
      ],
      serviceIdentifier: ["", [Validators.required]],
      channelConnector: [, [Validators.required]],
      channelMode: ["HYBRID", [Validators.required]],
      // responseSla: ["30"],
      customerActivityTimeout: [
        "",
        [Validators.required, Validators.max(2147483647), Validators.min(0)],
      ],
      agentSelectionPolicy: [""],
      routeToLastAgent: [true],
      routingMode: ["PUSH", [Validators.required]],
      routingObjectID: [""],
      agentRequestTTL: [""],
      botID: ["", [Validators.required]],
      defaultOutbound: [false],
    });

    //setting form validation messages
    this.channelSettingForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.channelSettingForm,
        this.formErrors,
        this.validations
      );
    });

    this.getChannelConnector();
    this.setRoutingModeValues();

    if (!this.editChannelData) this.setRoutingPolicyAttrValidation();
  }

  setRoutingModeValues() {
    if (this.channelTypeData.name == "CISCO_CC") {
      this.routingModeList.splice(0, 1);
    } else {
      this.routingModeList.splice(2, 1);
    }
  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) {}

  //to get channel connector list
  getChannelConnector() {
    this.endPointService.getConnector().subscribe(
      (res: any) => {
        this.setLocalListValue("connector", res);
        this.filterConnectorListByChanneltype();
        this.getQueue();
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  filterConnectorListByChanneltype() {
    try {
      let test = [];
      this.channelConnectorList.forEach((connector) => {
        connector.channelProviderInterface.supportedChannelTypes.forEach(
          (type) => {
            if (type.id == this.channelTypeData.id) test.push(connector);
          }
        );
      });

      this.channelConnectorList = test;
    } catch (e) {
      console.error("Error in filtering connector list :", e);
      this.spinner = false;
    }
  }

  //to get queue list
  getQueue() {
    this.endPointService.getQueue().subscribe(
      (res: any) => {
        this.setLocalListValue("queue", res);
        this.getBotList();
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get bot settings list
  getBotList() {
    this.endPointService.getBotSetting().subscribe(
      (res: any) => {
        this.setLocalListValue("bot", res);
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
        this.setLocalListValue("pull-mode", res);
        if (this.editChannelData) this.patchFormValues();
        this.spinner = false;
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  setLocalListValue(list, data) {
    try {
      if (list == "bot") this.botList = data;
      else if (list == "connector") this.channelConnectorList = data;
      else if (list == "pull-mode") this.pullModeListData = data;
      else if (list == "queue") this.queueList = data;
    } catch (e) {
      console.error("Error in setting local list value :", e);
      this.spinner = false;
    }
  }

  // patch form values to edit current values
  patchFormValues() {
    try {
      let routingIndex;
      let connectorIndex = this.channelConnectorList.findIndex(
        (item) => item.id == this.editChannelData.channelConnector.id
      );
      if (
        this.editChannelData.channelConfig.routingPolicy.routingMode == "PUSH"
      ) {
        routingIndex = this.queueList.findIndex(
          (item) =>
            item.id ==
            this.editChannelData.channelConfig.routingPolicy.routingObjectId
        );
      } else {
        routingIndex = this.pullModeListData.findIndex(
          (item) =>
            item.id ==
            this.editChannelData.channelConfig.routingPolicy.routingObjectId
        );
      }
      let botIndex = this.botList.findIndex(
        (item) => item.botId == this.editChannelData.channelConfig.botId
      );

      this.channelSettingForm.patchValue({
        name: this.editChannelData.name,
        serviceIdentifier: this.editChannelData.serviceIdentifier,
        channelMode: this.editChannelData.channelConfig.channelMode,
        // responseSla: this.editChannelData.channelConfig.responseSla,
        customerActivityTimeout:
          this.editChannelData.channelConfig.customerActivityTimeout,
        botID: botIndex != -1 ? this.botList[botIndex] : null,
        channelConnector:
          connectorIndex != -1
            ? this.channelConnectorList[connectorIndex]
            : null,
        agentSelectionPolicy:
          this.editChannelData.channelConfig.routingPolicy.agentSelectionPolicy,
        routeToLastAgent:
          this.editChannelData.channelConfig.routingPolicy.routeToLastAgent,
        routingMode:
          this.editChannelData.channelConfig.routingPolicy.routingMode,
        routingObjectID:
          routingIndex != -1
            ? this.patchRoutingObjectValue(
                routingIndex,
                this.editChannelData.channelConfig.routingPolicy.routingMode
              )
            : null,
        agentRequestTTL:
          this.editChannelData.channelConfig.routingPolicy.agentRequestTtl,
        defaultOutbound: this.editChannelData.defaultOutbound,
      });

      if (this.channelSettingForm.value.routingMode != "EXTERNAL")
        this.setRoutingPolicyAttrValidation();
      this.cd.detectChanges();
    } catch (e) {
      console.error("Error in form value patch :", e);
    }
    this.spinner = false;
  }

  patchRoutingObjectValue(index, mode) {
    try {
      if (mode == "PUSH") {
        return this.queueList[index];
      } else {
        return this.pullModeListData[index];
      }
    } catch (e) {
      console.error("Error in patching routing attr :", e);
    }
  }

  //to create 'data' object and pass it to the parent component
  onSave() {
    try {
      this.spinner = true;
      let data = this.createRequestPayload();
      if (data.id) {
        this.updateChannel(data);
      } else {
        this.createChannel(data);
      }
    } catch (e) {
      console.error("Error on save :", e);
    }
  }

  // to send event msg and reset form after success response
  emitMsgAndResetForm(status) {
    try {
      let msg = `${status} Successfully`;
      this.formSaveData.emit(msg);
      this.channelSettingForm.reset();
    } catch (e) {
      console.error("Error in emitter :", e);
      this.spinner = false;
    }
  }

  //to cancel form editing
  onClose() {
    this.childChannelBool.emit(!this.parentChannelBool);
    this.channelSettingForm.reset();
  }

  // to reset routing object id form control on routing mode selection change
  onRoutingModeSelection(val) {
    this.channelSettingForm.controls["routingObjectID"].reset();
    if (val == "EXTERNAL") {
      this.resetAndRemoveRoutingPolicyAttrValidation();
    } else {
      this.setRoutingPolicyAttrValidation();
    }
  }

  //to set/remove validations on channel mode selection on routing policy attributes, it accepts the channel mode value('BOT','AGENT','HYBRID') as val parameter

  // onChannelModeSelection(val) {
  // try {
  //   if (val != "BOT") {
  //     // this.setRoutingPolicyAttrValidation();
  //   } else {
  //     // this.resetAndRemoveRoutingPolicyAttrValidation();
  //   }
  //   this.cd.detectChanges();
  // } catch (e) {
  //   console.error("Error in selection callback :", e);
  // }
  // }

  // to set validations  on routing policy attributes
  setRoutingPolicyAttrValidation() {
    try {
      this.channelSettingForm.controls["agentRequestTTL"].setValidators([
        Validators.required,
        Validators.max(2147483647),
        Validators.min(0)
      ]);
      this.channelSettingForm.controls["agentSelectionPolicy"].setValidators([
        Validators.required,
      ]);
      this.channelSettingForm.controls["routeToLastAgent"].setValidators([
        Validators.required,
      ]);
      // this.channelSettingForm.controls["routingMode"].setValidators([
      //   Validators.required,
      // ]);
      this.channelSettingForm.controls["routingObjectID"].setValidators([
        Validators.required,
      ]);
    } catch (e) {
      console.error("Error in set validation :", e);
    }
  }

  //to reset form controls and remove validations on routing policy attributes
  resetAndRemoveRoutingPolicyAttrValidation() {
    try {
      this.channelSettingForm.controls["agentRequestTTL"].setValidators(null);
      this.channelSettingForm.controls["agentSelectionPolicy"].setValidators(
        null
      );
      this.channelSettingForm.controls["routeToLastAgent"].setValidators(null);
      // this.channelSettingForm.controls["routingMode"].setValidators(null);
      this.channelSettingForm.controls["routingObjectID"].setValidators(null);

      this.channelSettingForm.controls["agentRequestTTL"].reset();
      this.channelSettingForm.controls["agentSelectionPolicy"].reset();
      // this.channelSettingForm.controls["routingMode"].reset();
      this.channelSettingForm.controls["routingObjectID"].reset();
    } catch (e) {
      console.error("Error in validation reset :", e);
    }
  }

  // create request payload and return data object
  createRequestPayload() {
    try {
      let routingPolicyData = {
        agentSelectionPolicy:
          this.channelSettingForm.value.agentSelectionPolicy,
        routeToLastAgent: this.channelSettingForm.value.routeToLastAgent,
        routingObjectId: this.channelSettingForm.value.routingObjectID?.id
          ? this.channelSettingForm.value.routingObjectID?.id
          : null,
        routingMode: this.channelSettingForm.value.routingMode,
        agentRequestTtl: this.channelSettingForm.value.agentRequestTTL,
      };

      let channelConfigData = {
        botId: this.channelSettingForm.value.botID.botId,
        channelMode: this.channelSettingForm.value.channelMode,
        conversationBot: "",
        customerActivityTimeout:
          this.channelSettingForm.value.customerActivityTimeout,
        // responseSla:
        //   this.channelTypeData.name == "VOICE"
        //     ? null
        //     : this.channelSettingForm.value.responseSla,
        routingPolicy:
          this.channelSettingForm.value.channelMode != "BOT"
            ? routingPolicyData
            : {},
      };

      // if (this.channelTypeData.name == "VOICE")
      //   channelConfigData.routingPolicy = {
      //     // agentSelectionPolicy: null,
      //     // routeToLastAgent: false,
      //     // routingObjectId: null,
      //     // routingMode: this.channelSettingForm.value.routingMode,
      //     // routingMode: "EXTERNAL",
      //     // agentRequestTtl: 0,
      //   };

      let data: any = {
        name: this.channelSettingForm.value.name,
        serviceIdentifier: this.channelSettingForm.value.serviceIdentifier,
        channelConnector: {
          id: this.channelSettingForm.value.channelConnector.id,
        },
        tenant: {},
        channelConfig: channelConfigData,
        channelType: { id: this.channelTypeData?.id },
        defaultOutbound: this.channelSettingForm.value.defaultOutbound,
      };
      if (this.editChannelData) data.id = this.editChannelData.id;

      return data;
    } catch (e) {
      console.error("Error in request payload :", e);
    }
  }

  //to create channel, it accepts `data` object as parameter containing channel properties
  createChannel(data) {
    this.endPointService.createChannel(data).subscribe(
      (res: any) => {
        this.emitMsgAndResetForm("Created");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update channel, it accepts `data` object as parameter containing channel properties
  updateChannel(data, stateFlag?) {
    this.endPointService.updateChannel(data, data.id).subscribe(
      (res: any) => {
        if (stateFlag != "overwrite") {
          this.emitMsgAndResetForm("Updated");
        } else {
          this.spinner = false;
          // this.snackbar.snackbarMessage("success-snackbar", "Default Channel", 1);
        }
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  onOutboundChange(event) {
    if (event == true) {
      let defaultOutboundChannel = this.channelList.find(
        (item) => item.defaultOutbound == true
      );
      if (defaultOutboundChannel) {
        if (
          this.editChannelData &&
          defaultOutboundChannel.id == this.editChannelData.id
        ) {
        } else {
          this.updateOuboundChannelConfirmationDialog(defaultOutboundChannel);
        }
      }
    }
  }

  updateOuboundChannelConfirmationDialog(channel) {
    let msg = `'${channel.name}' is marked as default outbound channel. Are you sure you want to update this setting ?`;
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Update Outbound Channel",
          message: msg,
          text: "yes",
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === undefined) {
          this.overwritePreviousDefaultOutboundChannel(channel);
        } else {
          this.spinner = false;
          this.channelSettingForm.controls["defaultOutbound"].setValue(false);
        }
      });
  }

  overwritePreviousDefaultOutboundChannel(channel) {
    let data = JSON.parse(JSON.stringify(channel));
    data.channelConnector = {
      id: channel.channelConnector.id,
    };

    data.channelType = {
      id: channel.channelType.id,
    };
    data.defaultOutbound = false;
    this.updateChannel(data, "overwrite");
  }
}
