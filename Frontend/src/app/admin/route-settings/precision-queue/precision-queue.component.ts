import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-precision-queue',
  templateUrl: './precision-queue.component.html',
  styleUrls: ['./precision-queue.component.scss']
})
export class PrecisionQueueComponent implements OnInit {
  stepSaveBtnText = "Add";
  spinner: any = true;
  save = "save";
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  searchTerm = '';
  formErrors = {
    name: '',
    mrd: '',
    agentCriteria: '',
    serviceLevelType: '',
    serviceLevelThreshold: '',
  };
  validations;
  agentCriteria = ['longest available', 'most skilled', 'least skilled'];
  conditionList = ["AND", "OR"]
  reqServiceType = 'precision-queues';
  formHeading = 'Add New Queue';
  saveBtnText = 'Create';
  mrdData = [];
  queueData: any = [];
  attrData = [];
  editData: any;
  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '200px';
  stepFormHeading = 'Add Step';
  operatorList = ["==", "!=", "<", "<=", ">", ">="];
  boolOperatorList = ["==", "!="];
  stepValidationMessages = {
    'timeout': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Max 40 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'expression': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    }

  };
  stepFormErrors = {
    timeout: '',
    expression: '',
  };
  queueForm: FormGroup;
  stepForm: FormGroup;

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();

    //setting local form validation messages 
    this.validations = this.commonService.queueFormErrorMessages;

    let pageNumber = localStorage.getItem('currentQueuePage');
    if (pageNumber) this.p = pageNumber;

    this.queueForm = this.fb.group({
      name: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9!@#$%^*_&()\\\"-]*$")]],
      mrd: ['', [Validators.required]],
      agentCriteria: ['', [Validators.required]],
      serviceLevelType: ['', [Validators.required]],
      serviceLevelThreshold: ['', [Validators.required, Validators.min(1)]],
    });

    this.stepForm = this.fb.group({
      timeout: ['', [Validators.required]],
      expressions: this.fb.array([
        this.addExpressionGroup()
      ])
    });

    //checking for PQ form validation failures
    this.queueForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.queueForm, this.formErrors, this.validations);
    });

    //checking for Step form validation failures
    this.stepForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.stepForm, this.stepFormErrors, this.stepValidationMessages);
    });

    this.getQueue();
  }

  //creating expression form array object
  addExpressionGroup(): FormGroup {
    return this.fb.group({
      preExpressionCondition: ["AND"],
      terms: new FormArray([
        this.addExpressionTermGroup()
      ])
    });
  }

  //to get 'expression' form control 
  getExpressions(form) {
    return form.controls.expressions.controls;
  }

  // to add 'expression' group
  addExpressionButton() {
    (<FormArray>this.stepForm.controls['expressions']).push(this.addExpressionGroup());
  }

  // to remove 'expression' group 
  removeExpression(i) {
    const exp: any = this.stepForm.get('expressions')
    exp.removeAt(i);
  }

  // to add 'expression term' group 
  addExpressionTermGroup(): FormGroup {
    return this.fb.group({
      routingAttribute: ['', Validators.required],
      conditionOperator: ['', Validators.required],
      profVal: [1],
      boolVal: ['true'],
      preTermCondition: ["AND"],
    });
  }

  //to get 'expression' form control
  getTerms(form) {
    return form.controls['terms'].controls;
  }

  //to add 'expression term' form group
  addExpressionTermButton(i, j) {
    const exp: any = this.stepForm.get('expressions')
    const control = exp.controls[i].get('terms');
    control.push(this.addExpressionTermGroup());
  }

  // to remove 'expression' group 
  removeTerm(i) {
    const exp: any = this.stepForm.get('expressions')
    const control: any = exp.controls[i].get('terms');
    const terms: any = control.controls;
    control.removeAt(i);
  }

  //to open form dialog,this method accepts the `template variable` as a parameter assigned to the form in html.
  openModal(templateRef) {
    this.queueForm.reset();
    let dialogRef = this.dialog.open(templateRef, {
      width: '550px',
      height: '400px',
      panelClass: 'add-attribute',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  //resetting  dialog
  onClose(form) {
    this.dialog.closeAll();
    this.searchTerm = "";
    if (form == 'step') this.resetStepForm();
  }

  //to get MRD list and set the local variable with the response
  getMRD() {
    this.endPointService.get('media-routing-domains').subscribe(
      (res: any) => {
        this.spinner = false;
        this.mrdData = res;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to get attribute list and set the local variable with the response 
  getAttribute() {
    this.endPointService.get('routing-attributes').subscribe(
      (res: any) => {
        this.spinner = false;
        this.attrData = res;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to create PQ and it accepts `data` object as parameter with following properties (name:string, mrd:object, agentSelectcriteria:string, serviceLevelType:string ,serviceLevelThreshold:number)
  //and update the local list
  createQueue(data) {
    this.endPointService.create(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.getQueue();
        this.snackbar.snackbarMessage('success-snackbar', "Created Successfully", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to get PQ list and set the local variable with the response 
  getQueue() {
    this.endPointService.get(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        this.queueData = res;
        if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
        this.getMRD();
        this.getAttribute();
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to update PQ and it accepts `data` object & `id` as parameter,`data` object (name:string, mrd:object, agentSelectcriteria:string, serviceLevelType:string ,serviceLevelThreshold:number)
  //and updating the local list with the success response object
  updateQueue(data, id) {

    this.endPointService.update(data, id, this.reqServiceType).subscribe(
      (res: any) => {
        if (res.id) {
          let queue = this.queueData.find(item => item.id == res.id);
          let index = this.queueData.indexOf(queue);
          this.queueData[index] = res;
          this.snackbar.snackbarMessage('success-snackbar', "Queue Updated Successfully", 1);
        }
        this.dialog.closeAll();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to edit PQ,it accepts `templateRef' & `data` object as parameter,`data` object (name:string, mrd:object, agentSelectcriteria:string, serviceLevelType:string ,serviceLevelThreshold:number)
  //and patches the existing values with form controls and opens the form dialog
  editQueue(templateRef, data) {
    const mrdIndex = this.mrdData.findIndex(item => item.id == data.mrd.id);
    this.editData = data;
    this.queueForm.patchValue({
      name: data.name,
      agentCriteria: data.agentSelectionCriteria,
      mrd: this.mrdData[mrdIndex],
      serviceLevelThreshold: data.serviceLevelThreshold,
      serviceLevelType: data.serviceLevelType,
    });
    this.formHeading = 'Edit Queue';
    this.saveBtnText = 'Update'
    let dialogRef = this.dialog.open(templateRef, {
      width: '550px',
      height: '400px',
      panelClass: 'add-attribute',
      disableClose: true,
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.editData = undefined;
    });
  }

  //to delete PQ and it accepts `data` object & `id` as parameter,`data` object (name:string, mrd:object, agentSelectcriteria:string, serviceLevelType:string ,serviceLevelThreshold:number)
  //and to update the local list when the operation is successful
  deleteQueue(data, id) {
    this.endPointService.delete(id, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        this.queueData = this.queueData.filter(i => i !== data)
          .map((i, idx) => (i.position = (idx + 1), i));
        this.snackbar.snackbarMessage('success-snackbar', "Deleted Successfully", 1);
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //delete confirmation dialog with PQ object as `data` parameter
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this Queue ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Queue",
        message: msg,
        text: 'confirm',
        data: data
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') { this.deleteQueue(data, id); }
      else { this.spinner = false; }
    });
  }

  //Object formation for request body 
  saveObjFormation() {
    const temp = this.queueForm.value;
    let data: any = {
      mrd: {}
    };
    data.name = temp.name;
    data.mrd.id = temp.mrd.id;
    data.agentSelectionCriteria = temp.agentCriteria;
    data.serviceLevelThreshold = temp.serviceLevelThreshold;
    data.serviceLevelType = temp.serviceLevelType;
    return data;
  }

  //  Step Functions //

  //to open step form dialog,this method accepts the `templateRef` as a parameter assigned to the form in html and index of the PQ in the list as 'i'.
  openStepModal(templateRef, i) {
    this.stepFormHeading = 'Add Step';
    this.stepSaveBtnText = 'Add';
    let dialogRef = this.dialog.open(templateRef, {
      width: '800px',
      // height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,
    });
    let mode = {
      mode: "new",
    }
    dialogRef.afterClosed().subscribe(res => {

      if (res == 'save') {
        this.onStepSave(i, mode)
      }
      else {
        this.resetStepForm();
        this.stepForm.reset();
      }
    });
  }

  //Updating form object to match required structure
  manipulateExpTerm(data) {
    let expressions = JSON.parse(JSON.stringify(data.expressions));
    for (let i = 0; i < expressions.length; i++) {
      let termsCopy = JSON.parse(JSON.stringify(expressions[i].terms));
      expressions[0].preExpressionCondition = 'null';
      for (let j = 0; j < termsCopy.length; j++) {
        let termObj: any = {
          routingAttribute: {},
          conditionOperator: "",
          value: "",
          preTermCondition: ""
        };
        termsCopy[0].preTermCondition = 'null';
        termObj.routingAttribute = termsCopy[j].routingAttribute;
        termObj.conditionOperator = termsCopy[j].conditionOperator;
        termObj.preTermCondition = termsCopy[j].preTermCondition;
        if (termsCopy[j].routingAttribute.type == 'BOOLEAN') {
          termObj.value = termsCopy[j].boolVal;
        }
        else {
          termObj.value = JSON.stringify(termsCopy[j].profVal);
        }
        termsCopy[j] = termObj;
      }
      expressions[i].terms = termsCopy;

    }
    data.expressions = expressions;
    return data;

  }

  //saving queue step, it accepts index of PQ object as 'i' and saving mode i.e either create or update as 'mode' 
  onStepSave(i, mode) {
    this.spinner = true;
    const formData = JSON.parse(JSON.stringify(this.stepForm.value));
    let newStep = this.manipulateExpTerm(formData);
    let data: any = {
      mrd: {}
    };
    let temp = JSON.parse(JSON.stringify(this.queueData[i]));
    data.agentSelectionCriteria = temp.agentSelectionCriteria;
    data.id = temp.id;
    data.mrd.id = temp.mrd.id;
    data.name = temp.name;
    data.serviceLevelThreshold = temp.serviceLevelThreshold;
    data.serviceLevelType = temp.serviceLevelType;
    data.steps = temp.steps;

    if (mode.mode == 'update') {
      let stepIndex = data.steps.findIndex(x => x.id == mode.id);
      if (stepIndex != -1) {
        data.steps[stepIndex] = newStep;
      }
    }
    else {
      data.steps.push(newStep);
    }
    this.updateQueue(data, data.id);
    this.resetStepForm();

  }

  //Updating reponse object to match required form object structure
  reconstructFormData(data) {

    let expressions = JSON.parse(JSON.stringify(data.expressions));
    for (let i = 0; i < expressions.length; i++) {
      let termsCopy = JSON.parse(JSON.stringify(expressions[i].terms));
      for (let j = 0; j < termsCopy.length; j++) {
        let termObj = {
          routingAttribute: {},
          conditionOperator: "",
          profVal: 1,
          boolVal: "true",
          preTermCondition: "AND"
        }
        const temp = this.attrData.filter(item => item.id == termsCopy[j].routingAttribute.id);
        termObj.conditionOperator = termsCopy[j].conditionOperator;
        termObj.routingAttribute = temp[0];
        termObj.preTermCondition = termsCopy[j].preTermCondition;

        if (termsCopy[j].routingAttribute.type == 'BOOLEAN') {
          termObj.boolVal = termsCopy[j].value;
        }
        else {
          termObj.profVal = JSON.parse(termsCopy[j].value);
        }
        termsCopy[j] = termObj;
      }
      expressions[i].terms = termsCopy;

    }

    data.expressions = expressions;
    return data;

  }

  // loading updated response object to form
  loadFormExpression(data) {
    //create lines array first
    for (let i = 0; i < data.expressions.length; i++) {
      const expFormArray = this.stepForm.get("expressions") as FormArray;
      expFormArray.push(this.expression);
      for (let term = 0; term < data.expressions[i].terms.length; term++) {
        const termsFormsArray = expFormArray.at(i).get("terms") as FormArray;
        termsFormsArray.push(this.term);
      }
    }
    this.stepForm.setValue(data);
  }

  //to edit PQ,it accepts `templateRef' & Step object as `data` and PQ object index as 'i' as parameter
  //and patches the existing values with form controls and opens the form dialog
  editStep(templateRef, data, i) {
    this.stepFormHeading = 'Edit Step';
    this.stepSaveBtnText = 'Update';
    let temp = JSON.parse(JSON.stringify(data));
    const control = <FormArray>this.stepForm.controls['expressions'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
    let stepData = this.reconstructFormData(temp);
    let tempStep: any = {};
    tempStep.expressions = stepData.expressions;
    tempStep.timeout = stepData.timeout;
    this.loadFormExpression(tempStep);
    let dialogRef = this.dialog.open(templateRef, {
      width: '800px',
      // height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,

    });
    let mode = {
      mode: "update",
    }
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'save') {
        this.onStepSave(i, mode)
      }
      else {
        this.resetStepForm();
      }
    });

  }

  get term(): FormGroup {
    return this.fb.group({
      routingAttribute: [''],
      conditionOperator: [''],
      profVal: [1],
      boolVal: ['true'],
      preTermCondition: ["AND"],
    });
  }

  get expression(): FormGroup {
    return this.fb.group({
      preExpressionCondition: ["AND"],
      terms: new FormArray([
      ])
    });
  }

  //delete confirmation dialog with mrd object as `data` parameter
  deleteStepConfirm(stepData, i) {
    let msg = "Are you sure you want to delete this Step ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Step",
        message: msg,
        text: 'confirm',
        stepData: stepData,
        i: i
      }
    }).afterClosed().subscribe((res: any) => {
      if (res === 'delete') this.deleteStep(stepData, i);
    });
  }

  //to remove step and it accepts step object as 'stepData' & PQ object index as `i` parameter
  //and to update the local list when the operation is successful
  deleteStep(stepData, i) {

    let steps = this.queueData[i].steps;
    let queue = this.queueData[i];
    if (steps && steps.length > 0) {
      this.spinner = true;
      this.queueData[i].steps = this.queueData[i].steps.filter(i => i !== stepData)
        .map((i, idx) => (i.position = (idx + 1), i));
      this.updateQueue(queue, queue.id);

    }
  }

  // to reset step form after dialog close
  resetStepForm() {
    this.stepForm.reset();
    const control = <FormArray>this.stepForm.controls['expressions'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.addExpressionButton();
  }

  onSave() {
    this.spinner = true;
    let data = this.saveObjFormation();
    if (this.editData) {
      data.id = this.editData.id;
      data.steps = this.editData.steps;
      this.updateQueue(data, data.id);
    }
    else { this.createQueue(data); }
  }

  pageChange(e) { localStorage.setItem('currentQueuePage', e); }

  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('currentQueuePage', e);
  }

  selectPage() { this.itemsPerPage = this.selectedItem; }

  // progress bar setting
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

}