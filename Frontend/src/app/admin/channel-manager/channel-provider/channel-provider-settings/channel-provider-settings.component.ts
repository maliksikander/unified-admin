import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../../../admin/services/common.service";
import { EndpointService } from "../../../../admin/services/endpoint.service";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-channel-provider-settings",
  templateUrl: "./channel-provider-settings.component.html",
  styleUrls: ["./channel-provider-settings.component.scss"],
})
export class ChannelProviderSettingsComponent implements OnInit {
  @Input() parentBool;
  @Input() editChannelProvider;
  @Output() childBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  customCollapsedHeight: string = "40px";
  expanded: boolean = false;
  channelProviderForm: FormGroup;
  formErrors = {
    name: "",
    supportedChannelTypes: "",
    providerWebhook: "",
    channelProviderConfigSchema: [],
  };
  validations;
  // attributeTypeList = ["INPUT"];
  valueTypeList = [
    "Alphanum100",
    "AlphanumSpecial200",
    "Boolean",
    // "Email",
    // "IP",
    "Number",
    "Password",
    // "PhoneNumber",
    "PositiveNumber",
    "String50",
    "String100",
    "String2000",
    // "StringList",
    "URL",
  ];
  valueTypeDescription = {
    Alphanum100:
      "Supports alphabets, digits and whitespaces up to 100 characters",
    AlphanumSpecial200:
      "Supports alphabets, digits, allowed characters _ ( @ . , ; : ` ~ = * ' % $ ! ^ / # & + ( ) ? { } > & l  ; | - )  up to 200 characters",
    Boolean: "Supports either true, false, 0 ,1 values",
    // "Email",
    // "IP",
    Number: "Positive/Negative numbers are supported",
    Password: "Supports string of min 8 characters and upto 256 characters",
    // "PhoneNumber",
    PositiveNumber: "Supports positive number with/without '+'",
    String50: "Any characters of a maximum of 50 characters",
    String100: "Any characters of a maximum of 100 characters",
    String2000: "Any characters of a maximum of 2000 characters",
    // "StringList",
    URL: "Any generic url string with valid format, allows ports as well e.g. https://www.expertflow.com",
  };
  spinner = true;
  channelTypeList = [];
  checkVoiceChannel: boolean = false;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private endPointService: EndpointService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.channelProviderFormErrorMessages;

    this.channelProviderForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9_-]+(?:\040[a-zA-Z0-9_-]+)*$/),
        ],
      ],
      supportedChannelTypes: ["", [Validators.required]],
      providerWebhook: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
          ),
        ],
      ],
      channelProviderConfigSchema: this.fb.array([]),
    });

    //setting form validation messages
    this.channelProviderForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.channelProviderForm,
        this.formErrors,
        this.validations
      );
    });

    this.getChannelType();
  }

  // to check DOM change manaually
  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {}

  //to get logo/image from file engine, it accepts the file name as parameter and returns the url
  getFileURL(filename) {
    return `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${filename}`;
  }

  //custom attribute form group
  addAttribute(): FormGroup {
    try {
      return this.fb.group({
        attributeType: ["INPUT", [Validators.required]],
        categoryOptions: null,
        helpText: [""],
        isRequired: [true],
        key: ["New_Attribute"],
        label: [
          "New Attribute",
          [Validators.required, RxwebValidators.unique()],
        ],
        valueType: ["String100"],
      });
    } catch (e) {
      console.error("Error in add attribute method :", e);
    }
  }

  //to get provider attribute form array
  getProviderAttribute(form) {
    return form.controls.channelProviderConfigSchema.controls;
  }

  // to add new attribute definition in existing attribute list and assigns a some default values
  addAttributeButton() {
    try {
      (<FormArray>(
        this.channelProviderForm.controls["channelProviderConfigSchema"]
      )).push(this.addAttribute());
      let attr = this.getProviderAttribute(this.channelProviderForm);
      const index = attr.length - 1;
      let control = attr[index];
      control.patchValue({
        label: "New Attribute" + index,
        key: "New_Attribute" + index,
        attributeType: "INPUT",
      });
      this.cd.detectChanges();
    } catch (e) {
      console.error("Error in add attribute btn method :", e);
    }
  }

  // to remove attribute definition from existing attribute list it accepts attribute index as parameter
  removeAttribute(i) {
    try {
      const attribute: any = this.channelProviderForm.get(
        "channelProviderConfigSchema"
      );
      attribute.removeAt(i);
      this.expanded = !this.expanded;
    } catch (e) {
      console.error("Error in remove attribute :", e);
    }
  }

  // get schema form group definition
  get providerAttributes(): FormGroup {
    return this.fb.group({
      attributeType: ["", [Validators.required]],
      categoryOptions: null,
      helpText: [""],
      isRequired: [true],
      key: [""],
      label: ["", [Validators.required]],
      valueType: [""],
    });
  }

  // generate key using user typed attribute label
  attrKeyGenerator(attr: string, i: number) {
    try {
      let key = attr.replace(" ", "_");
      (<FormArray>(
        this.channelProviderForm.controls["channelProviderConfigSchema"]
      ))
        .at(i)
        .get("key")
        .setValue(key);
    } catch (e) {
      console.error("Error in key generator :", e);
    }
  }

  // to copy an existing attribute in a form, it accepts attribute definition to be copied as parameter
  copyAttribute(attribute) {
    try {
      (<FormArray>(
        this.channelProviderForm.controls["channelProviderConfigSchema"]
      )).push(this.addAttribute());
      this.cd.detectChanges();
      let length =
        this.channelProviderForm.value.channelProviderConfigSchema.length; // form attribute list length
      let attr = (<FormArray>(
        this.channelProviderForm.controls["channelProviderConfigSchema"]
      )).at(length - 1);
      attr.patchValue({
        attributeType: attribute.value.attributeType,
        categoryOptions: null,
        helpText: attribute.value.helpText,
        isRequired: attribute.value.isRequired,
        key: "copy_of" + attribute.value.key,
        label: "Copy of" + " " + attribute.value.label,
        valueType: attribute.value.valueType,
      });
    } catch (e) {
      console.error("Error in copy attribute", e);
    }
  }

  // panel expansion/collapse callback
  panelExpanded() {
    this.expanded = !this.expanded;
  }

  drop(event: CdkDragDrop<string[]>) {
    try {
      let d = this.getProviderAttribute(this.channelProviderForm);
      let value = [];
      moveItemInArray(d, event.previousIndex, event.currentIndex);
      d.forEach((item, i) => {
        value.push(item.value);
      });
      this.channelProviderForm.value.attributes = value;
    } catch (e) {
      console.error("Error in drag & drop :", e);
    }
  }

  //to get channel type list
  getChannelType() {
    this.endPointService.getChannelType().subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelTypeList = res;
        if (this.editChannelProvider) this.editOperations();
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Fetching Channel Type:", error);
      }
    );
  }

  onSave() {
    this.spinner = true;
    try {
      let data = this.channelProviderForm.value;

      let channelTypes = data?.supportedChannelTypes;
      let voiceChannelIndex = channelTypes.findIndex(
        (item) => item.name == "VOICE"
      );
      data.providerWebhook =
        voiceChannelIndex != -1
          ? "null"
          : this.channelProviderForm.value.providerWebhook;
      let channelTypeIDArray = [];
      channelTypes?.forEach((item) => {
        let obj = { id: "" };
        obj.id = item.id;
        channelTypeIDArray.push(obj);
      });
      data.supportedChannelTypes = channelTypeIDArray;
      if (this.editChannelProvider) {
        data.id = this.editChannelProvider.id;
        this.updateChannelProvider(data);
      } else {
        this.createChannelProvider(data);
      }
    } catch (e) {
      console.error("Error on save :", e);
    }
  }

  onClose() {
    this.childBool.emit(!this.parentBool);
    this.channelProviderForm.reset();
  }

  // converting received form object to patch values with local form object
  editOperations() {
    try {
      let data = JSON.parse(JSON.stringify(this.editChannelProvider));
      delete data?.id;
      const attrArray = this.channelProviderForm.get(
        "channelProviderConfigSchema"
      ) as FormArray;
      attrArray.clear();
      this.createFormArrays(data);
    } catch (e) {
      console.error("Error in edit ops :", e);
    }
  }

  //create form definitions for attributes according to the object received and set value for editing, it accepts form object as parameter
  createFormArrays(data) {
    try {
      let attribute: Array<any> = data.channelProviderConfigSchema;
      for (let i = 0; i < attribute.length; i++) {
        const attributeArray = this.channelProviderForm.get(
          "channelProviderConfigSchema"
        ) as FormArray;
        attributeArray.push(this.providerAttributes);
      }
      let temp = this.setSelectedChannelTypes(data?.supportedChannelTypes);
      // console.log("temp==>", temp);

      this.channelProviderForm.patchValue(data);
      this.channelProviderForm.controls["supportedChannelTypes"].patchValue(
        temp
      );
      let voiceChannelIndex = temp.findIndex((item) => item.name == "VOICE");
      if (voiceChannelIndex != -1) this.setValueAndHideWebhookField(voiceChannelIndex);
      this.cd.detectChanges();
    } catch (e) {
      console.error("Error in create form array :", e);
    }
  }

  setSelectedChannelTypes(data) {
    try {
      let temp = [];
      this.channelTypeList.forEach((type) => {
        data.forEach((item) => {
          if (type.id == item.id) temp.push(type);
        });
      });
      return temp;
    } catch (e) {
      console.error("Error in setting selected type :", e);
    }
  }

  // to send event msg and reset form after success response
  emitMsgAndResetForm(status) {
    try {
      let msg = `${status} Successfully`;
      this.formSaveData.emit(msg);
      this.channelProviderForm.reset();
    } catch (e) {
      console.error("Type Event Emitter Error :", e);
    }
  }

  //to create channel provider, it accepts `data` object as parameter containing channel provider properties
  createChannelProvider(data) {
    this.endPointService.createChannelProvider(data).subscribe(
      (res: any) => {
        this.emitMsgAndResetForm("Created");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Creating Channel Provider:", error);
      }
    );
  }

  //to update channel provider, it accepts `data` object as parameter containing channel provider properties
  updateChannelProvider(data) {
    this.endPointService.updateChannelProvider(data).subscribe(
      (res: any) => {
        this.emitMsgAndResetForm("Updated");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Updating Channel Provider:", error);
      }
    );
  }

  onChannelTypeChange(channelTypes: Array<any>) {
    let voiceChannelIndex = channelTypes.findIndex(
      (item) => item.name == "VOICE"
    );
    this.setValueAndHideWebhookField(voiceChannelIndex);
    // console.log("Channel Type==>", voiceChannelIndex);

    // console.log("value==>",this.channelProviderForm)
    // this.setValidation(voiceChannelIndex);
  }

  setValueAndHideWebhookField(voiceChannelIndex) {
    if (voiceChannelIndex != -1) {
      this.checkVoiceChannel = true;
      this.channelProviderForm.controls["providerWebhook"].setValue(
        "http://expertflo.com"
      );
    } else {
      this.channelProviderForm.controls["providerWebhook"].setValue("");
      this.checkVoiceChannel = false;
    }
  }
  // setValidation(val) {

  //   if (val != -1) {
  //     console.log("called1")
  //     this.channelProviderForm.controls["providerWebhook"].setValidators(null);
  //   } else {
  //     console.log("called2")
  //     this.channelProviderForm.controls["providerWebhook"].setValidators([
  //       Validators.required,
  //       Validators.pattern(
  //         /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
  //       ),
  //     ]);
  //   }
  //   console.log("value==>",this.channelProviderForm)
  // }
}
