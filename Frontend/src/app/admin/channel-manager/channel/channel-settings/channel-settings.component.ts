import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { EndpointService } from '../../../services/endpoint.service';
import { SnackbarService } from '../../../services/snackbar.service';


@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit, OnChanges {


  @Input() parentChannelBool;
  @Input() channelTypeData;
  @Input() channelData;
  @Output() childChannelBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  spinner = true;
  channelSettingForm: FormGroup;
  modeVal = ['BOT', 'AGENT', 'HYBRID'];
  formErrors = {
    channelName: '',
    serviceIdentifier: '',
    channelConnector: '',
    channelMode: '',
    responseSla: '',
    customerActivityTimeout: '',
    botID: '',
    agentSelectionPolicy: '',
    defaultQueue: '',
    agentRequestTTL: ''
  };
  validations;
  channelConnectorList = [];
  agentPolicy = ['LEAST_SKILLED', 'MOST_SKILLED', 'LONGEST_AVAILABLE'];
  queueList = [];
  botList = [];


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();

    //setting local form validation messages 
    this.validations = this.commonService.channelFormErrorMessages;


    this.channelSettingForm = this.formBuilder.group({
      channelName: ['', [Validators.required]],
      serviceIdentifier: ['', [Validators.required]],
      channelConnector: [, [Validators.required]],
      channelMode: ['', [Validators.required]],
      responseSla: ['', [Validators.required]],
      customerActivityTimeout: ['', [Validators.required]],
      agentSelectionPolicy: ['', [Validators.required]],
      routeToLastAgent: [true, [Validators.required]],
      defaultQueue: ['', [Validators.required]],
      agentRequestTTL: ['', [Validators.required]],
      botID: ['', [Validators.required]]
    });

    //setting form validation messages 
    this.channelSettingForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.channelSettingForm, this.formErrors, this.validations);
    });

    this.getChannelConnector(this.channelTypeData?.id);

  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) { }

  //to get channel connector list, it accepts channel type id as `typeId` parameter
  getChannelConnector(typeId) {

    // let reqType = 'channel-connectors'
    //calling endpoint service method to get connector list which accepts resource name as 'reqType' and channnel type id as `typeId` object as parameter
    this.endPointService.getConnectorByChannelType(typeId).subscribe(
      (res: any) => {
        // this.spinner = false;
        this.channelConnectorList = res;
        this.getQueue();
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to get queue list
  getQueue() {

    //calling endpoint service method to get connector list which accepts resource name as 'reqType' and channnel type id as `typeId` object as parameter
    this.endPointService.getQueue().subscribe(
      (res: any) => {
        this.queueList = res;
        this.getBotList();

      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to get bot settings list, it accepts bot type as `type` parameter
  getBotList() {

    //calling bot setting endpoint, it accepts bot type as `type` parameter
    this.endPointService.getBotSetting().subscribe(
      (res: any) => {
        this.botList = res;
        if (this.queueList?.length > 0 && this.channelConnectorList?.length > 0 && this.channelData) { this.patchFormValues(); }
        else { this.spinner = false; }
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }


  patchFormValues() {

    let connectorIndex = this.channelConnectorList.findIndex(item => item.id == this.channelData.channelConnector.id);
    let queueIndex = this.queueList.findIndex(item => item.id == this.channelData.channelConfig.routingPolicy.defaultQueue);
    let botIndex = this.botList.findIndex(item => item.botId == this.channelData.channelConfig.botId);
    this.channelSettingForm.patchValue({
      channelName: this.channelData.channelName,
      serviceIdentifier: this.channelData.serviceIdentifier,
      channelMode: this.channelData.channelConfig.channelMode,
      responseSla: this.channelData.channelConfig.responseSla,
      customerActivityTimeout: this.channelData.channelConfig.customerActivityTimeout,
      botID: botIndex != -1 ? this.botList[botIndex] : null,
      channelConnector: connectorIndex != -1 ? this.channelConnectorList[connectorIndex] : null,
      agentSelectionPolicy: this.channelData.channelConfig.routingPolicy.agentSelectionPolicy,
      routeToLastAgent: this.channelData.channelConfig.routingPolicy.routeToLastAgent,
      defaultQueue: queueIndex != -1 ? this.queueList[queueIndex] : null,
      agentRequestTTL: this.channelData.channelConfig.routingPolicy.agentRequestTTL,
    });
    this.spinner = false;
  }


  //to create 'data' object and pass it to the parent component
  onSave() {

    let routingPolicy = {
      agentSelectionPolicy: this.channelSettingForm.value.agentSelectionPolicy,
      routeToLastAgent: this.channelSettingForm.value.routeToLastAgent,
      defaultQueue: this.channelSettingForm.value.defaultQueue.id,
      agentRequestTTL: this.channelSettingForm.value.agentRequestTTL,
    }

    let channelConfigData = {
      botId: this.channelSettingForm.value.botID.botId,
      channelMode: this.channelSettingForm.value.channelMode,
      conversationBot: "",
      customerActivityTimeout: this.channelSettingForm.value.customerActivityTimeout,
      responseSla: this.channelSettingForm.value.responseSla,
      routingPolicy: routingPolicy,
    };

    let data: any = {
      channelName: this.channelSettingForm.value.channelName,
      serviceIdentifier: this.channelSettingForm.value.serviceIdentifier,
      channelConnector: this.channelSettingForm.value.channelConnector,
      tenant: {},
      channelConfig: channelConfigData,
    }
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

}