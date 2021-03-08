import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from 'src/app/admin/services/common.service';
import { EndpointService } from 'src/app/admin/services/endpoint.service';
import { SnackbarService } from 'src/app/admin/services/snackbar.service';

@Component({
  selector: 'app-bot-settings',
  templateUrl: './bot-settings.component.html',
  styleUrls: ['./bot-settings.component.scss']
})
export class BotSettingsComponent implements OnInit {

  @Input() parentBotBool;
  // @Input() channelTypeData;
  @Input() botData;
  @Output() childBotBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  spinner = false;
  botSettingForm: FormGroup;
  modeVal = ['BOT', 'AGENT', 'HYBRID'];
  formErrors = {
    botName: '',
    botURL: '',
  };
  validations;
  // channelConnectorList = [];


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();

    //setting local form validation messages 
    this.validations = this.commonService.botFormErrorMessages;


    this.botSettingForm = this.formBuilder.group({
      botName: ['', [Validators.required]],
      botURL: ['', [Validators.required]],
    });

    //setting form validation messages 
    this.botSettingForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.botSettingForm, this.formErrors, this.validations);
    });

    // this.getChannelConnector(this.channelTypeData.id);
  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) { }

  //to get channel connector list, it accepts channel type id as `typeId` parameter
  // getChannelConnector(typeId) {

  //   let reqType = 'channel-connectors'
  //   //calling endpoint service method to get connector list which accepts resource name as 'reqType' and channnel type id as `typeId` object as parameter
  //   this.endPointService.getByChannelType(reqType, typeId).subscribe(
  //     (res: any) => {
  //       this.spinner = false;
  //       this.channelConnectorList = res;
  //       if (this.channelData) {
  //         let connectorIndex = this.channelConnectorList.findIndex(item => item.id == this.channelData.channelConnector.id);
  //         this.channelSettingForm.patchValue({
  //           channelName: this.channelData.channelName,
  //           serviceIdentifier: this.channelData.serviceIdentifier,
  //           channelMode: this.channelData.channelConfig.channelMode,
  //           responseSLA: this.channelData.channelConfig.responseSLA,
  //           customerActivityTimeout: this.channelData.channelConfig.customerActivityTimeout,
  //           botId: this.channelData.channelConfig.botId,
  //           channelConnector: this.channelConnectorList[connectorIndex],
  //         });
  //       }
  //     },
  //     error => {
  //       this.spinner = false;
  //       console.log("Error fetching:", error);
  //       if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
  //     });
  // }

  //to create 'data' object and pass it to the parent component
  onSave() {

    let channelConfigData = {
      // botId: this.channelSettingForm.value.botId,
      // channelMode: this.channelSettingForm.value.channelMode,
      // conversationBot: "",
      // customerActivityTimeout: this.channelSettingForm.value.customerActivityTimeout,
      // customerIdentificationCriteria: {},
      // responseSLA: this.channelSettingForm.value.responseSLA,
      // routingPolicy: {},
    };

    let data: any = {
      // channelName: this.channelSettingForm.value.channelName,
      // serviceIdentifier: this.channelSettingForm.value.serviceIdentifier,
      // channelConnector: this.channelSettingForm.value.channelConnector,
      // tenant: {},
      // channelConfig: channelConfigData,
    }
    if (this.botData) data.id = this.botData.id;
    this.formSaveData.emit(data);
    this.botSettingForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childBotBool.emit(!this.parentBotBool);
    this.botSettingForm.reset();
  }

}
