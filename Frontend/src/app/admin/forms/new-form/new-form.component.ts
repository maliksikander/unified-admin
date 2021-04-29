import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CdkDragDrop, moveItemInArray, CdkDrag } from "@angular/cdk/drag-drop";
@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss']
})
export class NewFormComponent implements OnInit {

  @Input() uiBool;
  @Input() formData;
  @Output() uiBoolChange = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  newForm: FormGroup;
  customCollapsedHeight: string = '40px';
  expanded: boolean = false;
  // customExpandedHeight: string = '200px';


  typeList = [

    {
      typeName: "Category Based Value",
      typeValue: "CATEGORY_BASED_VALUE"
    },
    {
      typeName: "Multiple Choice",
      typeValue: "MULTIPLE_CHOICE"
    },
    {
      typeName: "Single Choice",
      typeValue: "SINGLE_CHOICE"
    },
    {
      typeName: "Text Answer",
      typeValue: "TEXT_ANSWER"
    },
  ];

  datatypeList = [
    {
      dataTypeName: "AlphaNum100",
      dataTypeValue: "string",
      datatypeCharLimit: "100",
      maxValue: ""
    },
    {
      dataTypeName: "AlphanumSpecialChars200",
      dataTypeValue: "string",
      datatypeCharLimit: "200",
      maxValue: ""
    },
    {
      dataTypeName: "Boolean",
      dataTypeValue: "boolean",
      datatypeCharLimit: "",
      maxValue: ""
    },
    {
      dataTypeName: "Email",
      dataTypeValue: "string",
      datatypeCharLimit: "",
      maxValue: ""
    },
    // {
    //   dataTypeName: "File",
    //   dataTypeValue: "string",
    //   datatypeCharLimit: "",
    //   maxValue: ""
    // },
    {
      dataTypeName: "IP",
      dataTypeValue: "string",
      datatypeCharLimit: "",
      maxValue: ""
    },
    {
      dataTypeName: "Number",
      dataTypeValue: "number",
      datatypeCharLimit: "",
      maxValue: ""
    },
    {
      dataTypeName: "Password",
      dataTypeValue: "string",
      datatypeCharLimit: "",
      maxValue: ""
    },
    {
      dataTypeName: "PositiveNumber",
      dataTypeValue: "string",
      datatypeCharLimit: "",
      maxValue: "",
    },
    {
      dataTypeName: "String2000",
      dataTypeValue: "string",
      datatypeCharLimit: "2000",
      maxValue: ""
    },
    {
      dataTypeName: "String50",
      dataTypeValue: "string",
      datatypeCharLimit: "50",
      maxValue: ""
    },
    {
      dataTypeName: "String100",
      dataTypeValue: "string",
      datatypeCharLimit: "100",
      maxValue: ""
    },

    {
      dataTypeName: "URL",
      dataTypeValue: "string",
      datatypeCharLimit: "",
      maxValue: ""
    },
  ];

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit(): void {


    this.newForm = this.formBuilder.group({
      formTitle: [''],
      formDescription: [''],
      attributes: this.formBuilder.array([
        this.addAttributeGroup()
      ])
    });
  }

  addAttributeGroup(): FormGroup {
    return this.formBuilder.group({
      attributeName: ['New Attribute'],
      categories: new FormArray([
        this.addCategoryGroup()
      ]),
      datatype: [''],
      description: ['This is helping text'],
      options: new FormArray([
        this.addOptionGroup()
      ]),
      required: [''],
      type: [''],

    });
  }

  getAttribute(form) {
    return form.controls.attributes.controls;
  }

  addAttributeButton() {
    (<FormArray>this.newForm.controls['attributes']).push(this.addAttributeGroup());
  }

  removeAttribute(i) {
    const attribute: any = this.newForm.get('attributes')
    attribute.removeAt(i);
    this.expanded = !this.expanded;
  }

  addOptionGroup(): FormGroup {
    return this.formBuilder.group({
      options: [''],
    });
  }

  getOptions(form) {
    return form.controls['options'].controls;
  }

  addOptionButton(i, j) {
    const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('options') as FormArray;
    control.push(this.addOptionGroup());
  }

  removeOptions(i) {
    const control = (<FormArray>this.newForm.controls['attributes']).at(i).get('options') as FormArray;
    control.removeAt(i);
  }

  addCategoryGroup(): FormGroup {
    return this.formBuilder.group({
      categoryName: [''],
      categoryOptions: new FormArray([
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
    return this.formBuilder.group({
      options: [''],
    });
  }

  getCategoryOptions(form, j) {
    return form.controls['categories'].controls[j].controls['categoryOptions'].controls;
  }

  addCategoryOptionButton(i, j) {
    const control = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(j).get('categoryOptions') as FormArray;
    control.push(this.addCategoryOptionGroup());
  }

  removeCategoryOption(i, j, k) {
    const control = ((<FormArray>this.newForm.controls['attributes']).at(i).get('categories') as FormArray).at(j).get('categoryOptions') as FormArray;
    control.removeAt(j);
  }


  ngOnChanges(changes: SimpleChanges) { }

  onClose() {
    this.uiBoolChange.emit(!this.uiBool);
    // this.botSettingForm.reset();
  }

  onRequiredToggleChange(e) { }

  panelExpanded() {

    this.expanded = !this.expanded;
    // console.log("yo-->")
  }

  onSave() { }


  sortPredicate(index: number, item: CdkDrag<number>) {
    return (index + 1) % 2 === item.data % 2;
  }

  drop(event: CdkDragDrop<string[]>) {
    let d = this.getAttribute(this.newForm);
    // console.log("d-->", d);
    // console.log("drop--->", event)
    // this.editGroup = data;
    // moveItemInArray(this.getAttribute(this.newForm), event.previousIndex, event.currentIndex);
    moveItemInArray(d, event.previousIndex, event.currentIndex);
    // console.log("d-->", d);
  }

}


