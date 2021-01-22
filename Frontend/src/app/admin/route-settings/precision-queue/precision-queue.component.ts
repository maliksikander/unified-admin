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
  reqServiceType = 'pqueue';
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
      expression: this.fb.array([
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
        if (!this.editData && (attr.find(e => e.Name.toLowerCase() == control.value.toLowerCase()))) return { validName: true };
        if (this.editData && this.editData.length > 0) {
          const attr2 = attr;
          const index = attr2.findIndex(e => e.Name == this.editData.Name);
          attr2.splice(index, 1);
          if (attr2.find(e => e.Name.toLowerCase() == control.value.toLowerCase())) return { validName: true };
        }
      }
    ));
  }

  addExpressionGroup(): FormGroup {
    return this.fb.group({
      expressionConditional: ["AND"],
      terms: new FormArray([
        this.addExpressionTermGroup()
      ])
    });
  }

  getExpressions(form) {
    return form.controls.expression.controls;
  }

  addExpressionButton() {
    (<FormArray>this.stepForm.controls['expression']).push(this.addExpressionGroup());
  }

  removeExpression(i) {
    const exp: any = this.stepForm.get('expression')
    exp.removeAt(i);
  }

  addExpressionTermGroup(): FormGroup {
    return this.fb.group({
      attribute: ['', Validators.required],
      operator: ['', Validators.required],
      profVal: [1],
      boolVal: ['true'],
      conditionalVal: ["AND"],
    });
  }

  getTerms(form) {
    return form.controls['terms'].controls;
  }

  addExpressionTermButton(i, j) {
    const exp: any = this.stepForm.get('expression')
    const control = exp.controls[i].get('terms');
    control.push(this.addExpressionTermGroup());
  }

  removeTerm(i) {
    const exp: any = this.stepForm.get('expression')
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
    this.endPointService.get('mrd').subscribe(
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
    this.endPointService.get('attribute').subscribe(
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
        // console.log("queue res-->", res);
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
    const mrdIndex = this.mrdData.findIndex(item => item._id == data.mrd._id);
    this.editData = data;
    this.queueForm.patchValue({
      name: data.Name,
      agentCriteria: data.AgentSelectionCriteria,
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
    let id = data._id;
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
    data.Name = temp.name;
    data.mrd = temp.mrd;
    data.AgentSelectionCriteria = temp.agentCriteria;
    data.serviceLevelThreshold = temp.serviceLevelThreshold;
    data.serviceLevelType = temp.serviceLevelType;
    return data;
  }

  onSave() {
    this.spinner = true;
    let data = this.saveObjFormation();
    if (this.editData) {
      data._id = this.editData._id;
      data.Steps = this.editData.Steps;
      this.updateQueue(data, data._id);
    }
    else { this.createQueue(data); }
  }

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

  expTermFormation(terms) {
    let exp: any = [];
    let k = 0;
    for (let j = 0; j < terms.length; j++) {
      let termObj: any = {
        AttributeName: "",
        ConditionOperator: "",
        Value: ""
      };
      if (j == 0) {
        let term = this.termObjectFormation(terms, j, termObj);
        exp.splice(j, 0, term);
      }
      else {
        const val = terms[j].conditionalVal;
        k = k + 1;
        exp.splice(k, 0, val);
        let term = this.termObjectFormation(terms, j, termObj);
        k = k + 1;
        exp.splice(k, 0, term);
      }
    }
    return exp;
  }

  termObjectFormation(terms, j, termObject) {
    let termObj = termObject;
    termObj.AttributeName = terms[j].attribute.name;
    termObj.ConditionOperator = terms[j].operator;
    if (terms[j].attribute.type == 'Boolean') { termObj.Value = terms[j].boolVal; }
    else { termObj.Value = terms[j].profVal; }
    return termObj;
  }

  expressionFormation(expressions) {
    let a = 0;
    let expressionsArray: any = []
    for (let i = 0; i < expressions.length; i++) {
      let terms = expressions[i].terms;
      let k = 0;
      if (i == 0) {
        let temp = { expression: this.expTermFormation(terms) };
        expressionsArray.splice(k, 0, temp);
      }
      else {
        const val = expressions[i].expressionConditional;
        a = a + 1;
        expressionsArray.splice(a, 0, val);
        a = a + 1;
        let temp = { expression: this.expTermFormation(terms) };
        expressionsArray.splice(a, 0, temp);
      }
    }
    return expressionsArray;

  }

  onStepSave(i, mode) {
    this.spinner = true;
    let newStep: any = {
      step: {
        expressions: [],
        timeout: "",
      }
    };
    newStep.step.timeout = this.stepForm.value.timeout;
    const expressions = this.stepForm.value.expression;
    let expArray = this.expressionFormation(expressions);
    newStep.step.expressions = expArray;
    let data = JSON.parse(JSON.stringify(this.queueData[i]));
    if (mode.mode == 'update') {
      newStep._id = mode._id;
      let stepIndex = data.Steps.findIndex(x => x._id == mode._id);
      if (stepIndex != -1) {
        data.Steps[stepIndex] = newStep;
      }
    }
    else {
      data.Steps.push(newStep);
    }
    this.updateQueue(data, data._id);
    this.resetStepForm();

  }

  reconstructExpTermGroup(expTerm, termObj) {
    const temp = this.attrData.filter(item => item.name == expTerm.AttributeName);
    termObj.attribute = temp[0];
    termObj.operator = expTerm.ConditionOperator;
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
        attribute: {},
        operator: "",
        profVal: 1,
        boolVal: "true",
        conditionalVal: "AND"
      }
      if (j == 0) {
        let termResult = this.reconstructExpTermGroup(expTerm[j], term);
        formData.terms.push(termResult);
      }
      else {
        if (j % 2 != 0) {
          k = j + 1;
          term.conditionalVal = expTerm[j];
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
        expressionConditional: "AND",
        terms: []
      }
      let a = 0;
      if (i == 0) {
        formDataExpression.expressionConditional = "AND";
        let expTerm = temp[i].expression;
        let result = this.reconstructExpTerm(expTerm, formDataExpression);
        formData.push(result);
      }
      else {
        if (i % 2 != 0) {
          a = i + 1;
          formDataExpression.expressionConditional = temp[i];
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
    for (let i = 0; i < data.expression.length; i++) {
      const expFormArray = this.stepForm.get("expression") as FormArray;
      expFormArray.push(this.expression);
      for (let term = 0; term < data.expression[i].terms.length; term++) {
        const termsFormsArray = expFormArray.at(i).get("terms") as FormArray;
        termsFormsArray.push(this.term);
      }
    }
    this.stepForm.setValue(data);
  }


  editStep(templateRef, stepData, i) {
    this.stepFormHeading = 'Edit Step';
    this.stepSaveBtnText = 'Update';
    let mreData: any = {};
    mreData.timeout = JSON.parse(JSON.stringify(stepData.step.timeout));
    let temp = JSON.parse(JSON.stringify(stepData.step.expressions));
    const control = <FormArray>this.stepForm.controls['expression'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
    mreData.expression = this.reconstructFormExpression(temp);
    this.loadFormExpression(mreData);
    let dialogRef = this.dialog.open(templateRef, {
      width: '800px',
      // height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,

    });
    let mode = {
      mode: "update",
      _id: stepData._id
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
    let Steps = this.queueData[i].Steps;
    let queue = this.queueData[i]

    if (Steps && Steps.length > 0) {
      this.queueData[i].Steps = this.queueData[i].Steps.filter(i => i !== stepData)
        .map((i, idx) => (i.position = (idx + 1), i));

      this.updateQueueStep(queue);

    }



  }

  resetStepForm() {
    this.stepForm.reset();
    const control = <FormArray>this.stepForm.controls['expression'];
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

  updateQueueStep(queue) {
    this.endPointService.update(queue, queue._id, this.reqServiceType).subscribe(
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
      attribute: [''],
      operator: [''],
      profVal: [1],
      boolVal: ['true'],
      conditionalVal: ["AND"],
    });
  }

  get expression(): FormGroup {
    return this.fb.group({
      expressionConditional: ["AND"],
      terms: new FormArray([
      ])
    });
  }

}