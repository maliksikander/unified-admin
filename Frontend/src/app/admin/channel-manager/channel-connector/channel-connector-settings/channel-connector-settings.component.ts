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
    // this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.connectorFormErrorMessages;

    this.channelConnectorForm = this.formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9_-]+(?:\040[a-zA-Z0-9_-]+)*$/),
        ],
      ],
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
    this.endPointService.getFormValidation().subscribe(
      (res: any) => {
        let temp = JSON.parse(JSON.stringify(res));
        this.formValidation = this.convertArrayToObject(temp, "type");
        this.getChannelProvider();
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Fetching Form Validations:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // creating validation definitions for form controls, using provider schema attribute as parameter
  addFormValidations(item) {
    try {
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
    } catch (e) {
      console.error("Error in add validion method :", e);
    }
  }

  // adding form error messages to the local error object, using provider schema attribute key as `key` parameter
  addFormErrorMsg(item) {
    try {
      let errors = {
        required: "This field is required",
        pattern: `Please match the ${item?.valueType} format`,
        max: `Max Value of 2147483647 is allowed`,
        min: `Min Value of -2147483647 is allowed`,
      };
      this.validations[item.key] = {};
      this.formErrors[item.key] = "";
      this.validations[item.key] = errors;
    } catch (e) {
      console.error("Error in form error message :", e);
    }
  }

  //to check and match attribute schema
  getAttrSchema(attrList, key) {
    try {
      let result;
      attrList.forEach((item) => {
        if (item.key == key) {
          result = item;
        }
      });
      return result;
    } catch (e) {
      console.error("Error in match schema method :", e);
    }
  }

  // patch existing values to form controls for editing
  patchFormValues() {
    try {
      let providerIndex = this.channelProviderList.findIndex(
        (item) => item.id == this.connectorData.channelProviderInterface.id
      );
      this.formSchema =
        providerIndex != -1
          ? this.channelProviderList[providerIndex]?.channelProviderConfigSchema
          : [];

      this.addFormControls(this.formSchema);
      let patchData: any = {
        name: this.connectorData.name,
        channelProviderInterface: this.channelProviderList[providerIndex],
      };

      this.connectorData?.channelProviderConfigs?.forEach((item) => {
        patchData[item.key] = item.value;

        let attr = this.formSchema.filter((val) => val.key == item.key);
        attr = attr[0];
      });
      this.channelConnectorForm.patchValue(patchData);
    } catch (e) {
      console.error("Connector Patching Error :", e);
    }
    this.spinner = false;
  }

  // to convert an array of objects to an object of objects
  convertArrayToObject(array, key) {
    try {
      const initialValue = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item,
        };
      }, initialValue);
    } catch (e) {
      console.error("Error in converting array to object method :", e);
    }
  }

  //creating request body
  createRequestPayload() {
    try {
      let formData = this.createAndSetupFilledObject();
      let data: any = {
        name: this.channelConnectorForm.value.name,
        channelProviderInterface: {
          id: this.channelConnectorForm.value.channelProviderInterface.id,
        },
        channelProviderConfigs: formData,
        tenant: {},
      };
      return data;
    } catch (e) {
      console.error("Error in create request payload :", e);
    }
  }

  //create form data object
  createAndSetupFilledObject() {
    try {
      let data: Array<any> = [];
      let filledValues: any = this.removeStaticFormAttributes();
      data = this.createDataAttributes(filledValues); //setting form Data values
      return data;
    } catch (e) {
      console.error("Error in data object :", e);
    }
  }

  //getting filled form values and converting variable to array of objects
  removeStaticFormAttributes() {
    try {
      let filledAttributes: any = JSON.parse(
        JSON.stringify(this.channelConnectorForm.value)
      );
      delete filledAttributes.name;
      delete filledAttributes.channelProviderInterface;
      filledAttributes = Object.entries(filledAttributes).map((e) => ({
        [e[0]]: e[1],
      }));
      return filledAttributes;
    } catch (e) {
      console.error("Error in remove static attribute :", e);
    }
  }

  //creating attributes array by iterating over `form Schema` and `filled form attributes`
  createDataAttributes(filledValues) {
    try {
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
    } catch (e) {
      console.error("Error in create data :", e);
    }
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
    this.endPointService.createConnector(data).subscribe(
      (res: any) => {
        this.spinner = false;
        this.resetForm("Created");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Creating Connector:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update channel connector and it accepts `data` object as parameter containing channel connector properties
  updateChannelConnector(data) {
    this.endPointService.updateConnector(data, data.id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.resetForm("Updated");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Updating Connector:", error);
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
        console.error("Error Fetching Provide List :", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // callback for form schema selection change event
  onProviderSelection(selectedVal) {
    this.formSchema = selectedVal?.channelProviderConfigSchema;
    this.removeFormControls();
    this.addFormControls(selectedVal?.channelProviderConfigSchema);
  }

  //to remove static form controls, to get the dynamically added form attributes from provider schema
  removeFormControls() {
    try {
      let controls: Object = this.channelConnectorForm?.controls;
      let controlArray: Array<any> = Object.keys(controls);
      let constantFormControls = ["name", "channelProviderInterface"];
      controlArray.forEach((item) => {
        if (!constantFormControls.includes(item)) {
          this.channelConnectorForm.removeControl(item);
        }
      });
    } catch (e) {
      console.error("Error in remove form control :", e);
    }
  }

  // adding forms controls to existing form group using attributes in from schema as `attrSchema` parameter
  addFormControls(attrSchema: Array<any>) {
    try {
      attrSchema.forEach((item) => {
        let validatorArray: any = this.addFormValidations(item);
        this.addFormErrorMsg(item);
        this.channelConnectorForm.addControl(
          item.key,
          new FormControl(
            item.valueType == "Boolean" ? true : "",
            validatorArray
          )
        );
      });
    } catch (e) {
      console.error("Error in add form control :", e);
    }
  }

  //  to assign form schema from channel type data to local variable
  // assignFormSchema(data) {
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
  // }

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
