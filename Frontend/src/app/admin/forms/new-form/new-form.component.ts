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
    "Default"
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
      formType: ['Default', Validators.required],
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

  addSectionGroup(): FormGroup {
    return this.fb.group({
      sectionName: ["New Section"],
      sectionKey: ["new_section"],
      sectionWeightage: [0],
      attributes: this.fb.array([]),
    });
  }

  addAttributeGroup(): FormGroup {
    return this.fb.group({
      attributeType: ["", [Validators.required]],
      attributeOptions: this.fb.array([]),
      helpText: [""],
      isRequired: [true],
      key: ["new_question"],
      label: ["New Question", [Validators.required, RxwebValidators.unique()]],
      valueType: ["shortAnswer"],
      attributeWeightage: [0],
    });
  }

  // attribute category form group definition
  addAttributeOptionGroup(): FormGroup {
    return this.fb.group({
      label: [""],
      values: new FormArray([this.addCategoryOptionGroup()]),
    });
  }

  getSection(form) {
    return form.controls["sections"].controls;
  }

  //to get attribute list it accepts the parent form group as parameter
  getAttribute(form) {
    return form.controls["attributes"].controls;
  }

  //to get attributeOptions list it accepts the parent form group as parameter
  getattributeOptions(form) {
    console.log('getattributeOptions: ===> ', form);
    return form.controls["attributeOptions"].controls;
  }

  addCategoryOptionGroup(): FormGroup {
    return this.fb.group({
      label: ["Option 1", Validators.required],
      value: ["option_1", Validators.required],
      color: ["red"],
      emoji: [""],
      emojiStyle: [""],
      weightage: [0],
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
      attributeOptions: new FormArray([]),
      helpText: [""],
      isRequired: [true],
      key: [""],
      label: ["", [Validators.required]],
      valueType: [""],
      attributeWeightage: [0],
    });
  }

  // get category form group definition
  get attributeOptions(): FormGroup {
    return this.fb.group({
      label: [""],
      values: new FormArray([]),
    });
  }

  // get category values/options form group definition
  get categoryValues(): FormGroup {
    return this.fb.group({
      options: [""],
    });
  }

  /**
 * Adds a new attribute to the specified section.
 * 
 * @param sectionIndex The index of the section to which the attribute will be added.
 * @returns void
 */
  addAttributeButton(sectionIndex: number): void {
    // Get the FormArray containing all sections in the form
    const sections = this.newForm.get('sections') as FormArray;

    // Get the attributes FormArray for the specified section
    const attributes = sections.at(sectionIndex).get('attributes') as FormArray;

    // Add a new attribute group to the attributes FormArray
    attributes.push(this.addAttributeGroup());

    // Determine the index of the newly added attribute
    const index = attributes.length;
    const control = attributes.at(index - 1); // Adjust the index to start from 0

    // Patch default values for the attribute
    const attributeIndex = index; // Start attribute index from 1
    control.patchValue({
      label: "New Question" + attributeIndex,
      key: "new_question" + attributeIndex,
      attributeType: "INPUT",
    });

    // Call the clearOutCategory function to perform additional actions
    this.clearOutCategory(sectionIndex, index - 1);

    // Detect changes in the component's view
    this.cd.detectChanges();
  }

  /**
 * Adds a new section to the form.
 * 
 * @returns void
 */
  addSectionButton(): void {
    // Get the FormArray containing all sections in the form
    const sections = this.newForm.get('sections') as FormArray;

    // Determine the index of the newly added section
    const index = sections.length;

    // Add a new section group to the sections FormArray
    sections.push(this.addSectionGroup());

    // Get the newly added section control
    const control = sections.at(index);

    // Patch default values for the section
    const sectionIndex = index + 1; // Increment index by 1 to start from 1
    control.patchValue({
      sectionName: "New Section" + sectionIndex,
      sectionKey: "new_section" + sectionIndex,
      sectionWeightage: 0,
    });

    // Detect changes in the component's view
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

    const category = attribute.get('attributeOptions') as FormArray;
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

  removeSection(sectionIndex: number): void {
    const sections = this.newForm.get('sections') as FormArray;
    sections.removeAt(sectionIndex);
    this.expanded = !this.expanded;
  }

  // to add new category definition in existing attribute category list ,it accepts attribute index as parameter
  addCategoryButton(sectionIndex: number, attributeIndex: number) {
    const sectionsArray = this.newForm.get('sections') as FormArray;
    const section = sectionsArray.at(sectionIndex) as FormGroup;
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
    console.log('Inside add category button function');
    const control = attribute.get('attributeOptions') as FormArray;
    control.push(this.addAttributeOptionGroup());
    const index = control.length - 1;
    control.controls[index].get('label').setValidators([Validators.required, RxwebValidators.unique()]);
    this.cd.detectChanges();
  }

  // to remove category definition from existing category list it accepts attribute and category index(i,j) respectively as parameter
  removeCategory(i, j) {
    const control = (<FormArray>this.newForm.controls["attributes"])
      .at(i)
      .get("attributeOptions") as FormArray;
    control.removeAt(j);
  }

  //to get category options list, it accepts the parent form group and category index as parameter
  getCategoryOptions(form: FormGroup, j: number): FormArray | null {
    // Check if the form and its controls are defined
    if (!form) {
      console.error('Form is not defined.');
      return null;
    }
    // Get the FormArray 'values' from the form
    const controlAtIndex = form.get('values') as FormArray;
    // Check if the control at index j is a FormGroup
    if (!controlAtIndex || !controlAtIndex.at(j) || !(controlAtIndex.at(j) instanceof FormGroup)) {
      console.error('Form control at index j is not a FormGroup.');
      return null;
    }
    // Get the FormGroup at index j
    const formGroupAtIndex = controlAtIndex.at(j) as FormGroup;
    // Check if the FormGroup contains 'attributeOptions' control
    if (!formGroupAtIndex) {
      console.error('FormGroup at index j does not contain attributeOptions control.');
      return null;
    }
    // Get the 'attributeOptions' control as a FormArray
    return formGroupAtIndex.get('attributeOptions') as FormArray;
  }

  // to add new category option definition in existing category option list,it accepts attribute and category index as parameter

  addCategoryOptionButton(i, j) {
    const attributesArray = this.newForm.get('attributes') as FormArray;
    if (!attributesArray) {
      console.error('Attributes array is not defined.');
      return;
    }

    const attribute = attributesArray.at(i) as FormGroup;
    if (!attribute) {
      console.error(`Attribute at index ${i} is not defined.`);
      return;
    }

    const attributeOptions = attribute.get('attributeOptions') as FormArray;
    if (!attributeOptions) {
      console.error('Attribute options are not defined.');
      return;
    }

    const valuesArray = attributeOptions.at(j).get('values') as FormArray;
    if (!valuesArray) {
      console.error('Values array is not defined.');
      return;
    }

    const control = this.addCategoryOptionGroup();
    valuesArray.push(control);

    const index = valuesArray.length - 1;

    const optionsControl = valuesArray.at(index).get('options');
    if (!optionsControl) {
      console.error('Options control is not defined.');
      return;
    }

    optionsControl.setValidators([Validators.required, RxwebValidators.unique()]);
  }

  removeCategoryOption(sectionIndex: number, attributeIndex: number, categoryIndex: number): void {
    const sections = this.newForm.get('sections') as FormArray;
    const section = sections.at(sectionIndex) as FormGroup;
    const attributes = section.get('attributes') as FormArray;
    const attribute = attributes.at(attributeIndex) as FormGroup;
    const category = attribute.get('attributeOptions') as FormArray;
    category.removeAt(categoryIndex);
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
  copyAttribute(sectionIndex: number, attributeIndex: number) {
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
      console.error(`Attributes array in section at index ${sectionIndex} or original attribute at index ${attributeIndex} is undefined.`);
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

    const originalAttribute = attributesArray.at(attributeIndex) as FormGroup;

    if (!originalAttribute) {
      console.error(`Original Attribute control at index ${attributeIndex} is undefined.`);
      return;
    }

    attr.patchValue({
      attributeType: originalAttribute.get('attributeType').value,
      attributeOptions: originalAttribute.get('attributeOptions').value,
      helpText: originalAttribute.get('helpText').value,
      isRequired: originalAttribute.get('isRequired').value,
      key: 'copy_of' + originalAttribute.get('key').value,
      label: 'Copy of ' + originalAttribute.get('label').value,
      valueType: originalAttribute.get('valueType').value,
      attributeWeightage: originalAttribute.get('attributeWeightage').value,
    });

    this.typeSelectChange(attr.get('valueType').value, sectionIndex, length - 1);
  }

  /**
   * Copies a section within a form, including its attributes, and adds the copied section to the form.
   * 
   * @param sectionIndex The index of the section to be copied within the form's sections array.
   * @returns void
   */
  copySection(sectionIndex: number): void {
    // Log the section index for debugging purposes
    console.log('copySection :', sectionIndex);

    // Get the FormArray containing all sections in the form
    const sectionsArray = this.newForm.get('sections') as FormArray;

    // Check if sectionsArray or section at index is undefined
    if (!sectionsArray || sectionIndex >= sectionsArray.length) {
      console.error('Sections array or section at index is undefined.');
      return;
    }

    // Get the FormGroup representing the section to be copied
    const section = sectionsArray.at(sectionIndex) as FormGroup;

    // Check if the section to be copied is undefined
    if (!section) {
      console.error(`Section control at index ${sectionIndex} is undefined.`);
      return;
    }

    // Add a new section to the form
    sectionsArray.push(this.addSectionGroup());

    // Get the newly added section
    const newSection = sectionsArray.at(sectionsArray.length - 1) as FormGroup;

    // Check if the newly added section is undefined
    if (!newSection) {
      console.error(`New section control is undefined.`);
      return;
    }

    // Patch the value of the new section with values from the original section
    newSection.patchValue({
      sectionKey: "copy_of_" + section.value.sectionKey,
      sectionName: "Copy of " + section.value.sectionName,
      sectionWeightage: section.value.sectionWeightage,
    });

    // Get the FormArray representing attributes of the original section
    const attributesArray = section.get('attributes') as FormArray;

    // Get the FormArray representing attributes of the new section
    const newAttributesArray = newSection.get('attributes') as FormArray;

    // Iterate over each attribute in the original attributes array
    attributesArray.controls.forEach(control => {
      // Push a copy of each attribute to the new attributes array
      newAttributesArray.push(this.fb.group(control.value));
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    let sections = this.newForm.get('sections') as FormArray;
    let value = [];
    moveItemInArray(sections.controls, event.previousIndex, event.currentIndex);
    sections.controls.forEach((item, i) => {
      value.push(item.value);
    });
    this.newForm.value.sections = value;
  }

  // Modify typeSelectChange
  typeSelectChange(e: any, sectionIndex: number, attributeIndex: number) {
    console.log('Form Value:', this.newForm.value);
    console.log('TypeSelectionChange parameters: ===>', e, sectionIndex, attributeIndex);
    const sectionsArray = this.newForm.get('sections') as FormArray;
    const section = sectionsArray.at(sectionIndex) as FormGroup;
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
    // shortAnswer, alphaNumeric, alphaNumericSpecial, email, ip, number, password, url, dateTime, phoneNumber, date, time, positiveNumber,
    //  boolean, mcq, dropdown, rating, nps
    if (type == 'boolean' || type == 'mcq' || type == 'dropdown' || type == 'rating' || type == 'nps') {
      attribute.get('attributeType').setValue('OPTIONS');
      const categoriesControl = attribute.get('attributeOptions') as FormArray;
      if (categoriesControl && categoriesControl.controls.length === 0) {
        this.addCategoryButton(sectionIndex, attributeIndex);
      }
    } else if (type == 'paragraph') {
      attribute.get('attributeType').setValue('TEXTAREA');
      this.clearOutCategory(sectionIndex, attributeIndex);
    } else {
      attribute.get('attributeType').setValue('INPUT');
      this.clearOutCategory(sectionIndex, attributeIndex);
    }

    this.setValidation(e, sectionIndex, attributeIndex);
  }

  //to set validation dynamically on the basis of selected attribute type, it accepts selected value and attribute index as parameter
  setValidation(val: string, sectionIndex: number, attributeIndex: number) {
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

    const attributeOptions = attribute.get('attributeOptions') as FormArray;

    if (!attributeOptions) {
      console.error('Attribute options are not defined.');
      return;
    }

    attributeOptions.controls.forEach((item: FormGroup) => {
      const categoryValues = item.get('values') as FormArray;
      console.log('categoryValues ====>', categoryValues);
      if (!categoryValues) {
        console.error('Category values are not defined.');
        return;
      }

      categoryValues.controls.forEach((option: FormGroup) => {

        console.log('categoryValues + option ====>', option);
        if (!option) {
          console.error('Option control is not defined.');
          return;
        }

        const optionsControl = option.get('label');

        if (!optionsControl) {
          console.error('Label control is not defined.');
          return;
        }

        if (val == 'boolean') {
          optionsControl.setValidators([Validators.required]);
        } else {
          optionsControl.setValidators(null);
        }
      });

      const labelControl = item.get('label');

      if (!labelControl) {
        console.error('Label control is not defined.');
        return;
      }

      if (val == 'boolean') {
        labelControl.setValidators([Validators.required]);
      } else {
        labelControl.setValidators(null);
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
      item.attributeOptions = [];
      if (item.attributeType == "OPTIONS") {
        item.isMultipleChoice = item.categoryOptions.isMultipleChoice;
        item.attributeOptions = item.categoryOptions.attributeOptions;
        let attributeOptions: Array<any> = item.attributeOptions;
        attributeOptions.forEach((cat) => {
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
        item.attributeOptions.push(defCategoryObj);
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
      for (let j = 0; j < attribute[i].attributeOptions.length; j++) {
        const categoryArray = attributeArray
          .at(i)
          .get("attributeOptions") as FormArray;
        categoryArray.push(this.attributeOptions);
        for (
          let k = 0;
          k < data.attributes[i].attributeOptions[j].values.length;
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
    let attributeOptions = item.attributeOptions;
    attributeOptions.forEach((category) => {
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
        item.categoryOptions.attributeOptions = item.attributeOptions;
      }
      delete item.isMultipleChoice;
      delete item.attributeOptions;
    });
    return list;
  }

  // to convert form object according to desired object model before saving
  savePredecessor() {
    let data = JSON.parse(JSON.stringify(this.newForm.value));
    let attributeList = this.attrListFormation(data.attributes);
    data.attributes = attributeList;
    console.log('save predecessor function ==> :', data)
    return data;
  }

  //change `valueType` of `options` type attribute
  changeAttrValueType(e, attr) {
    attr.valueType = "StringList";
  }

  // to save form object, it accepts save type(Attribute,Form) as parameter
  onSave(saveType) {
    console.log('on save form: ==> ', this.newForm.value);
    this.spinner = true;
    // let saveObj = this.savePredecessor();
    // if (this.formData) {
    //   this.newForm.value.id = this.formData.id;
    //   this.updateForm(this.newForm.value, saveType);
    // } else {
    //   this.createForm(this.newForm.value, saveType);
    // }
  }

  //to reset view and form in case of form cancelellation
  onClose() {
    this.uiBoolChange.emit(!this.uiBool);
    this.newForm.reset();
  }
}
