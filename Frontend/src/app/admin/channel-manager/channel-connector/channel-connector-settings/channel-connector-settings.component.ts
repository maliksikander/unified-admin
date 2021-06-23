import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  spinner = true;
  channelConnectorForm: FormGroup;
  formErrors = {
    channelConnectorName: '',
    interface: '',
    interfaceAddress: '',
  };
  validations;
  interfaceList = ["JMS", "REST"];
  formSchema;
  formValidation;

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
      interface: ['', [Validators.required]],
      interfaceAddress: ['', [Validators.required]],
    });

    // if (this.connectorData) {
    //   this.channelConnectorForm.patchValue({
    //     channelConnectorName: this.connectorData.channelConnectorName,
    //     interface: this.connectorData.interface,
    //     interfaceAddress: this.connectorData.interfaceAddress,
    //     webhookUrl: `${this.connectorData.interfaceAddress}/channel-connectors/webhook`,
    //     healthUrl: `${this.connectorData.interfaceAddress}/channel-connectors/health`
    //   });
    // }

    //checking for channel connector form validation failures
    this.channelConnectorForm.valueChanges.subscribe((data) => {
      console.log("form value==>", this.channelConnectorForm)
      // this.commonService.logValidationErrors(this.channelConnectorForm, this.formErrors, this.validations);
    });

    // this.getFormSchema();
    this.getFormValidation();

  }

  //lifecycle to update all 'input' changes from parent component
  ngOnChanges(changes: SimpleChanges) { }




  getFormSchema() {

    // console.log("channel type data-->", this.channelTypeData)
    const id = this.channelTypeData.channelConfigSchema

    //calling endpoint service method to get forms schema, it accepts form id as `id` as parameter
    this.endPointService.getFormByID(id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.formSchema = res;
        // this.getFormValidation();
        console.log("schema==>", this.formSchema);
        this.addFormControls(JSON.parse(JSON.stringify(this.formSchema?.attributes)));
        // this.channelConnectors = res;
        // this.getConnectorStatus(this.channelConnectors);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  addFormControls(attrSchema: Array<any>) {
    attrSchema.forEach((item) => {
      let validatorArray: any = [];
      if (item?.isRequired) validatorArray.push(Validators.required);
      console.log("==>",this.formValidation[item?.valueType]?.regex);
      if (item.attributeType != "OPTIONS") validatorArray.push(Validators.pattern(this.formValidation[item?.valueType]?.regex));
      console.log("validators==>", validatorArray);
      this.channelConnectorForm.addControl(item.key, new FormControl('', validatorArray));

    });

    // console.log("form-->", this.channelConnectorForm.controls);
  }



  convertArrayToObject(array, key) {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  getFormValidation() {

    // console.log("channel type data-->", this.channelTypeData)
    // const id = this.channelTypeData.channelConfigSchema

    //calling endpoint service method to get forms schema, it accepts form id as `id` as parameter
    this.endPointService.getFormValidation().subscribe(
      (res: any) => {
        // this.spinner = false;
        // console.log("res==>", res);
        // this.formValidation = res;
        let temp = JSON.parse(JSON.stringify(res));
        this.formValidation = this.convertArrayToObject(temp, 'type');
        console.log("val==>", this.formValidation);
        this.getFormSchema()
        // this.addFormControls(this.formSchema?.attributes)
        // this.addFormControls(this.formSchema?.attributes)
        // this.channelConnectors = res;
        // this.getConnectorStatus(this.channelConnectors);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  onSave() {

    let data: any = {
      channelConnectorName: this.channelConnectorForm.value.channelConnectorName,
      interface: this.channelConnectorForm.value.interface,
      interfaceAddress: this.channelConnectorForm.value.interfaceAddress,
      channelType: this.channelTypeData,
      tenant: {}
    }
    if (this.connectorData) data.id = this.connectorData.id;

    console.log("save data--->", this.channelConnectorForm.value);
    // this.formSaveData.emit(data);
    // this.channelConnectorForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childChannelBool.emit(!this.parentChannelBool);
    this.channelConnectorForm.reset();
  }

}
