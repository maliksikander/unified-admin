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
  save = "save"
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
    this.validations = this.commonService.queueFormErrorMessages;
    let pageNumber = localStorage.getItem('currentQueuePage');
    if (pageNumber) this.p = pageNumber;

    this.queueForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9!@#$%^*_&()\\\"-]*$")]],
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

    this.queueForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.queueForm, this.formErrors, this.validations);
    });

    this.stepForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.stepForm, this.stepFormErrors, this.stepValidationMessages);
    });

    this.endPointService.readConfigJson().subscribe((e) => {
      this.getQueue();
    });
  }

  ValidateNameDuplication(control: AbstractControl) {
    return this.endPointService.get(this.reqServiceType).pipe(map(
      e => {
        const attr = e;
        if (!this.editData && (attr.find(e => e.name.toLowerCase() == control.value.toLowerCase()))) return { validName: true };
        if (this.editData && this.editData.length > 0) {
          const attr2 = attr;
          const index = attr2.findIndex(e => e.name == this.editData.name);
          attr2.splice(index, 1);
          if (attr2.find(e => e.name.toLowerCase() == control.value.toLowerCase())) return { validName: true };
        }
      }
    ));
  }

  addExpressionGroup(): FormGroup {
    return this.fb.group({
      preExpressionCondition: ["AND"],
      terms: new FormArray([
        this.addExpressionTermGroup()
      ])
    });
  }

  getExpressions(form) {
    return form.controls.expressions.controls;
  }

  addExpressionButton() {
    (<FormArray>this.stepForm.controls['expressions']).push(this.addExpressionGroup());
  }

  removeExpression(i) {
    const exp: any = this.stepForm.get('expressions')
    exp.removeAt(i);
  }

  addExpressionTermGroup(): FormGroup {
    return this.fb.group({
      routingAttribute: ['', Validators.required],
      conditionOperator: ['', Validators.required],
      profVal: [1],
      boolVal: ['true'],
      preTermCondition: ["AND"],
    });
  }

  getTerms(form) {
    return form.controls['terms'].controls;
  }

  addExpressionTermButton(i, j) {
    const exp: any = this.stepForm.get('expressions')
    const control = exp.controls[i].get('terms');
    control.push(this.addExpressionTermGroup());
  }

  removeTerm(i) {
    const exp: any = this.stepForm.get('expressions')
    const control: any = exp.controls[i].get('terms');
    const terms: any = control.controls;
    control.removeAt(i);
  }

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

  onClose(form) {
    this.dialog.closeAll();
    this.searchTerm = "";
    if (form == 'step') this.resetStepForm();
  }

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

  getQueue() {
    this.endPointService.get(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        console.log("queue res-->", res);
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

  updateQueue(data, id) {
    this.endPointService.update(data, id, this.reqServiceType).subscribe(
      (res: any) => {
        this.snackbar.snackbarMessage('success-snackbar', "Updated Successfully", 1);
        this.getQueue();
        this.dialog.closeAll();
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  editQueue(templateRef, data) {
    // console.log("queue-->", data);
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

  saveObjFormation() {
    const temp = this.queueForm.value;
    let data: any = {};
    data.name = temp.name;
    data.mrd = temp.mrd;
    data.agentSelectionCriteria = temp.agentCriteria;
    data.serviceLevelThreshold = temp.serviceLevelThreshold;
    data.serviceLevelType = temp.serviceLevelType;
    return data;
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

  // Queue Step //

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

  // expTermFormation(terms) {
  //   let exp: any = [];
  //   let k = 0;
  //   for (let j = 0; j < terms.length; j++) {
  //     let termObj: any = {
  //       AttributeName: "",
  //       AttributeId: "",
  //       conditionOperator: "",
  //       Value: ""
  //     };
  //     if (j == 0) {
  //       let term = this.termObjectFormation(terms, j, termObj);
  //       exp.splice(j, 0, term);
  //     }
  //     else {
  //       const val = terms[j].preTermCondition;
  //       k = k + 1;
  //       exp.splice(k, 0, val);
  //       let term = this.termObjectFormation(terms, j, termObj);
  //       k = k + 1;
  //       exp.splice(k, 0, term);
  //     }
  //   }
  //   return exp;
  // }

  // termObjectFormation(terms, j, termObject) {
  //   let termObj = termObject;
  //   termObj.AttributeName = terms[j].routingAttribute.name;
  //   termObj.conditionOperator = terms[j].conditionOperator;
  //   termObj.AttributeId = terms[j].routingAttribute.id;
  //   if (terms[j].routingAttribute.type == 'BOOLEAN') { termObj.Value = terms[j].boolVal; }
  //   else { termObj.Value = terms[j].profVal; }
  //   return termObj;
  // }

  manipulateExpTerm(data) {

    let expressions = JSON.parse(JSON.stringify(data.expressions));
    for (let i = 0; i < expressions.length; i++) {
      let termsCopy = JSON.parse(JSON.stringify(expressions[i].terms));
      expressions[0].preExpressionCondition = 'null';
      for (let j = 0; j < termsCopy.length; j++) {
        let termObj: any = {
          routingAttribute: "",
          conditionOperator: "",
          value: "",
          preTermCondition: ""
        };
        termsCopy[0].preTermCondition = 'null';
        termObj.routingAttribute = termsCopy[j].routingAttribute.id;
        termObj.conditionOperator = termsCopy[j].conditionOperator;
        termObj.preTermCondition = termsCopy[j].preTermCondition;
        if (termsCopy[j].routingAttribute.type == 'BOOLEAN') {
          termObj.value = termsCopy[j].boolVal;
        }
        else {
          termObj.value = termsCopy[j].profVal;
        }
        termsCopy[j] = termObj;
      }
      expressions[i].terms = termsCopy;

    }
    data.expressions = expressions;
    return data;
    
  }

  onStepSave(i, mode) {
    this.spinner = true;
    const formData = JSON.parse(JSON.stringify(this.stepForm.value));
    let newStep = this.manipulateExpTerm(formData);
 
    let data = JSON.parse(JSON.stringify(this.queueData[i]));
    if (mode.mode == 'update') {
      newStep.id = mode.id;
      let stepIndex = data.steps.findIndex(x => x.id == mode.id);
      if (stepIndex != -1) {
        data.steps[stepIndex] = newStep;
      }
    }
    else {
      data.steps.push(newStep);
    }

    // console.log("queue data-->",data);
    this.updateQueue(data, data.id);
    this.resetStepForm();

  }

  reconstructExpTermGroup(expTerm, termObj) {
    const temp = this.attrData.filter(item => item.id == expTerm.AttributeId);
    termObj.attribute = temp[0];
    termObj.conditionOperator = expTerm.conditionOperator;
    if (expTerm.Value == "true" || expTerm.Value == "false") {
      termObj.boolVal = expTerm.Value;
    }
    else {
      termObj.profVal = expTerm.Value;
    }
    return termObj;
  }


  reconstructExpTerm(expTerm, formData) {
    for (let j = 0; j < expTerm.length; j++) {
      let k = 0;
      let term = {
        routingAttribute: {},
        conditionOperator: "",
        profVal: 1,
        boolVal: "true",
        preTermCondition: "AND"
      }
      if (j == 0) {
        let termResult = this.reconstructExpTermGroup(expTerm[j], term);
        formData.terms.push(termResult);
      }
      else {
        if (j % 2 != 0) {
          k = j + 1;
          term.preTermCondition = expTerm[j];
          let termResult = this.reconstructExpTermGroup(expTerm[k], term)
          formData.terms.push(termResult);
        }
      }
    }
    return formData;
  }

  reconstructFormExpression(temp) {
    let formData: any = [];
    for (let i = 0; i < temp.length; i++) {
      let formDataExpression: any = {
        preExpressionCondition: "AND",
        terms: []
      }
      let a = 0;
      if (i == 0) {
        formDataExpression.preExpressionCondition = "AND";
        let expTerm = temp[i].expression;
        let result = this.reconstructExpTerm(expTerm, formDataExpression);
        formData.push(result);
      }
      else {
        if (i % 2 != 0) {
          a = i + 1;
          formDataExpression.preExpressionCondition = temp[i];
          let expTerm = temp[a].expression;
          let result = this.reconstructExpTerm(expTerm, formDataExpression);
          formData.push(result);
        }
      }
    }
    return formData;
  }


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


  editStep(templateRef, data, i) {
    this.stepFormHeading = 'Edit Step';
    this.stepSaveBtnText = 'Update';
    let stepData: any = {};
    console.log("data to be edited-->", data);
    stepData.timeout = JSON.parse(JSON.stringify(data.timeout));
    let temp = JSON.parse(JSON.stringify(data.expressions));
    const control = <FormArray>this.stepForm.controls['expressions'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
    stepData.expressions = this.reconstructFormExpression(temp);
    console.log("step data-->", stepData)
    // this.loadFormExpression(stepData);
    let dialogRef = this.dialog.open(templateRef, {
      width: '800px',
      // height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,

    });
    let mode = {
      mode: "update",
      id: data.id
    }
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'save') {
        // this.onStepSave(i, mode)
      }
      else {
        this.resetStepForm();
        this.stepForm.reset();
      }
    });

  }


  updateQueueStep(queue) {
    this.endPointService.update(queue, queue.id, this.reqServiceType).subscribe(
      (res: any) => {
        this.snackbar.snackbarMessage('success-snackbar', "Updated Successfully", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
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

  deleteStep(stepData, i) {
    let steps = this.queueData[i].steps;
    let queue = this.queueData[i]

    if (steps && steps.length > 0) {
      this.queueData[i].steps = this.queueData[i].steps.filter(i => i !== stepData)
        .map((i, idx) => (i.position = (idx + 1), i));
      this.updateQueueStep(queue);

    }
  }

  resetStepForm() {
    this.stepForm.reset();
    const control = <FormArray>this.stepForm.controls['expressions'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.addExpressionButton();
  }

  pageChange(e) {
    localStorage.setItem('currentQueuePage', e);
  }

  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('currentQueuePage', e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }



}