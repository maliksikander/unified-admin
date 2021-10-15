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
import { CommonService } from "src/app/admin/services/common.service";
import { EndpointService } from "src/app/admin/services/endpoint.service";
import { SnackbarService } from "src/app/admin/services/snackbar.service";
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
    "Email",
    "IP",
    "Number",
    "Password",
    "PhoneNumber",
    "PositiveNumber",
    "String50",
    "String100",
    "String2000",
    "StringList",
    "URL",
  ];
  spinner = true;
  channelTypeList = [];

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private endPointService: EndpointService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.channelProviderFormErrorMessages;

    this.channelProviderForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
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
      channelProviderConfigSchema: this.fb.array([this.addAttribute()]),
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

  addAttribute(): FormGroup {
    return this.fb.group({
      attributeType: ["INPUT", [Validators.required]],
      categoryOptions: null,
      helpText: [""],
      isRequired: [true],
      key: ["New_Attribute"],
      label: ["New Attribute", [Validators.required, RxwebValidators.unique()]],
      valueType: ["String100"],
    });
  }

  getProviderAttribute(form) {
    return form.controls.channelProviderConfigSchema.controls;
  }

  // to add new attribute definition in existing attribute list and assigns a some default values
  addAttributeButton() {
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
    // this.clearOutCategory(index);
    this.cd.detectChanges();
  }

  // to remove attribute definition from existing attribute list it accepts attribute index as parameter
  removeAttribute(i) {
    const attribute: any = this.channelProviderForm.get(
      "channelProviderConfigSchema"
    );
    attribute.removeAt(i);
    this.expanded = !this.expanded;
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
    let key = attr.replace(" ", "_");
    (<FormArray>(
      this.channelProviderForm.controls["channelProviderConfigSchema"]
    ))
      .at(i)
      .get("key")
      .setValue(key);
  }

  // to copy an existing attribute in a form, it accepts attribute definition to be copied as parameter
  copyAttribute(attribute) {
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

    // this.typeSelectChange(attr.value.attributeType, length - 1);
  }

  panelExpanded() {
    this.expanded = !this.expanded;
  }

  drop(event: CdkDragDrop<string[]>) {
    let d = this.getProviderAttribute(this.channelProviderForm);
    let value = [];
    moveItemInArray(d, event.previousIndex, event.currentIndex);
    d.forEach((item, i) => {
      value.push(item.value);
    });
    this.channelProviderForm.value.attributes = value;
  }

  //to get channel provider list
  getChannelType() {
    this.endPointService.getChannelType().subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelTypeList = res;

        if (this.editChannelProvider) this.editOperations();
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
      }
    );
  }

  onSave() {
    // this.spinner = true;
    let data = this.channelProviderForm.value;
    let channelTypes = data?.supportedChannelTypes;
    let channelTypeIDArray = [];
    channelTypes?.forEach((item) => {
      let obj = { id: "" };
      obj.id = item.id;
      channelTypeIDArray.push(obj);
    });
    data.supportedChannelTypes = channelTypeIDArray;
    console.log("data==>", data);

    // if (this.uploadFilePayload) {
    //   this.uploadFile();
    // } else {
    //   // this.setChannelTypeRequestPayload(this.editData?.channelLogo);
    // }
  }

  onClose() {
    this.childBool.emit(!this.parentBool);
    this.channelProviderForm.reset();
  }

  // converting received form object to patch values with local form object
  editOperations() {
    let data = JSON.parse(JSON.stringify(this.editChannelProvider));

    // console.log("data==>", data);
    // let patchObj = JSON.parse(JSON.stringify(data));
    // delete patchObj.createdAt;
    // delete patchObj.updatedAt;
    delete data.id;

    const attrArray = this.channelProviderForm.get(
      "channelProviderConfigSchema"
    ) as FormArray;
    attrArray.clear();
    this.createFormArrays(data);
  }

  // extension of edit operations method it converts attribute list in a form object, it accepts form object as parameter
  editObjectFormation(data) {
    console.log("format==>", data);
    let attr: Array<any> = data.channelProviderConfigSchema;

    // return data;
  }

  //create form definitions for attributes according to the object received and set value for editing, it accepts form object as parameter
  createFormArrays(data) {
    // console.log("data==>", data);
    let attribute: Array<any> = data.channelProviderConfigSchema;
    for (let i = 0; i < attribute.length; i++) {
      const attributeArray = this.channelProviderForm.get(
        "channelProviderConfigSchema"
      ) as FormArray;
      attributeArray.push(this.providerAttributes);

      // this.setValidation(attribute[i].attributeType, i);
    }

    this.channelProviderForm.setValue(data);
    console.log("form==>",this.channelProviderForm.value)
    this.cd.detectChanges();
  }
}
