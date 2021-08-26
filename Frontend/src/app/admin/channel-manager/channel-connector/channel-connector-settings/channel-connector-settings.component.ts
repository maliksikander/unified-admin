import {
  Component,
  EventEmitter,
  Input,
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
import { CommonService } from "src/app/admin/services/common.service";
import { EndpointService } from "src/app/admin/services/endpoint.service";
import { SnackbarService } from "src/app/admin/services/snackbar.service";

@Component({
  selector: "app-channel-connector-settings",
  templateUrl: "./channel-connector-settings.component.html",
  styleUrls: ["./channel-connector-settings.component.scss"],
})
export class ChannelConnectorSettingsComponent implements OnInit {
  @Input() parentChannelBool;
  @Input() channelTypeData;
  @Input() connectorData;
  @Output() formCancelEvent = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  spinner = true;
  channelConnectorForm: FormGroup;
  formErrors: any = {
    channelConnectorName: "",
    interface: "",
    interfaceAddress: "",
  };
  validations;
  interfaceList = ["JMS", "REST"];
  formSchema;
  formValidation;
  // reqEndpoint = 'channel-connectors';

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.connectorFormErrorMessages;

    this.channelConnectorForm = this.formBuilder.group({
      channelConnectorName: ["", [Validators.required]],
      interface: ["", [Validators.required]],
      interfaceAddress: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /((([A-Za-z]{2,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
          ),
        ],
      ],
    });

    this.getFormValidation();

    //setting up error messages on form validation failures
    this.channelConnectorForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.channelConnectorForm,
        this.formErrors,
        this.validations
      );
    });

    // console.log("channel type==>", this.channelTypeData);
  }

  //lifecycle to update all '@input' changes from parent component
  ngOnChanges(changes: SimpleChanges) {}

  // to assign form schema from channel type data to local variable
  assignFormSchema(data) {
    this.formSchema = data;
    if (this.formSchema && this.formSchema != null) {
      this.addFormControls(
        JSON.parse(JSON.stringify(this.formSchema?.attributes))
      );
      if (this.connectorData) {
        this.patchFormValues(this.connectorData, this.formSchema?.attributes);
      }
    }
    this.spinner = false;
  }

  //calling forms endpoint to fetch forms schema
  getFormSchema() {
    const id = this.channelTypeData.channelConfigSchema;

    //calling endpoint service method to get forms schema, it accepts form id as `id` as parameter
    this.endPointService.getFormByID(id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.formSchema = res;
        this.addFormControls(
          JSON.parse(JSON.stringify(this.formSchema?.attributes))
        );
        if (this.connectorData) {
          this.patchFormValues(this.connectorData, this.formSchema?.attributes);
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //calling forms validaition endpoint to fetch form validation definitions
  getFormValidation() {
    //calling endpoint service method to get forms validations
    this.endPointService.getFormValidation().subscribe(
      (res: any) => {
        let temp = JSON.parse(JSON.stringify(res));
        this.formValidation = this.convertArrayToObject(temp, "type");
        this.assignFormSchema(this.channelTypeData.channelConfigSchema);
        // this.getFormSchema();
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // adding forms controls to existing form group using attributes in from schema as `attrSchema` parameter
  addFormControls(attrSchema: Array<any>) {
    attrSchema.forEach((item) => {
      let validatorArray: any = this.addFormValidations(item);
      this.addFormErrorMsg(item);
      this.channelConnectorForm.addControl(
        item.key,
        new FormControl(item.valueType == "Boolean" ? true : "", validatorArray)
      );
    });
    //  console.log("channel conenctor form==>",this.channelC)
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

  // patching existing values to form for editing, using channel connector data from parent as `connectorData` parameter
  patchFormValues(connectorData, attrSchema) {
    let patchData: any = {
      channelConnectorName: this.connectorData.channelConnectorName,
      interface: this.connectorData.channelConnectorInterface,
      interfaceAddress: this.connectorData.interfaceAddress,
    };
    connectorData.channelConnectorData?.attributes.forEach((item) => {
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
    this.channelConnectorForm.patchValue(patchData);
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
          // console.log("==>", categories[i].values[j])

          // if (Array.isArray(item.value)) {
          //   // console.log("2==>", item.value.length)
          //   if (item.value.length > 1) {

          //     for (let k = 0; k < item.value.length; k++) {
          //       if (categories[i].values[j] == item.value[k]) {
          //         result.push(item.value[k])

          //       }
          //     }
          //     console.log("result==>", result);
          //     temp = result;
          //     break;
          //   }
          //   // else {
          //   //
          //   // }
          // }
          // else {
          if (categories[i].values[j] == item.value) {
            temp = item.value;
            break;
            // }
          }
          temp = null;
        }
        if (temp != undefined || temp != null) break;
      }
    }
    // console.log("temp==>", temp);
    return temp;
  }

  multiSelectValues(categories, item) {
    // let temp;
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

  //creating request body
  createRequestPayload() {
    let formData = this.createAndSetupFormDataObject();
    let data: any = {
      channelConnectorName:
        this.channelConnectorForm.value.channelConnectorName,
      channelConnectorInterface: this.channelConnectorForm.value.interface,
      interfaceAddress: this.channelConnectorForm.value.interfaceAddress,
      channelType: { id: this.channelTypeData.id },
      channelConnectorData: formData,
      tenant: {},
    };
    return data;
  }

  //create form data object
  createAndSetupFormDataObject() {
    // form data object declaration and initialization
    let data: any = {
      formID: "",
      filledBy: "",
      attributes: [],
    };
    let filledValues: any = this.removeStaticFormAttributes();

    //setting form Data values
    let user = localStorage.getItem("username")
      ? localStorage.getItem("username")
      : sessionStorage.getItem("username");
    data.formID = this.formSchema.id;
    data.filledBy = user;
    if (!this.connectorData) data.createdOn = new Date().toISOString();
    data.attributes = this.createFormDataAttributes(filledValues);
    return data;
  }

  //getting filled form values and converting variable to array of objects
  removeStaticFormAttributes() {
    let filledAttributes: any = JSON.parse(
      JSON.stringify(this.channelConnectorForm.value)
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

  //to cancel form editing
  onClose() {
    this.formCancelEvent.emit();
    this.channelConnectorForm.reset();
  }

  // to reset form and pass event to parent component
  resetForm(msg) {
    this.formSaveData.emit(msg);
    this.channelConnectorForm.reset();
  }

  // save callback function
  onSave() {
    this.spinner = true;
    let data: any = this.createRequestPayload();
    if (this.connectorData) {
      data.id = this.connectorData.id;
      this.updateChannelConnector(data);
    } else {
      this.createChannelConnector(data);
    }
  }

  //to create channel connector and it accepts `data` object as parameter containing channel connector properties
  createChannelConnector(data) {
    //calling endpoint service method which accepts resource name as 'connectorServiceReq' and `data` object as parameter
    this.endPointService.createConnector(data).subscribe(
      (res: any) => {
        this.spinner = false;
        this.resetForm("Created");
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update channel connector and it accepts `data` object as parameter containing channel connector properties
  updateChannelConnector(data) {
    //calling endpoint service method which accepts resource name as 'connectorServiceReq' and `data` object as parameter
    this.endPointService.updateConnector(data, data.id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.resetForm("Updated");
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }
}
