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
  @Input() connectorData;
  @Output() formCancelEvent = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  spinner = true;
  channelConnectorForm: FormGroup;
  formErrors: any = {
    name: "",
    channelProviderInterface: "",
  };
  validations;
  // interfaceList = ["JMS", "REST"];
  formSchema;
  formValidation;
  channelProviderList = [];

  constructor(
    private commonService: CommonService,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.connectorFormErrorMessages;

    this.channelConnectorForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      channelProviderInterface: ["", [Validators.required]],
    });

    //setting up error messages on form validation failures
    this.channelConnectorForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.channelConnectorForm,
        this.formErrors,
        this.validations
      );
    });

    this.getFormValidation();
  }

  //lifecycle to update all '@input' changes from parent component
  ngOnChanges(changes: SimpleChanges) {}

  //calling forms validaition endpoint to fetch form validation definitions
  getFormValidation() {
    //calling endpoint service method to get forms validations
    this.endPointService.getFormValidation().subscribe(
      (res: any) => {
        let temp = JSON.parse(JSON.stringify(res));
        this.formValidation = this.convertArrayToObject(temp, "type");
        this.getChannelProvider();
        // this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // creating validation definitions for form controls, using form schema attribute as parameter
  addFormValidations(item) {
    let temp = [];
    let maxVal = 2147483647;
    let minVal = -2147483647;
    if (item?.isRequired) temp.push(Validators.required);
    if (item.attributeType != "OPTIONS") {
      temp.push(
        Validators.pattern(this.formValidation[item?.valueType]?.regex)
      );
      if (item.valueType == "Number") {
        temp.push(Validators.max(maxVal));
        temp.push(Validators.min(minVal));
      }
      if (item.valueType == "PositiveNumber") {
        temp.push(Validators.max(maxVal));
      }
    }
    return temp;
  }

  // adding form error messages to the local error object, using attribute key as `key` parameter
  addFormErrorMsg(item) {
    let errors = {
      required: "This field is required",
      pattern: `Please match the ${item?.valueType} format`,
      max: `Max Value of 2147483647 is allowed`,
      min: `Min Value of -2147483647 is allowed`,
    };
    this.validations[item.key] = {};
    this.formErrors[item.key] = "";
    this.validations[item.key] = errors;
  }

  getAttrSchema(attrList, key) {
    let result;
    // console.log("attrList==>",attrList)
    // console.log("key==>",key)
    attrList.forEach((item) => {
      if (item.key == key) {
        result = item;
      }
    });
    // console.log("resukt==>",result)
    return result;
  }

  // patching existing values to form for editing,
  patchFormValues() {
    try {
      // console.log("editData==>", this.connectorData);
      let providerIndex = this.channelProviderList.findIndex(
        (item) => item.id == this.connectorData.channelProviderInterface.id
      );

      this.formSchema =
        providerIndex != -1
          ? this.channelProviderList[providerIndex]?.channelProviderConfigSchema
          : [];

      this.addFormControls(this.formSchema);
      // console.log("index==>", providerIndex);
      let patchData: any = {
        name: this.connectorData.name,
        channelProviderInterface: this.channelProviderList[providerIndex],
      };

      this.connectorData?.channelProviderConfigs?.forEach((item) => {
        // let schema = this.getAttrSchema(this.formSchema, item.key);
        // console.log("schema==>", schema);
        patchData[item.key] = item.value;

        let attr = this.formSchema.filter((val) => val.key == item.key);
        attr = attr[0];
      });
      // console.log("patchDAta==>", patchData);
      this.channelConnectorForm.patchValue(patchData);
    } catch (e) {
      console.error("Connector Patching Error=>", e);
    }
    this.spinner = false;
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
      name: this.channelConnectorForm.value.name,
      channelProviderInterface: {
        id: this.channelConnectorForm.value.channelProviderInterface.id,
      },
      channelProviderConfigs: formData,
      tenant: {},
    };
    return data;
  }

  //create form data object
  createAndSetupFormDataObject() {
    // form data object declaration and initialization
    let data: Array<any> = [];
    let filledValues: any = this.removeStaticFormAttributes();

    data = this.createFormDataAttributes(filledValues); //setting form Data values
    return data;
  }

  //getting filled form values and converting variable to array of objects
  removeStaticFormAttributes() {
    let filledAttributes: any = JSON.parse(
      JSON.stringify(this.channelConnectorForm.value)
    );
    delete filledAttributes.name;
    delete filledAttributes.channelProviderInterface;
    filledAttributes = Object.entries(filledAttributes).map((e) => ({
      [e[0]]: e[1],
    }));
    return filledAttributes;
  }

  //creating attributes array by iterating over `form Schema` and `filled form attributes`
  createFormDataAttributes(filledValues) {
    let attrTemp = []; // temp array variable

    this.formSchema.forEach((item) => {
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
    // this.spinner = true;
    let data: any = this.createRequestPayload();
    if (this.connectorData) {
      data.id = this.connectorData.id;
      // this.updateChannelConnector(data);
    } else {
      // this.createChannelConnector(data);
    }
    console.log("data==>", data);
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
        console.error("Error fetching:", error);
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
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // to fetch channel provider list
  getChannelProvider() {
    this.endPointService.getChannelProvider().subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelProviderList = res;
        if (this.connectorData) {
          this.patchFormValues();
        }
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // callback for form schema selection change event
  onProviderSelection(selectedVal) {
    this.formSchema = selectedVal?.channelProviderConfigSchema;
    // console.log("selectedValue==>", this.formSchema);

    this.removeFormControls();
    this.addFormControls(selectedVal?.channelProviderConfigSchema);
  }

  removeFormControls() {
    let controls: Object = this.channelConnectorForm?.controls;
    let controlArray: Array<any> = Object.keys(controls);
    let constantFormControls = ["name", "channelProviderInterface"];
    controlArray.forEach((item) => {
      if (!constantFormControls.includes(item)) {
        this.channelConnectorForm.removeControl(item);
      }
    });
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
  }

  //  to assign form schema from channel type data to local variable
  assignFormSchema(data) {
    // this.formSchema = data;
    // if (this.formSchema && this.formSchema != null) {
    //   this.addFormControls(
    //     JSON.parse(JSON.stringify(this.formSchema?.attributes))
    //   );
    //   if (this.connectorData) {
    //     this.patchFormValues(this.connectorData, this.formSchema?.attributes);
    //   }
    // }
    // this.spinner = false;
  }

  // to check if the selected value exists in the form schema options, it uses the form schema attribute as `attr` and connector form data value as `item` parameters
  // checkValueExistenceInOptions(attr, item) {
  //   let temp;
  //   let categories = attr?.categoryOptions?.categories;
  //   if (Array.isArray(item.value)) {
  //     if (item.value.length > 1) {
  //       temp = this.multiSelectValues(categories, item);
  //     } else {
  //       for (let i = 0; i < categories.length; i++) {
  //         for (let j = 0; j < categories[i].values.length; j++) {
  //           if (categories[i].values[j] == item.value) {
  //             temp = item.value;
  //             break;
  //           }
  //           temp = null;
  //         }
  //         if (temp != undefined || temp != null) break;
  //       }
  //     }
  //   } else {
  //     for (let i = 0; i < categories.length; i++) {
  //       for (let j = 0; j < categories[i].values.length; j++) {
  //         // console.log("==>", categories[i].values[j])

  //         // if (Array.isArray(item.value)) {
  //         //   // console.log("2==>", item.value.length)
  //         //   if (item.value.length > 1) {

  //         //     for (let k = 0; k < item.value.length; k++) {
  //         //       if (categories[i].values[j] == item.value[k]) {
  //         //         result.push(item.value[k])

  //         //       }
  //         //     }
  //         //     console.log("result==>", result);
  //         //     temp = result;
  //         //     break;
  //         //   }
  //         //   // else {
  //         //   //
  //         //   // }
  //         // }
  //         // else {
  //         if (categories[i].values[j] == item.value) {
  //           temp = item.value;
  //           break;
  //           // }
  //         }
  //         temp = null;
  //       }
  //       if (temp != undefined || temp != null) break;
  //     }
  //   }
  //   // console.log("temp==>", temp);
  //   return temp;
  // }

  // multiSelectValues(categories, item) {
  //   // let temp;
  //   let result = [];
  //   for (let i = 0; i < categories.length; i++) {
  //     for (let j = 0; j < categories[i].values.length; j++) {
  //       for (let k = 0; k < item.value.length; k++) {
  //         if (categories[i].values[j] == item.value[k]) {
  //           if (result.includes(item.value[k])) {
  //           } else {
  //             result.push(item.value[k]);
  //           }
  //         }
  //         // if (result.length == 0) return null;

  //         // break;
  //       }
  //     }
  //   }
  //   // console.log("result==>", result);
  //   return result;
  // }
}
