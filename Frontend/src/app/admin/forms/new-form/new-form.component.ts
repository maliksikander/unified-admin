import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    label: ''
  };
  validations;
  attributeTypeList = ["INPUT", "OPTIONS"];
  valueTypeList = ["IP", "Number", "Password", "PositiveNumber", "String2000", "String50", "String100", "URL", "AlphaNum100", "AlphanumSpecialChars200", "Boolean", "Email", "StringList","PhoneNumber"];

  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef,
    private endPointService: EndpointService) { }

  ngOnInit(): void {

    this.commonService.tokenVerification();
    this.validations = this.commonService.formErrorMessages;

    this.newForm = this.fb.group({
      formTitle: ['', [Validators.required, Validators.maxLength(500)]],
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

  ngAfterViewInit() { this.cd.detectChanges(); }

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

  getAttribute(form) {
    return form.controls.attributes.controls;
  }

  addAttributeButton() {
    (<FormArray>this.newForm.controls['attributes']).push(this.addAttributeGroup());
    this.cd.detectChanges();
  }

  removeAttribute(i) {
    const attribute: any = this.newForm.get('attributes')
    attribute.removeAt(i);
    this.expanded = !this.expanded;
  }

  addCategoryGroup(): FormGroup {
    return this.fb.group({
      categoryName: [''],
      values: new FormArray([
        this.addCategoryOptionGroup()
      ])
    });
  }

  getCategories(form) {
    return form.controls['categories'].controls;
  }

  addCategoryButton(i) {
    const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
    control.push(this.addCategoryGroup());
    let index = control.length - 1;
    control.controls[index].get("categoryName").setValidators([Validators.required]);
    this.cd.detectChanges();
  }

  removeCategory(i, j) {
    const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
    control.removeAt(j);
  }

  addCategoryOptionGroup(): FormGroup {
    return this.fb.group({
      options: ['', Validators.required],
    });
  }

  getCategoryOptions(form, j) {
    return form.controls['categories'].controls[j].controls['values'].controls;
  }

  addCategoryOptionButton(i, j) {
    const control = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(j).get('values') as FormArray;
    control.push(this.addCategoryOptionGroup());
  }

  removeCategoryOption(i, j, k) {
    const control = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(j).get('values') as FormArray;
    control.removeAt(k);
  }

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

  get categories(): FormGroup {
    return this.fb.group({
      categoryName: [''],
      values: new FormArray([])
    });
  }

  get categoryValues(): FormGroup {
    return this.fb.group({
      options: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) { }

  onClose() {

    this.uiBoolChange.emit(!this.uiBool);
    this.newForm.reset();
  }

  onRequiredToggleChange(e) { }

  panelExpanded() { this.expanded = !this.expanded; }

  savePredecessor() {
    let data = JSON.parse(JSON.stringify(this.newForm.value));
    let attributeList = this.attrListFormation(data.attributes);
    data.attributes = attributeList;

    return data;
  }

  resetUI(msg) {
    this.formSaveData.emit(msg);
    this.newForm.reset();
  }

  //to create new Form and it accepts form object as parameter with following properties (formTitle, formDescription, attributes) and update the local list
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

  //to update Form and it accepts `form` object as parameter and updating the local list with the success response object
  updateQueue(data, saveType) {

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

  onSave(saveType) {

    let saveObj = this.savePredecessor();
    // console.log("save-->", saveObj)
    if (this.formData) {
      saveObj.id = this.formData.id
      this.updateQueue(saveObj, saveType);
    }
    else {
      this.createForm(saveObj, saveType);
    }
  }

  copyAttribute(attribute, i) {

    (<FormArray>this.newForm.controls['attributes']).push(this.addAttributeGroup());
    this.cd.detectChanges();
    let length = this.newForm.value.attributes.length; // form attribute list length
    (<FormArray>this.newForm.controls['attributes']).at(length - 1).patchValue({
      attributeType: attribute.value.attributeType,
      categories: attribute.value.categories,
      helpText: attribute.value.helpText,
      isRequired: attribute.value.isRequired,
      key: "copy_of" + attribute.value.key,
      label: "Copy of" + " " + attribute.value.label,
      valueType: attribute.value.valueType,
      isMultipleChoice: attribute.value.isMultipleChoice,
    });

  }

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

  attrKeyGenerator(attr: string, i: number) {
    let key = attr.replace(" ", "_");
    (<FormArray>this.newForm.controls['attributes']).at(i).get('key').setValue(key);
  }

  drop(event: CdkDragDrop<string[]>) {

    let d = this.getAttribute(this.newForm);
    let value = [];
    moveItemInArray(d, event.previousIndex, event.currentIndex);
    d.forEach((item, i) => {
      value.push(item.value)
    });
    this.newForm.value.attributes = value;
  }

  typeSelectChange(e, i) {

    let type = e;
    if (type == "OPTIONS") {
      (<FormArray>this.newForm.controls['attributes']).at(i).get('valueType').setValue('StringList');
      const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
      if (control.controls.length == 0) this.addCategoryButton(i);
    }

    else {
      (<FormArray>this.newForm.controls['attributes']).at(i).get('valueType').setValue("String100");
      const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
      control.reset();
      for (let i = control.length - 1; i >= 0; i--) { control.removeAt(i); }

      // const opt = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(0).get('values') as FormArray
      // for (let j = opt.length - 1; j >= 0; j--) { opt.removeAt(j); }
      // console.log("<--control-->", control);

    }

    this.setValidation(e, i);
  }

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
}