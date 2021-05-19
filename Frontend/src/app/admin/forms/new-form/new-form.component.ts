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

  valueTypeList = [
    // {
    //   dataTypeName: "AlphaNum100",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "100",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "AlphanumSpecialChars200",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "200",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "Boolean",
    //   dataTypeValue: "boolean",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "Email",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    // // {
    // //   dataTypeName: "File",
    // //   dataTypeValue: "string",
    // //   datatypeCharLimit: "",
    // //   maxValue: ""
    // // },
    // {
    //   dataTypeName: "IP",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "Number",
    //   dataTypeValue: "number",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "Password",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "PositiveNumber",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "",
    //   maxValue: "",
    // },
    // {
    //   dataTypeName: "String2000",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "2000",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "String50",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "50",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "String100",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "100",
    //   maxValue: ""
    // },

    // {
    //   dataTypeName: "URL",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "AlphaNum100",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "100",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "AlphanumSpecialChars200",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "200",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "Boolean",
    //   dataTypeValue: "boolean",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    // {
    //   dataTypeName: "Email",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    // {
    ////   dataTypeName: "File",
    ////   dataTypeValue: "string",
    ////   datatypeCharLimit: "",
    ////   maxValue: ""
    //// },
    "IP", "Number", "Password", "PositiveNumber", "String2000", "String50", "String100", "URL", "AlphaNum100", "AlphanumSpecialChars200", "Boolean", "Email", "StringList"

  ];

  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.newForm = this.fb.group({
      formTitle: ['New Form'],
      formDescription: [''],
      attributes: this.fb.array([
        this.addAttributeGroup()
      ])
    });
  }

  ngAfterViewInit() {

    // this.expanded = true;
    this.cd.detectChanges();
  }

  addAttributeGroup(): FormGroup {

    return this.fb.group({

      attributeType: [''],
      // categoryOptions: this.fb.group({
      // this.addOptionGroup()
      categories: new FormArray([
        this.addCategoryGroup()
      ]),

      // }),
      helpText: [''],
      isRequired: [true],
      key: [''],
      label: ['New Attribute'],
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

  // addOptionGroup(): FormGroup {
  //   return this.formBuilder.group({
  //     options: [''],
  //   });
  // }

  // getOptions(form) {
  //   return form.controls['options'].controls;
  // }

  // addOptionButton(i, j) {
  //   const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('options') as FormArray;
  //   control.push(this.addOptionGroup());
  // }

  // removeOptions(i) {
  //   const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('options') as FormArray;
  //   control.removeAt(i);
  // }

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
      options: [''],
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

  onSave() {

    let formDataObj = JSON.parse(JSON.stringify(this.newForm.value));
    console.log("form data-->", formDataObj);
    let attributes = this.attributeObjFormation(formDataObj.attributes)
    // let attributeSchema = 
    // this.formSaveData.emit(data);
    // this.newForm.reset();
  }

  attributeObjFormation(list: Array<any>) {

    list.forEach(item => {
      // console.log("item-->", item);
      item.categoryOptions = {};
      if (item.attributeType == "OPTIONS") {
        item.categoryOptions.isMultipleChoice = item.isMultipleChoice;
        item.categoryOptions.categories = item.categories;
      }

      delete item.isMultipleChoice;
      delete item.categories;
    });

    console.log("list-->", list);
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

      const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray;
      for (let i = control.length - 1; i >= 1; i--) { control.removeAt(i); }

      const opt = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(0).get('values') as FormArray
      for (let j = opt.length - 1; j >= 1; j--) { opt.removeAt(j); }
      control.at(i).reset();
    }
  }
}