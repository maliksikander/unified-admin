import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CdkDragDrop, moveItemInArray, CdkDrag } from "@angular/cdk/drag-drop";
import { EndpointService } from '../../services/endpoint.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss']
})
export class NewFormComponent implements OnInit, AfterViewInit {

  @Input() uiBool;
  @Input() formData;
  @Output() uiBoolChange = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  newForm: FormGroup;
  customCollapsedHeight: string = '40px';
  expanded: boolean = false;
  spinner = false;
  formErrors = {
    formTitle: '',
    attributes: [],
    formDescription: '',
  };
  validations;
  attributeTypeList = ["INPUT", "OPTIONS"];
  valueTypeList = ["Alphanum100", "AlphanumSpecial200", "Boolean", "Email", "IP", "Number", "Password", "PhoneNumber", "PositiveNumber", "String50", "String100", "String2000", "URL"];

  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef,
    private endPointService: EndpointService) { }

  ngOnInit(): void {

    this.commonService.tokenVerification();
    this.validations = this.commonService.formErrorMessages;

    this.newForm = this.fb.group({
      formTitle: ['New Form', [Validators.required, Validators.maxLength(500)]],
      formDescription: ['', [Validators.maxLength(500)]],
      attributes: this.fb.array([
        this.addAttributeGroup()
      ])
    });

    if (this.formData) this.editOperations();

    this.newForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.newForm, this.formErrors, this.validations);
    });
  }

  // to check DOM change manaually
  ngAfterViewInit() { this.cd.detectChanges(); }

  ngOnChanges(changes: SimpleChanges) { }

  // attribute form group definition 
  addAttributeGroup(): FormGroup {

    return this.fb.group({
      attributeType: ['', [Validators.required]],
      categories: new FormArray([
        this.addCategoryGroup()
      ]),
      helpText: [''],
      isRequired: [true],
      key: ['New_Attribute'],
      label: ['New Attribute', [Validators.required, RxwebValidators.unique()]],
      valueType: ['String100'],
      isMultipleChoice: [false],
    });
  }

  //to get attribute list it accepts the parent form group as parameter
  getAttribute(form) {
    return form.controls.attributes.controls;
  }

  // to add new attribute definition in existing attribute list and assigns a some default values
  addAttributeButton() {
    (<FormArray>this.newForm.controls['attributes']).push(this.addAttributeGroup());
    let attr = this.getAttribute(this.newForm);
    const index = attr.length - 1;
    let control = attr[index];
    control.patchValue({
      label: 'New Attribute' + index,
      key: 'New_Attribute' + index,
      attributeType: 'INPUT'
    });
    this.clearOutCategory(index);
    this.cd.detectChanges();
  }

  //to clear category form control list, it accepts attribute index as parameter
  clearOutCategory(i) {
    const category = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
    category.reset();
    for (let i = category.length - 1; i >= 0; i--) { category.removeAt(i); }
  }

  // to remove attribute definition from existing attribute list it accepts attribute index as parameter
  removeAttribute(i) {
    const attribute: any = this.newForm.get('attributes')
    attribute.removeAt(i);
    this.expanded = !this.expanded;
  }

  // attribute category form group definition
  addCategoryGroup(): FormGroup {
    return this.fb.group({
      categoryName: [''],
      values: new FormArray([
        this.addCategoryOptionGroup()
      ])
    });
  }

  //to get categories list it accepts the parent form group as parameter
  getCategories(form) {
    return form.controls['categories'].controls;
  }

  // to add new category definition in existing attribute category list ,it accepts attribute index as parameter
  addCategoryButton(i) {
    const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
    control.push(this.addCategoryGroup());
    let index = control.length - 1;
    control.controls[index].get("categoryName").setValidators([Validators.required,RxwebValidators.unique()]);
    this.cd.detectChanges();
  }

  // to remove category definition from existing category list it accepts attribute and category index(i,j) respectively as parameter
  removeCategory(i, j) {
    const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
    control.removeAt(j);
  }

  // category option form group definition
  addCategoryOptionGroup(): FormGroup {
    return this.fb.group({
      options: ['', Validators.required],
    });
  }

  //to get category options list, it accepts the parent form group and category index as parameter
  getCategoryOptions(form, j) {
    return form.controls['categories'].controls[j].controls['values'].controls;
  }

  // to add new category option definition in existing category option list,it accepts attribute and category index as parameter
  addCategoryOptionButton(i, j) {
    const control = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(j).get('values') as FormArray;
    control.push(this.addCategoryOptionGroup());
  }

  // to remove category option definition from existing category option list, it accepts attribute,category and option index (i,j,k) respectively as parameter
  removeCategoryOption(i, j, k) {
    const control = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(j).get('values') as FormArray;
    control.removeAt(k);
  }

  // get attribute form group definition
  get attributes(): FormGroup {
    return this.fb.group({
      attributeType: ['', [Validators.required]],
      categories: new FormArray([]),
      helpText: [''],
      isRequired: [true],
      key: [''],
      label: ['', [Validators.required]],
      valueType: [''],
      isMultipleChoice: [],
    });
  }

  // get category form group definition
  get categories(): FormGroup {
    return this.fb.group({
      categoryName: [''],
      values: new FormArray([])
    });
  }

  // get category values/options form group definition
  get categoryValues(): FormGroup {
    return this.fb.group({
      options: [''],
    });
  }

  // generate key using user typed attribute label
  attrKeyGenerator(attr: string, i: number) {
    let key = attr.replace(" ", "_");
    (<FormArray>this.newForm.controls['attributes']).at(i).get('key').setValue(key);
  }

  // to copy an existing attribute in a form, it accepts attribute definition to be copied as parameter
  copyAttribute(attribute) {

    (<FormArray>this.newForm.controls['attributes']).push(this.addAttributeGroup());
    this.cd.detectChanges();
    let length = this.newForm.value.attributes.length; // form attribute list length
    let attr = (<FormArray>this.newForm.controls['attributes']).at(length - 1);
    attr.patchValue({
      attributeType: attribute.value.attributeType,
      categories: attribute.value.categories,
      helpText: attribute.value.helpText,
      isRequired: attribute.value.isRequired,
      key: "copy_of" + attribute.value.key,
      label: "Copy of" + " " + attribute.value.label,
      valueType: attribute.value.valueType,
      isMultipleChoice: attribute.value.isMultipleChoice,
    });

    this.typeSelectChange(attr.value.attributeType, length - 1);
  }

  // to drag & drop the attribute lsit item and update the local list variable 
  drop(event: CdkDragDrop<string[]>) {

    let d = this.getAttribute(this.newForm);
    let value = [];
    moveItemInArray(d, event.previousIndex, event.currentIndex);
    d.forEach((item, i) => {
      value.push(item.value)
    });
    this.newForm.value.attributes = value;
  }

  //event called on attribute type selection, it accepts selected value and attribute index as parameter
  typeSelectChange(e, i) {

    let type = e;
    if (type == "OPTIONS") {
      (<FormArray>this.newForm.controls['attributes']).at(i).get('valueType').setValue('String2000');
      const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
      if (control.controls.length == 0) this.addCategoryButton(i);
    }
    else {
      (<FormArray>this.newForm.controls['attributes']).at(i).get('valueType').setValue("String100");
      this.clearOutCategory(i);
    }

    this.setValidation(e, i);
  }

  //to set validation dynamically on the basis of selected attribute type, it accepts selected value and attribute index as parameter
  setValidation(val, i) {
    let attr: any = this.newForm.controls['attributes'];
    let categories: any = attr.at(i).get('categories').controls;
    categories.forEach((item: any) => {
      let categoryValues: any = item.get('values').controls;
      categoryValues.forEach((option: any) => {
        if (val == 'OPTIONS') {
          option.controls["options"].setValidators([Validators.required]);
        }
        else {
          option.controls["options"].setValidators(null);
        }
      });

      if (val == 'OPTIONS') {
        item.controls["categoryName"].setValidators([Validators.required]);
      }
      else {
        item.controls["categoryName"].setValidators(null);
      }

    })
    this.cd.detectChanges();
  }

  // expansion panel state updation in local variable
  panelExpanded() { this.expanded = !this.expanded; }

  // converting received form object to patch values with local form object
  editOperations() {
    this.formData = this.editObjectFormation(JSON.parse(JSON.stringify(this.formData)));
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
    attr.forEach(item => {
      item.categories = [];
      if (item.attributeType == "OPTIONS") {
        item.isMultipleChoice = item.categoryOptions.isMultipleChoice;
        item.categories = item.categoryOptions.categories;
        let categories: Array<any> = item.categories;
        categories.forEach(cat => {
          let mutatedValues = [];
          cat.values.forEach(item => {
            let obj = {
              ['options']: item,
            }
            mutatedValues.push(obj);
          });

          cat.values = mutatedValues;
        });
      }
      else {
        let defCategoryObj: any = {
          categoryName: null,
          values: [{ options: null }]
        };
        item.isMultipleChoice = false;
        item.categories.push(defCategoryObj);
      }
      delete item.categoryOptions;
      if (item._id) delete item._id
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
        const categoryArray = attributeArray.at(i).get("categories") as FormArray;
        categoryArray.push(this.categories);
        for (let k = 0; k < data.attributes[i].categories[j].values.length; k++) {
          const categoryValuesArray = categoryArray.at(j).get("values") as FormArray;
          categoryValuesArray.push(this.categoryValues);
        }
      }
      this.setValidation(attribute[i].attributeType, i);
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
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
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
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  // convert category option list according to object model
  formatOptionList(item) {
    let categories = item.categories;
    categories.forEach(category => {
      let newVal = [];
      let values = category.values;
      values.forEach(val => {
        newVal.push(val.options)
      });
      category.values = newVal;
    });

    return item;
  }

  // convert attribute list according form object model
  attrListFormation(list: Array<any>) {

    list.forEach(item => {
      item.categoryOptions = {};
      if (item.attributeType == "OPTIONS") {

        item = this.formatOptionList(item);
        item.categoryOptions.isMultipleChoice = item.isMultipleChoice;
        item.categoryOptions.categories = item.categories;
      }
      delete item.isMultipleChoice;
      delete item.categories;
    });
    return list
  }

  // to convert form object according to desired object model before saving
  savePredecessor() {
    let data = JSON.parse(JSON.stringify(this.newForm.value));
    let attributeList = this.attrListFormation(data.attributes);
    data.attributes = attributeList;
    return data;
  }

  // to save form object, it accepts save type(Attribute,Form) as parameter
  onSave(saveType) {

    let saveObj = this.savePredecessor();
    if (this.formData) {
      saveObj.id = this.formData.id;
      this.updateForm(saveObj, saveType);
    }
    else {
      this.createForm(saveObj, saveType);
    }
  }

  //to reset view and form in case of form cancelellation
  onClose() {

    this.uiBoolChange.emit(!this.uiBool);
    this.newForm.reset();
  }

}