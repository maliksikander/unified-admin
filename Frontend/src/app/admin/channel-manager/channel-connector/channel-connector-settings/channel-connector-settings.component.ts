import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/admin/services/common.service';
import { EndpointService } from 'src/app/admin/services/endpoint.service';
import { SnackbarService } from 'src/app/admin/services/snackbar.service';

@Component({
  selector: 'app-channel-connector-settings',
  templateUrl: './channel-connector-settings.component.html',
  styleUrls: ['./channel-connector-settings.component.scss']
})
export class ChannelConnectorSettingsComponent implements OnInit {

  @Input() parentChannelBool;
  @Input() channelTypeData;
  @Input() connectorData;
  @Output() childChannelBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  spinner = false;
  channelConnectorForm: FormGroup;
  formErrors = {
    channelConnectorName: '',
    channelWebhook: '',
  };
  validations;

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();

    //setting local form validation messages 
    this.validations = this.commonService.connectorFormErrorMessages;

    this.channelConnectorForm = this.formBuilder.group({
      channelConnectorName: ['', [Validators.required]],
      channelWebhook: ['', [Validators.required]],
    });

    if (this.connectorData) {
      this.channelConnectorForm.patchValue({
        channelConnectorName: this.connectorData.channelConnectorName,
        channelWebhook: this.connectorData.channelWebhook,
        webhookUrl: `${this.connectorData.channelWebhook}/channel-connectors/webhook`,
        healthUrl: `${this.connectorData.channelWebhook}/channel-connectors/health`
      });
    }

    //checking for channel connector form validation failures
    this.channelConnectorForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.channelConnectorForm, this.formErrors, this.validations);
    });
  }

  //lifecycle to update all 'input' changes from parent component
  ngOnChanges(changes: SimpleChanges) { }


  onSave() {

    let data: any = {
      channelConnectorName: this.channelConnectorForm.value.channelConnectorName,
      channelWebhook: this.channelConnectorForm.value.channelWebhook,
      type: this.channelTypeData
    }
    if (this.connectorData) data.id = this.connectorData.id;
    this.formSaveData.emit(data);
    this.channelConnectorForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childChannelBool.emit(!this.parentChannelBool);
    this.channelConnectorForm.reset();
  }

}
