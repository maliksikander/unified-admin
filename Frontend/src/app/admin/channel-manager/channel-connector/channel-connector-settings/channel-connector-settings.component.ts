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
  formErrors: any = {
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

    this.getFormValidation();

    //setting up error messages on form validation failures
    this.channelConnectorForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.channelConnectorForm, this.formErrors, this.validations);
    });

  }

  //lifecycle to update all 'input' changes from parent component
  ngOnChanges(changes: SimpleChanges) { }

  getFormSchema() {
    const id = this.channelTypeData.channelConfigSchema

    //calling endpoint service method to get forms schema, it accepts form id as `id` as parameter
    this.endPointService.getFormByID(id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.formSchema = res;
        this.addFormControls(JSON.parse(JSON.stringify(this.formSchema?.attributes)));
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  getFormValidation() {

    //calling endpoint service method to get forms validations
    this.endPointService.getFormValidation().subscribe(
      (res: any) => {
        let temp = JSON.parse(JSON.stringify(res));
        this.formValidation = this.convertArrayToObject(temp, 'type');
        this.getFormSchema()
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  addFormControls(attrSchema: Array<any>) {

    attrSchema.forEach((item) => {
      let validatorArray: any = this.addFormValidations(item);
      this.addFormErrorMsg(item.key);
      this.channelConnectorForm.addControl(item.key, new FormControl('', validatorArray));
    });
  }

  addFormValidations(item) {
    let temp = [];
    if (item?.isRequired) temp.push(Validators.required);
    if (item.attributeType != "OPTIONS") temp.push(Validators.pattern(this.formValidation[item?.valueType]?.regex));
    return temp;
  }

  addFormErrorMsg(key) {

    let errors = {
      required: 'This field is required',
      pattern: 'Please match the requested format'
    };
    this.validations[key] = {};
    this.formErrors[key] = '';
    this.validations[key] = errors;
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


  //getting filled form values and converting variable to array of objects
  removeStaticFormAttributes() {

    let filledAttributes: any = JSON.parse(JSON.stringify(this.channelConnectorForm.value));
    delete filledAttributes.channelConnectorName;
    delete filledAttributes.interface;
    delete filledAttributes.interfaceAddress;
    filledAttributes = Object.entries(filledAttributes).map((e) => ({ [e[0]]: e[1] }));
    return filledAttributes;
  }

  //creating attributes array by iterating over `form Schema attributes` and `filled form attributes`
  createFormDataAttributes(filledValues) {

    let attrTemp = [];  // temp array variable

    this.formSchema?.attributes.forEach((item) => {
      let obj: any = {};
      filledValues.forEach((val) => {
        let key = Object.keys(val)[0];
        if (key == item.key) {
          obj.key = key;
          obj.type = item.valueType;
          obj.value = Object.values(val)[0];
          attrTemp.push(obj);
        }
      });
    });

    return attrTemp;

  }

  //create form data object 
  createAndSetupFormDataObject() {

    // form data object declaration and initialization
    let data: any = {
      formID: '',
      filledBy: '',
      attributes: [],
    };

    let filledValues: any = this.removeStaticFormAttributes();

    //setting form Data values
    let user = sessionStorage.getItem('username');
    data.formID = this.formSchema.id;
    data.filledBy = user;
    if (!this.connectorData) data.createdOn = new Date();
    data.attributes = this.createFormDataAttributes(filledValues);

    return data;
  }

  //creating request body
  createRequestPayload() {

    let formData = this.createAndSetupFormDataObject();
    let data: any = {
      channelConnectorName: this.channelConnectorForm.value.channelConnectorName,
      interface: this.channelConnectorForm.value.interface,
      interfaceAddress: this.channelConnectorForm.value.interfaceAddress,
      channelType: this.channelTypeData,
      channelConnectorData: formData,
      tenant: {}
    };
    return data;
  }

  onSave() {

    let data: any = this.createRequestPayload();
    if (this.connectorData) data.id = this.connectorData.id;
    console.log("save data--->", data);
    // this.formSaveData.emit(data);
    // this.channelConnectorForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childChannelBool.emit(!this.parentChannelBool);
    this.channelConnectorForm.reset();
  }

}
