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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
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
  formsList: [];
  formSchema;
  formValidation;

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
      formSchema: ["none"],
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
        console.error("Error fetching:", error);
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
        console.error("Error fetching:", error);
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
        // this.getForms();
        this.getFormValidation();
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get form list and set the local variable with the response
  getForms() {
    this.endPointService.getForm().subscribe(
      (res: any) => {
        // this.spinner = false;
        if (res.length == 0)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "NO FORM DATA FOUND",
            2
          );
        this.formsList = res;
        if (
          this.queueList?.length > 0 &&
          this.channelConnectorList?.length > 0 &&
          this.channelData &&
          this.formsList?.length > 0
        ) {
          this.patchFormValues();
        } else {
          this.spinner = false;
        }
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
      }
    );
  }

  // patch form values to edit current values
  patchFormValues() {
    let routingIndex;
    let formSchemaIndex;
    if (this.channelData?.additionalConfig === null) {
      formSchemaIndex = -1;
    } else {
      formSchemaIndex = this.formsList.findIndex(
        (item: any) => item.id == this.channelData?.additionalConfig.formId
      );
      if (formSchemaIndex != -1) {
        let selectedSchema: any = this.formsList[formSchemaIndex];
        this.assignFormSchema(selectedSchema);
        this.patchFormDataValues(
          this.channelData?.additionalConfig,
          selectedSchema?.attributes
        );
      }
    }

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
      formSchema:
        formSchemaIndex != -1 ? this.formsList[formSchemaIndex] : "none",
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
    this.spinner = true;
    let data = this.createRequestPayload();
    if (data.id) {
      this.updateChannel(data);
    } else {
      this.createChannel(data);
    }
  }

  // to send event msg and reset form after success response
  emitMsgAndResetForm(status) {
    let msg = `${status} Successfully`;
    this.formSaveData.emit(msg);
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

  //calling forms validaition endpoint to fetch form validation definitions
  getFormValidation() {
    //calling endpoint service method to get forms validations
    this.endPointService.getFormValidation().subscribe(
      (res: any) => {
        let temp = JSON.parse(JSON.stringify(res));
        this.formValidation = this.convertArrayToObject(temp, "type");
        // this.assignFormSchema(this.channelTypeData.channelConfigSchema);
        this.getForms();
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // callback for form schema selection change event
  onFormSchemaSelection(selectedValue) {
    this.removeFormControls();
    if (selectedValue != "none") {
      this.assignFormSchema(selectedValue);
    } else {
      this.channelSettingForm.controls["formSchema"].setValue("none");
      this.formSchema = undefined;
    }
  }

  // to add form controls according to the selected form schema, it expects form schema as `data` paramter
  assignFormSchema(data) {
    this.formSchema = data;
    if (this.formSchema && this.formSchema != null) {
      this.addFormControls(
        JSON.parse(JSON.stringify(this.formSchema?.attributes))
      );
      // if (this.channelData) {
      // this.patchFormValues(this.channelData, this.formSchema?.attributes);
      // }
    }
    this.spinner = false;
  }

  // to remove form controls on value change od form schema
  removeFormControls() {
    let controls: Object = this.channelSettingForm?.controls;
    let controlArray: Array<any> = Object.keys(controls);
    let constantFormControls = [
      "channelName",
      "serviceIdentifier",
      "channelConnector",
      "channelMode",
      "responseSla",
      "customerActivityTimeout",
      "agentSelectionPolicy",
      "routeToLastAgent",
      "routingMode",
      "routingObjectID",
      "agentRequestTTL",
      "botID",
      "formSchema",
    ];
    controlArray.forEach((item) => {
      if (!constantFormControls.includes(item)) {
        this.channelSettingForm.removeControl(item);
      }
    });
  }

  // adding forms controls to existing form group using attributes in from schema as `attrSchema` parameter
  addFormControls(attrSchema: Array<any>) {
    attrSchema.forEach((item) => {
      let validatorArray: any = this.addFormValidations(item);
      this.addFormErrorMsg(item);
      this.channelSettingForm.addControl(
        item.key,
        new FormControl(item.valueType == "Boolean" ? true : "", validatorArray)
      );
    });
  }

  // creating validation definitions for form controls, using form schema attribute as parameter
  addFormValidations(item) {
    let temp = [];
    if (item?.isRequired) temp.push(Validators.required);
    if (item.attributeType != "OPTIONS")
      temp.push(
        Validators.pattern(this.formValidation[item?.valueType]?.regex)
      );
    return temp;
  }

  // adding form error messages to the local error object, using attribute key as `key` parameter
  addFormErrorMsg(item) {
    let errors = {
      required: "This field is required",
      pattern: `Please match the ${item?.valueType} format`,
    };
    this.validations[item.key] = {};
    this.formErrors[item.key] = "";
    this.validations[item.key] = errors;
  }

  getAttrSchema(attrList, key) {
    let result;
    attrList.forEach((item) => {
      if (item.key == key) {
        result = item;
      }
    });
    return result;
  }

  // to check if the selected value exists in the form schema options, it uses the form schema attribute as `attr` and connector form data value as `item` parameters
  checkValueExistenceInOptions(attr, item) {
    let temp;
    let categories = attr?.categoryOptions?.categories;
    if (Array.isArray(item.value)) {
      if (item.value.length > 1) {
        temp = this.multiSelectValues(categories, item);
      } else {
        for (let i = 0; i < categories.length; i++) {
          for (let j = 0; j < categories[i].values.length; j++) {
            if (categories[i].values[j] == item.value) {
              temp = item.value;
              break;
            }
            temp = null;
          }
          if (temp != undefined || temp != null) break;
        }
      }
    } else {
      for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < categories[i].values.length; j++) {
          if (categories[i].values[j] == item.value) {
            temp = item.value;
            break;
          }
          temp = null;
        }
        if (temp != undefined || temp != null) break;
      }
    }
    return temp;
  }

  multiSelectValues(categories, item) {
    let result = [];
    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].values.length; j++) {
        for (let k = 0; k < item.value.length; k++) {
          if (categories[i].values[j] == item.value[k]) {
            if (result.includes(item.value[k])) {
            } else {
              result.push(item.value[k]);
            }
          }
          // if (result.length == 0) return null;

          // break;
        }
      }
    }
    // console.log("result==>", result);
    return result;
  }

  // to convert an array of objects to an object of objects
  convertArrayToObject(array, key) {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  }

  //create form data object
  createAndSetupFormDataObject() {
    // form data object declaration and initialization
    let data: any = {
      formId: "",
      filledBy: "",
      attributes: [],
      // createdOn: new Date().toISOString(),
    };
    let filledValues: any = this.removeStaticFormAttributes();

    //setting form Data values
    let user = localStorage.getItem("username")
      ? localStorage.getItem("username")
      : sessionStorage.getItem("username");
    data.formId = this.formSchema.id;
    data.filledBy = user;
    if (!this.channelData) {
      data.createdOn = new Date().toISOString();
    } else {
      data.createdOn = this.channelData?.additionalConfig?.createdOn;
    }
    data.attributes = this.createFormDataAttributes(filledValues);
    return data;
  }

  removeStaticFormAttributes() {
    let filledAttributes: any = JSON.parse(
      JSON.stringify(this.channelSettingForm.value)
    );
    delete filledAttributes.channelConnectorName;
    delete filledAttributes.interface;
    delete filledAttributes.interfaceAddress;
    filledAttributes = Object.entries(filledAttributes).map((e) => ({
      [e[0]]: e[1],
    }));
    return filledAttributes;
  }

  //creating attributes array by iterating over `form Schema attributes` and `filled form attributes`
  createFormDataAttributes(filledValues) {
    let attrTemp = []; // temp array variable

    this.formSchema?.attributes.forEach((item) => {
      let obj: any = {};
      filledValues.forEach((val) => {
        let key = Object.keys(val)[0];
        if (key == item.key) {
          obj.key = key;
          obj.type = item.valueType;
          obj.value = Object.values(val)[0];
          if (obj.type == "Boolean" || obj.type == "StringList")
            obj.value = JSON.stringify(obj.value);
          attrTemp.push(obj);
        }
      });
    });
    return attrTemp;
  }

  // patching existing values to form for editing, using channel connector data from parent as `connectorData` parameter
  patchFormDataValues(formData, attrSchema) {
    let patchData: any = {};
    formData?.attributes.forEach((item) => {
      let schema = this.getAttrSchema(attrSchema, item.key);
      patchData[item.key] = item.value;
      let attr = this.formSchema?.attributes.filter(
        (val) => val.key == item.key
      );
      attr = attr[0];
      if (attr?.attributeType == "OPTIONS") {
        if (item.value.includes("[")) {
          if (schema?.categoryOptions.isMultipleChoice == false) {
            item.value = null;
          } else {
            item.value = JSON.parse(item.value);
          }
        } else {
          if (schema?.categoryOptions.isMultipleChoice == true) {
            let parsedVal = [];
            parsedVal.push(JSON.parse(item.value));
            item.value = parsedVal;
          } else {
            item.value = JSON.parse(item.value);
          }
        }
        patchData[item.key] = this.checkValueExistenceInOptions(attr, item);
      }
    });
    this.channelSettingForm.patchValue(patchData);
  }

  // create request payload and return data object
  createRequestPayload() {
    let formData;
    if (this.channelSettingForm.value.formSchema != "none") {
      formData = this.createAndSetupFormDataObject();
    }
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
      additionalConfig: formData ? formData : null,
      channelConfig: channelConfigData,
    };
    if (this.channelData) data.id = this.channelData.id;

    return data;
  }

  //to create channel, it accepts `data` object as parameter containing channel properties
  createChannel(data) {
    //calling endpoint service method which accepts resource name as 'channelServiceReq' and `data` object as parameter
    this.endPointService.createChannel(data).subscribe(
      (res: any) => {
        // this.spinner = false;
        // this.snackbar.snackbarMessage("success-snackbar", "Channel Created", 1);
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
  updateChannel(data) {
    //calling endpoint service method which accepts resource name as 'channelServiceReq' and `data` object as parameter
    this.endPointService.updateChannel(data, data.serviceIdentifier).subscribe(
      (res: any) => {
        // this.spinner = false;
        // this.snackbar.snackbarMessage("success-snackbar", "Updated", 1);
        this.emitMsgAndResetForm("Updated");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }
}
