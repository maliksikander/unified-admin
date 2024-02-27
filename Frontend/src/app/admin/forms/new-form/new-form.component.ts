import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { SnackbarService } from "../../services/snackbar.service";
import { CdkDragDrop, moveItemInArray, CdkDrag } from "@angular/cdk/drag-drop";
import { EndpointService } from "../../services/endpoint.service";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

@Component({
  selector: "app-new-form",
  templateUrl: "./new-form.component.html",
  styleUrls: ["./new-form.component.scss"],
})
export class NewFormComponent implements OnInit, AfterViewInit {
  @Input() uiBool;
  @Input() formData;
  @Output() uiBoolChange = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  newForm: FormGroup;
  customCollapsedHeight: string = "40px";
  expanded: boolean = false;
  spinner = false;
  formErrors: {
    formTitle?: string;
    sections?: any[];
    formDescription?: string;
  } = {};
  validations;
  attributeTypeList = ["INPUT", "OPTIONS", "TEXTAREA"];
  valueTypeList = [
    "alphaNumeric",
    "alphaNumericSpecial",
    "boolean",
    "email",
    "url",
    "ip",
    "number",
    "password",
    "phoneNumber",
    "positiveNumber",
    "shortAnswer",
    "paragraph",
    "date",
    "time",
    "dateTime",
    "file",
    "mcq",
    "checkbox",
    "dropdown",
    "rating",
    "nps"
  ];

  formTypeList = [
    "Questionnaire",
    "Survey",
    "Wrap-up",
    "Pre-conversation",
    "default"
  ]

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef,
    private endPointService: EndpointService
  ) { }

  ngOnInit(): void {
    this.validations = this.commonService.formErrorMessages;

    this.newForm = this.fb.group({
      formType: ['', Validators.required],
      formTitle: ["New Form", [Validators.required, Validators.maxLength(500)]],
      formDescription: ["", [Validators.maxLength(500)]],
      enableSections: [true],
      enableWeightage: [true],
      sections: this.fb.array([this.addSectionGroup()]),
    });

    if (this.formData) {
      this.editOperations();
    }

    this.newForm.valueChanges.subscribe(() => {
      this.formErrors = {}; // Reset formErrors before checking validations
      [this.formErrors, this.validations] = this.commonService.logValidationErrors(
        this.newForm,
        this.formErrors,
        this.validations
      );
    });
  }

  // section form group definition
  addSectionGroup(): FormGroup {
    return this.fb.group({
      sectionName: ["New Section"],
      sectionKey: ["new_section"],
      sectionWeightage: [0],
      attributes: new FormArray([this.addAttributeGroup()]),
    });
  }

  // attribute form group definition
  addAttributeGroup(): FormGroup {
    return this.fb.group({
      attributeType: ["", [Validators.required]],
      categories: new FormArray([this.addCategoryGroup()]),
      helpText: [""],
      isRequired: [true],
      key: ["new_question"],
      label: ["New Question", [Validators.required, RxwebValidators.unique()]],
      valueType: ["shortAnswer"],
      isMultipleChoice: [false],
    });
  }

  // attribute category form group definition
  addCategoryGroup(): FormGroup {
    return this.fb.group({
      categoryName: [""],
      values: new FormArray([this.addCategoryOptionGroup()]),
    });
  }

  getSection(form) {
    // console.log('getSection:', form);
    return form.controls["sections"].controls;
  }

  //to get attribute list it accepts the parent form group as parameter
  getAttribute(form) {
    // console.log('getAttribute:', form);
    return form.controls["attributes"].controls;
  }

  //to get categories list it accepts the parent form group as parameter
  getCategories(form) {
    return form.controls["categories"].controls;
  }

  // category option form group definition
  addCategoryOptionGroup(): FormGroup {
    return this.fb.group({
      options: ["", Validators.required],
    });
  }


  // get section form group definition
  get sections(): FormGroup {
    return this.fb.group({
      sectionName: [""],
      sectionKey: [""],
      sectionWeightage: [0],
      attributes: new FormArray([]),
    });
  }

  // get attribute form group definition
  get attributes(): FormGroup {
    return this.fb.group({
      attributeType: ["", [Validators.required]],
      categories: new FormArray([]),
      helpText: [""],
      isRequired: [true],
      key: [""],
      label: ["", [Validators.required]],
      valueType: [""],
      isMultipleChoice: [],
    });
  }

  // get category form group definition
  get categories(): FormGroup {
    return this.fb.group({
      categoryName: [""],
      values: new FormArray([]),
    });
  }

  // get category values/options form group definition
  get categoryValues(): FormGroup {
    return this.fb.group({
      options: [""],
    });
  }

  addAttributeButton(sectionIndex: number) {
    const sections = this.newForm.get('sections') as FormArray;
    const attributes = sections.at(sectionIndex).get('attributes') as FormArray;

    attributes.push(this.addAttributeGroup());  // Add a new attribute group to the attributes FormArray

    const index = attributes.length - 1;
    const control = attributes.at(index);

    // Patch default values
    control.patchValue({
      label: "New Attribute" + index,
      key: "New_Attribute" + index,
      attributeType: "INPUT",
    });

    this.clearOutCategory(sectionIndex, index);
    this.cd.detectChanges();
  }

  addSectionButton() {
    const sections = this.newForm.get('sections') as FormArray;
    // const attributes = sections.at(sectionIndex).get('sec') as FormArray;

    sections.push(this.addSectionGroup());  // Add a new attribute group to the attributes FormArray

    const index = sections.length - 1;
    const control = sections.at(index);

    // Patch default values
    control.patchValue({
      sectionName: "New Section" + index,
      sectionKey: "new_section" + index,
      attributes: this.addAttributeGroup(),
    });

    // this.clearOutCategory(sectionIndex, index);
    this.cd.detectChanges();
  }

  // to check DOM change manaually
  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) { }

  //to clear category form control list, it accepts attribute index as parameter
  clearOutCategory(sectionIndex, attributeIndex) {
    const sectionsArray = this.newForm.get('sections') as FormArray;

    if (!sectionsArray || sectionIndex >= sectionsArray.length) {
      console.error('Sections array or section at index is undefined.');
      return;
    }

    const section = sectionsArray.at(sectionIndex) as FormGroup;

    if (!section) {
      console.error(`Section control at index ${sectionIndex} is undefined.`);
      return;
    }

    const attributesArray = section.get('attributes') as FormArray;

    if (!attributesArray || attributeIndex >= attributesArray.length) {
      console.error(`Attributes array or attribute at index ${attributeIndex} is undefined.`);
      return;
    }

    const attribute = attributesArray.at(attributeIndex) as FormGroup;

    if (!attribute) {
      console.error(`Attribute control at index ${attributeIndex} is undefined.`);
      return;
    }

    const category = attribute.get('categories') as FormArray;
    category.reset();

    for (let i = category.length - 1; i >= 0; i--) {
      category.removeAt(i);
    }
  }

  // to remove attribute definition from existing attribute list it accepts section index and attribute index as parameters
  removeAttribute(sectionIndex: number, attributeIndex: number) {
    const sectionsArray = this.newForm.get('sections') as FormArray;

    if (!sectionsArray || sectionIndex >= sectionsArray.length) {
      console.error(`Sections array or section at index ${sectionIndex} is undefined.`);
      return;
    }

    const section = sectionsArray.at(sectionIndex) as FormGroup;
    const attributesArray = section.get('attributes') as FormArray;

    if (!attributesArray || attributeIndex >= attributesArray.length) {
      console.error(`Attributes array or attribute at index ${attributeIndex} is undefined.`);
      return;
    }

    attributesArray.removeAt(attributeIndex);
    this.expanded = !this.expanded;
  }

  // to remove attribute definition from existing attribute list it accepts attribute index as parameter
  removeSection(i) {
    const section: any = this.newForm.get("sections");
    section.removeAt(i);
    // this.expanded = !this.expanded;
  }

  // to add new category definition in existing attribute category list ,it accepts attribute index as parameter
  addCategoryButton(sectionIndex: number, attributeIndex: number) {
    const sectionsArray = this.newForm.get('sections') as FormArray;

    if (!sectionsArray || sectionIndex >= sectionsArray.length) {
      console.error('Sections array or section at index is undefined.');
      return;
    }

    const section = sectionsArray.at(sectionIndex) as FormGroup;

    if (!section) {
      console.error(`Section control at index ${sectionIndex} is undefined.`);
      return;
    }

    const attributesArray = section.get('attributes') as FormArray;

    if (!attributesArray || attributeIndex >= attributesArray.length) {
      console.error(`Attributes array or attribute at index ${attributeIndex} is undefined.`);
      return;
    }

    const attribute = attributesArray.at(attributeIndex) as FormGroup;

    if (!attribute) {
      console.error(`Attribute control at index ${attributeIndex} is undefined.`);
      return;
    }

    const control = attribute.get('categories') as FormArray;
    control.push(this.addCategoryGroup());
    const index = control.length - 1;
    control.controls[index].get('categoryName').setValidators([Validators.required, RxwebValidators.unique()]);
    this.cd.detectChanges();
  }

  // to remove category definition from existing category list it accepts attribute and category index(i,j) respectively as parameter
  removeCategory(i, j) {
    const control = (<FormArray>this.newForm.controls["attributes"])
      .at(i)
      .get("categories") as FormArray;
    control.removeAt(j);
  }

  //to get category options list, it accepts the parent form group and category index as parameter
  getCategoryOptions(form, j) {
    return form.controls["categories"].controls[j].controls["values"].controls;
  }

  // to add new category option definition in existing category option list,it accepts attribute and category index as parameter
  addCategoryOptionButton(i, j) {
    const control = (
      (<FormArray>this.newForm.controls["attributes"])
        .at(i)
        .get("categories") as FormArray
    )
      .at(j)
      .get("values") as FormArray;

    control.push(this.addCategoryOptionGroup());
    let index = control.length - 1;
    control.controls[index]
      .get("options")
      .setValidators([Validators.required, RxwebValidators.unique()]);
  }

  // to remove category option definition from existing category option list, it accepts attribute,category and option index (i,j,k) respectively as parameter
  removeCategoryOption(i, j, k) {
    const control = (
      (<FormArray>this.newForm.controls["attributes"])
        .at(i)
        .get("categories") as FormArray
    )
      .at(j)
      .get("values") as FormArray;
    control.removeAt(k);
  }

  // generate key using user typed section Name
  sectionKeyGenerator(section: string, i: number) {
    let key = section.toLowerCase().replace(/ /g, "_");
    (<FormArray>this.newForm.controls["sections"])
      .at(i)
      .get("sectionKey")
      .setValue(key);
  }

  attrKeyGenerator(attr: string, sectionIndex: number, attributeIndex: number) {
    // Log the indices for debugging purposes
    console.log('attrKeyGenerator called with indices:', sectionIndex, attributeIndex);
    // Access the 'sections' FormArray from the form
    const sectionsArray = this.newForm.get('sections') as FormArray;
    if (!sectionsArray) {
      console.error('Sections FormArray not found in form.');
      return;
    }
    // Ensure the section index is within bounds
    if (sectionIndex >= sectionsArray.length || sectionIndex < 0) {
      console.error('Section index out of bounds:', sectionIndex);
      return;
    }
    // Access the specific section FormGroup using the sectionIndex
    const sectionFormGroup = sectionsArray.at(sectionIndex) as FormGroup;
    if (!sectionFormGroup) {
      console.error('Section group not found at index:', sectionIndex);
      return;
    }
    // Access the 'attributes' FormArray within the section
    const attributesArray = sectionFormGroup.get('attributes') as FormArray;
    if (!attributesArray) {
      console.error('Attributes FormArray not found in section.');
      return;
    }
    // Ensure the attribute index is within bounds
    if (attributeIndex >= attributesArray.length || attributeIndex < 0) {
      console.error('Attribute index out of bounds:', attributeIndex);
      return;
    }
    // Access the specific attribute FormGroup using the attributeIndex
    const attributeFormGroup = attributesArray.at(attributeIndex) as FormGroup;
    if (!attributeFormGroup) {
      console.error('Attribute group not found at index:', attributeIndex);
      return;
    }
    // Generate the key from the attribute label
    let key = attr.toLowerCase().replace(/ /g, "_");
    // Update the 'key' FormControl within the attribute FormGroup
    attributeFormGroup.get('key')?.setValue(key);
  }

  // to copy an existing attribute in a form, it accepts attribute definition to be copied as parameter
  copyAttribute(sectionIndex: number, originalAttributeIndex: number) {
    const sectionsArray = this.newForm.get('sections') as FormArray;

    if (!sectionsArray || sectionIndex >= sectionsArray.length) {
      console.error('Sections array or section at index is undefined.');
      return;
    }

    const section = sectionsArray.at(sectionIndex) as FormGroup;

    if (!section) {
      console.error(`Section control at index ${sectionIndex} is undefined.`);
      return;
    }

    const attributesArray = section.get('attributes') as FormArray;

    if (!attributesArray || originalAttributeIndex >= attributesArray.length) {
      console.error(`Attributes array in section at index ${sectionIndex} or original attribute at index ${originalAttributeIndex} is undefined.`);
      return;
    }

    attributesArray.push(this.addAttributeGroup());
    this.cd.detectChanges();

    const length = attributesArray.length;
    const attr = attributesArray.at(length - 1) as FormGroup;

    if (!attr) {
      console.error(`Attribute control at index ${length - 1} is undefined.`);
      return;
    }

    const originalAttribute = attributesArray.at(originalAttributeIndex) as FormGroup;

    if (!originalAttribute) {
      console.error(`Original Attribute control at index ${originalAttributeIndex} is undefined.`);
      return;
    }

    attr.patchValue({
      attributeType: originalAttribute.get('attributeType').value,
      categories: originalAttribute.get('categories').value,
      helpText: originalAttribute.get('helpText').value,
      isRequired: originalAttribute.get('isRequired').value,
      key: 'copy_of' + originalAttribute.get('key').value,
      label: 'Copy of ' + originalAttribute.get('label').value,
      valueType: originalAttribute.get('valueType').value,
      isMultipleChoice: originalAttribute.get('isMultipleChoice').value,
    });

    this.typeSelectChange(attr.get('attributeType').value, sectionIndex, length - 1);
  }

  copySection(section) {
    console.log('copySection :', section);
    (<FormArray>this.newForm.controls["sections"]).push(
      this.addSectionGroup()
    );
    this.cd.detectChanges();
    let length = this.newForm.value.attributes.length; // form attribute list length
    let sect = (<FormArray>this.newForm.controls["sections"]).at(length - 1);
    sect.patchValue({
      sectionKey: "copy_of" + section.value.key,
      sectionName: "Copy of" + " " + section.value.label,
      attributes: section.value.attributes,
    });

    // this.typeSelectChange(sect.get('attributeType').value, sectionIndex, length - 1);
  }

  // to drag & drop the attribute lsit item and update the local list variable
  drop(event: CdkDragDrop<string[]>) {
    let d = this.getAttribute(this.newForm);
    let value = [];
    moveItemInArray(d, event.previousIndex, event.currentIndex);
    d.forEach((item, i) => {
      value.push(item.value);
    });
    this.newForm.value.attributes = value;
  }

  // Modify typeSelectChange
  typeSelectChange(e, sectionIndex, attributeIndex) {
    console.log('Form Value:', this.newForm.value);

    const sectionsArray = this.newForm.get('sections') as FormArray;

    if (!sectionsArray || sectionIndex >= sectionsArray.length) {
      console.error('Sections array or section at index is undefined.');
      return;
    }

    const section = sectionsArray.at(sectionIndex) as FormGroup;

    if (!section) {
      console.error(`Section control at index ${sectionIndex} is undefined.`);
      return;
    }

    const attributesArray = section.get('attributes') as FormArray;

    if (!attributesArray || attributeIndex >= attributesArray.length) {
      console.error(`Attributes array or attribute at index ${attributeIndex} is undefined.`);
      return;
    }

    const attribute = attributesArray.at(attributeIndex) as FormGroup;

    if (!attribute) {
      console.error(`Attribute control at index ${attributeIndex} is undefined.`);
      return;
    }

    console.log('Attribute Value:', attribute.value);

    let type = e;

    if (type == 'OPTIONS') {
      attribute.get('valueType').setValue('StringList');
      const categoriesControl = attribute.get('categories') as FormArray;

      if (categoriesControl && categoriesControl.controls.length === 0) {
        this.addCategoryButton(sectionIndex, attributeIndex);
      }
    } else {
      attribute.get('valueType').setValue('shortAnswer');
      this.clearOutCategory(sectionIndex, attributeIndex);
    }

    this.setValidation(e, sectionIndex, attributeIndex);
  }

  //to set validation dynamically on the basis of selected attribute type, it accepts selected value and attribute index as parameter
  setValidation(val, sectionIndex, attributeIndex) {
    const sectionsArray = this.newForm.get('sections') as FormArray;

    if (!sectionsArray || sectionIndex >= sectionsArray.length) {
      console.error('Sections array or section at index is undefined.');
      return;
    }

    const section = sectionsArray.at(sectionIndex) as FormGroup;

    if (!section) {
      console.error(`Section control at index ${sectionIndex} is undefined.`);
      return;
    }

    const attributesArray = section.get('attributes') as FormArray;

    if (!attributesArray || attributeIndex >= attributesArray.length) {
      console.error(`Attributes array or attribute at index ${attributeIndex} is undefined.`);
      return;
    }

    const attribute = attributesArray.at(attributeIndex) as FormGroup;

    if (!attribute) {
      console.error(`Attribute control at index ${attributeIndex} is undefined.`);
      return;
    }

    const categories = attribute.get('categories') as FormArray;

    categories.controls.forEach((item: FormGroup) => {
      const categoryValues = item.get('values') as FormArray;

      categoryValues.controls.forEach((option: FormGroup) => {
        if (val == 'OPTIONS') {
          option.get('options').setValidators([Validators.required]);
        } else {
          option.get('options').setValidators(null);
        }
      });

      if (val == 'OPTIONS') {
        item.get('categoryName').setValidators([Validators.required]);
      } else {
        item.get('categoryName').setValidators(null);
      }
    });

    this.cd.detectChanges();
  }

  // expansion panel state updation in local variable
  panelExpanded() {
    this.expanded = !this.expanded;
  }

  // converting received form object to patch values with local form object
  editOperations() {
    this.formData = this.editObjectFormation(
      JSON.parse(JSON.stringify(this.formData))
    );
    let patchObj = JSON.parse(JSON.stringify(this.formData));
    delete patchObj.createdAt;
    delete patchObj.updatedAt;
    delete patchObj.id;

    const attrArray = this.newForm.get("attributes") as FormArray;
    attrArray.clear();
    this.createFormArrays(patchObj);
  }

  // extension of edit operations method it converts attribute list in a form object, it accepts form object as parameter
  editObjectFormation(data) {
    let attr: Array<any> = data.attributes;
    attr.forEach((item) => {
      item.categories = [];
      if (item.attributeType == "OPTIONS") {
        item.isMultipleChoice = item.categoryOptions.isMultipleChoice;
        item.categories = item.categoryOptions.categories;
        let categories: Array<any> = item.categories;
        categories.forEach((cat) => {
          let mutatedValues = [];
          cat.values.forEach((item) => {
            let obj = {
              ["options"]: item,
            };
            mutatedValues.push(obj);
          });

          cat.values = mutatedValues;
        });
      } else {
        let defCategoryObj: any = {
          categoryName: null,
          values: [{ options: null }],
        };
        item.isMultipleChoice = false;
        item.categories.push(defCategoryObj);
      }
      delete item.categoryOptions;
      if (item._id) delete item._id;
    });

    return data;
  }

  //create form definitions for attributes according to the object received and set value for editing, it accepts form object as parameter
  createFormArrays(data) {
    let attribute: Array<any> = data.attributes;
    for (let i = 0; i < attribute.length; i++) {
      const attributeArray = this.newForm.get("attributes") as FormArray;
      attributeArray.push(this.attributes);
      for (let j = 0; j < attribute[i].categories.length; j++) {
        const categoryArray = attributeArray
          .at(i)
          .get("categories") as FormArray;
        categoryArray.push(this.categories);
        for (
          let k = 0;
          k < data.attributes[i].categories[j].values.length;
          k++
        ) {
          const categoryValuesArray = categoryArray
            .at(j)
            .get("values") as FormArray;
          categoryValuesArray.push(this.categoryValues);
        }
      }
      // this.setValidation(attribute[i].attributeType, i, );
    }
    this.newForm.setValue(data);
  }

  //reset view and form object on form submission it accepts request reponse(Created,Updated) as parameter
  resetUI(msg) {
    this.formSaveData.emit(msg);
    this.newForm.reset();
  }

  //to create new Form and it accepts form object as parameter with following properties (formTitle, formDescription, attributes) and changes the view on success response
  createForm(data, saveType) {
    this.endPointService.createForm(data).subscribe(
      (res: any) => {
        this.spinner = false;
        if (saveType == "Form") this.resetUI("Created");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update Form and it accepts form object as parameter and resets the view on success response
  updateForm(data, saveType) {
    this.endPointService.updateForm(data).subscribe(
      (res: any) => {
        this.spinner = false;
        if (saveType == "Form") this.resetUI("Updated");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // convert category option list according to object model
  formatOptionList(item) {
    let categories = item.categories;
    categories.forEach((category) => {
      let newVal = [];
      let values = category.values;
      values.forEach((val) => {
        newVal.push(val.options);
      });
      category.values = newVal;
    });

    return item;
  }

  // convert attribute list according form object model
  attrListFormation(list: Array<any>) {
    list.forEach((item) => {
      item.categoryOptions = {};
      if (item.attributeType == "OPTIONS") {
        item = this.formatOptionList(item);
        item.categoryOptions.isMultipleChoice = item.isMultipleChoice;
        item.categoryOptions.categories = item.categories;
      }
      delete item.isMultipleChoice;
      delete item.categories;
    });
    return list;
  }

  // to convert form object according to desired object model before saving
  savePredecessor() {
    let data = JSON.parse(JSON.stringify(this.newForm.value));
    let attributeList = this.attrListFormation(data.attributes);
    data.attributes = attributeList;
    return data;
  }

  //change `valueType` of `options` type attribute
  changeAttrValueType(e, attr) {
    attr.valueType = "StringList";
  }

  // to save form object, it accepts save type(Attribute,Form) as parameter
  onSave(saveType) {
    this.spinner = true;
    let saveObj = this.savePredecessor();
    if (this.formData) {
      saveObj.id = this.formData.id;
      this.updateForm(saveObj, saveType);
    } else {
      this.createForm(saveObj, saveType);
    }
  }

  //to reset view and form in case of form cancelellation
  onClose() {
    this.uiBoolChange.emit(!this.uiBool);
    this.newForm.reset();
  }
}
