import { Component, OnInit } from '@angular/core';
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
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.validations = this.commonService.queueFormErrorMessages;
    let pageNumber = localStorage.getItem('currentQueuePage');
    if (pageNumber) this.p = pageNumber;

    this.queueForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9!@#$%^*_&()\\\"-]*$")], this.ValidateNameDuplication.bind(this)],
      mrd: ['', [Validators.required]],
      agentCriteria: ['', [Validators.required]],
      serviceLevelType: ['', [Validators.required]],
      serviceLevelThreshold: ['', [Validators.required, Validators.min(1)]],
    });

    this.stepForm = this.formBuilder.group({
      timeout: ['', [Validators.required]],
      expression: this.formBuilder.array([
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
    // return null;
  }

  addExpressionGroup(): FormGroup {
    return this.formBuilder.group({
      expressionConditonal: ["AND"],
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
    return this.formBuilder.group({
      attribute: [''],
      operator: [''],
      profVal: [1],
      boolVal: ["true"],
      conditionalVal: ["AND"],
    });
  }

  getTerms(form) {
    return form.controls['terms'].controls;
  }

  addExpressionTermButton(i, j) {
    // console.log("exp-->", i, "<--term-->", j);
    const exp: any = this.stepForm.get('expression')
    const control = exp.controls[i].get('terms');
    control.push(this.addExpressionTermGroup());
    // if (this.attrData && this.attrData.length > 0) {
    //   control.controls[j].get('attribute').setValue(this.attrData[0]);
    //   if (this.attrData[0].type == 'Boolean') { control.controls[j + 1].get('operator').setValue(this.boolOperatorList[0]); }
    //   else { control.controls[i].get('operator').setValue(this.operatorList[0]); }
    // }
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
    // console.log("edit Data-->", data);
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
        console.log("delete res -->", res);
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
      this.updateQueue(data, data._id);
    }
    else { this.createQueue(data); }
  }

  openStepModal(templateRef) {

    if (this.attrData && this.attrData.length > 0) {
      const exp: any = this.stepForm.get('expression')
      const control: any = exp.controls[0].get('terms');
      // console.log('step form-->', control);
      control.controls[0].get('attribute').setValue(this.attrData[0]);
      if (this.attrData[0].type == 'Boolean') {
        control.controls[0].get('operator').setValue(this.boolOperatorList[0]);
      }
      else {
        control.controls[0].get('operator').setValue(this.operatorList[0]);
      }
    }

    let dialogRef = this.dialog.open(templateRef, {
      width: '800px',
      // height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {

      this.resetStepForm();
      //   const arr = new FormArray([
      //     new FormControl(),
      //     new FormControl()
      //  ]);
      // console.log("res-->", res);  //
      // const arr:any = <FormArray>this.stepForm.controls['expression'];

      // while (arr.length !== 0) {
      // arr.removeAt(0)
      // }
      // arr.setValue( this.addExpressionGroup());
      // this.stepForm.reset();
      // console.log("step from--->", this.stepForm.value);

    });
  }

  editStep(data) { }

  deleteStep(data) { }

  resetStepForm() {
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
}