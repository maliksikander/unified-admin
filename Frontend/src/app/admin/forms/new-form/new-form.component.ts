import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CdkDragDrop, moveItemInArray, CdkDrag } from "@angular/cdk/drag-drop";
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

  attributeTypeList = ["INPUT", "OPTIONS"];

  valueTypeList = ["IP", "Number", "Password", "PositiveNumber", "String2000", "String50", "String100", "URL", "AlphaNum100", "AlphanumSpecialChars200", "Boolean", "Email", "StringList"];

  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.newForm = this.fb.group({
      formTitle: ['', Validators.required],
      formDescription: [''],
      attributes: this.fb.array([
        this.addAttributeGroup()
      ])
    });
  }

  ngAfterViewInit() { this.cd.detectChanges(); }

  addAttributeGroup(): FormGroup {

    return this.fb.group({
      attributeType: ['', [Validators.required]],
      categories: new FormArray([
        this.addCategoryGroup()
      ]),
      helpText: [''],
      isRequired: [true],
      key: ['New_Attribute'],
      label: ['New Attribute', [Validators.required]],
      valueType: [''],
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
      categoryName: ['', [Validators.required]],
      values: new FormArray([
        this.addCategoryOptionGroup()
      ])
    });
  }

  getCategories(form) {
    return form.controls['categories'].controls;
  }

  addCategoryButton(i, j) {
    const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
    control.push(this.addCategoryGroup());
  }

  removeCategory(i, j) {
    const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
    control.removeAt(i);
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
    control.removeAt(j);
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
    console.log("data-->", data);
    return data;
  }

  onAttributeSave() {
    let attrSaveObj = this.savePredecessor();
  }

  onSave() {

    let saveObj = this.savePredecessor();
    // console.log("form data-->", formDataObj);
    // console.log("list-->", attributeList);
    this.formSaveData.emit(saveObj);
    this.newForm.reset();
  }

  copyAttribute(attribute, i) {

    // console.log(i, "<--attr-->", attribute);

    (<FormArray>this.newForm.controls['attributes']).push(this.addAttributeGroup());
    this.cd.detectChanges();
    let length = this.newForm.value.attributes.length; // form attribute list length
    // console.log("length-->", length);
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
    d.forEach(item => {
      value.push(item.value)
    });
    this.newForm.value.attributes = value;
  }

  typeSelectChange(e, i) {

    let type = e;
    if (type == "OPTIONS") {
      (<FormArray>this.newForm.controls['attributes']).at(i).get('valueType').setValue('StringList');
    }
    else {

      (<FormArray>this.newForm.controls['attributes']).at(i).get('valueType').setValue("String100");
      const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
      for (let i = control.length - 1; i >= 1; i--) { control.removeAt(i); }

      const opt = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(0).get('values') as FormArray
      for (let j = opt.length - 1; j >= 1; j--) { opt.removeAt(j); }
      control.at(i).reset();
    }
  }
}