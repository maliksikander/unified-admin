import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
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
    responseSLA: '',
    customerActivityTimeout: '',
    botId: ''
  };
  validations;
  channelConnectorList = [];


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
      responseSLA: ['', [Validators.required]],
      customerActivityTimeout: ['', [Validators.required]],
      botId: ['', [Validators.required]]
    });

    //setting form validation messages 
    this.channelSettingForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.channelSettingForm, this.formErrors, this.validations);
    });

    this.getChannelConnector(this.channelTypeData.id);
  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) { }

  //to get channel connector list, it accepts channel type id as `typeId` parameter
  getChannelConnector(typeId) {

    let reqType = 'channel-connectors'
    //calling endpoint service method to get connector list which accepts resource name as 'reqType' and channnel type id as `typeId` object as parameter
    this.endPointService.getByChannelType(reqType, typeId).subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelConnectorList = res;
        if (this.channelData) {
          let connectorIndex = this.channelConnectorList.findIndex(item => item.id == this.channelData.channelConnector.id);
          this.channelSettingForm.patchValue({
            channelName: this.channelData.channelName,
            serviceIdentifier: this.channelData.serviceIdentifier,
            channelMode: this.channelData.channelConfig.channelMode,
            responseSLA: this.channelData.channelConfig.responseSLA,
            customerActivityTimeout: this.channelData.channelConfig.customerActivityTimeout,
            botId: this.channelData.channelConfig.botId,
            channelConnector: this.channelConnectorList[connectorIndex],
          });
        }
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to create 'data' object and pass it to the parent component
  onSave() {

    let channelConfigData = {
      botId: this.channelSettingForm.value.botId,
      channelMode: this.channelSettingForm.value.channelMode,
      conversationBot: "",
      customerActivityTimeout: this.channelSettingForm.value.customerActivityTimeout,
      customerIdentificationCriteria: {},
      responseSLA: this.channelSettingForm.value.responseSLA,
      routingPolicy: {},
    };

    let data: any = {
      channelName: this.channelSettingForm.value.channelName,
      serviceIdentifier: this.channelSettingForm.value.serviceIdentifier,
      channelConnector: this.channelSettingForm.value.channelConnector,
      tenant: {},
      channelConfig: channelConfigData,
    }
    if (this.channelData) data.id = this.channelData.id;
    this.formSaveData.emit(data);
    this.channelSettingForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childChannelBool.emit(!this.parentChannelBool);
    this.channelSettingForm.reset();
  }

}