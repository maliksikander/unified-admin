import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-precision-queue",
  templateUrl: "./precision-queue.component.html",
  styleUrls: ["./precision-queue.component.scss"],
})
export class PrecisionQueueComponent implements OnInit, AfterViewInit {
  stepSaveBtnText = "Add";
  spinner: any = true;
  save = "save";
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  searchTerm = "";
  formErrors = {
    name: "",
    mrd: "",
    serviceLevelType: "",
    serviceLevelThreshold: "",
  };
  validations;
  conditionList = ["AND", "OR"];
  formHeading = "Add New Queue";
  saveBtnText = "Create";
  mrdData = [];
  queueData: any = [];
  attrData = [];
  editData: any;
  customCollapsedHeight: string = "40px";
  customExpandedHeight: string = "200px";
  stepFormHeading = "Add Step";
  operatorList = ["==", "!=", "<", "<=", ">", ">="];
  boolOperatorList = ["==", "!="];
  stepValidationMessages = {
    timeout: {
      required: "This field is required",
      minlength: "More characters required",
      maxlength: "Max 40 characters allowed",
      pattern: 'Allowed special characters "[!@#$%^&*()-_=+~`"]+"',
    },
    expression: {
      required: "This field is required",
      maxlength: "Max 256 characters allowed",
      pattern: 'Allowed special characters "[!@#$%^&*()-_=+~`"]+"',
    },
  };
  stepFormErrors = {
    timeout: "",
    expression: "",
  };
  queueForm: FormGroup;
  stepForm: FormGroup;

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.queueFormErrorMessages;

    let pageNumber = sessionStorage.getItem("currentQueuePage");
    if (pageNumber) this.p = pageNumber;

    this.queueForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(256),
        ],
      ],
      mrd: ["", [Validators.required]],
      serviceLevelType: [1, [Validators.required, Validators.min(1)]],
      serviceLevelThreshold: [1, [Validators.required, Validators.min(1)]],
    });

    this.stepForm = this.fb.group({
      timeout: ["", [Validators.required]],
      expressions: this.fb.array([this.addExpressionGroup()]),
    });

    //checking for PQ form validation failures
    this.queueForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.queueForm,
        this.formErrors,
        this.validations
      );
    });

    //checking for Step form validation failures
    this.stepForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.stepForm,
        this.stepFormErrors,
        this.stepValidationMessages
      );
    });

    this.getQueue();
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  //creating expression form array object
  addExpressionGroup(): FormGroup {
    return this.fb.group({
      preExpressionCondition: ["AND"],
      terms: new FormArray([this.addExpressionTermGroup()]),
    });
  }

  //to get 'expression' form control
  getExpressions(form) {
    return form.controls.expressions.controls;
  }

  // to add 'expression' group
  addExpressionButton() {
    (<FormArray>this.stepForm.controls["expressions"]).push(
      this.addExpressionGroup()
    );
    this.downTheScrollAfterMilliSecs(50, "smooth", "expression-end");
  }

  // to remove 'expression' group
  removeExpression(i) {
    const exp: any = this.stepForm.get("expressions");
    exp.removeAt(i);
  }

  // to add 'expression term' group
  addExpressionTermGroup(): FormGroup {
    return this.fb.group({
      routingAttribute: ["", Validators.required],
      relationalOperator: ["", Validators.required],
      profVal: [1],
      boolVal: ["true"],
      preTermCondition: ["AND"],
    });
  }

  //to get 'expression' form control
  getTerms(form) {
    return form.controls["terms"].controls;
  }

  //to add 'expression term' form group
  addExpressionTermButton(i, j) {
    const exp: any = this.stepForm.get("expressions");
    const control = exp.controls[i].get("terms");
    control.push(this.addExpressionTermGroup());
    let divID = "term-end" + i;
    this.downTheScrollAfterMilliSecs(50, "smooth", divID);
  }

  // to remove 'expression' group
  removeTerm(i) {
    const exp: any = this.stepForm.get("expressions");
    const control: any = exp.controls[i].get("terms");
    const terms: any = control.controls;
    control.removeAt(i);
  }

  //to open form dialog,this method accepts the `template variable` as a parameter assigned to the form in html.
  openQueueModal(templateRef) {
    this.queueForm.reset();
    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      height: "400px",
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  //resetting  dialog
  onClose(form) {
    this.dialog.closeAll();
    this.searchTerm = "";
    if (form == "step") this.resetStepForm();
  }

  //to get MRD list and set the local variable with the response
  getMRD() {
    this.endPointService.getMrd().subscribe(
      (res: any) => {
        this.spinner = false;
        this.mrdData = res;
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get attribute list and set the local variable with the response
  getAttribute() {
    this.endPointService.getAttribute().subscribe(
      (res: any) => {
        this.spinner = false;
        this.attrData = res;
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to create PQ and it accepts `data` object as parameter with following properties (name:string, mrd:object, agentSelectcriteria:string, serviceLevelType:string ,serviceLevelThreshold:number)
  //and update the local list
  createQueue(data) {
    this.endPointService.createQueue(data).subscribe(
      (res: any) => {
        this.getQueue();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Created Successfully",
          1
        );
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get PQ list and set the local variable with the response
  getQueue() {
    this.spinner = true;
    this.endPointService.getQueue().subscribe(
      (res: any) => {
        this.spinner = false;
        this.queueData = res;
        this.getMRD();
        this.getAttribute();
        this.cd.detectChanges();
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update PQ and it accepts `data` object & `id` as parameter,`data` object (name:string, mrd:object, agentSelectcriteria:string, serviceLevelType:string ,serviceLevelThreshold:number)
  //and updating the local list with the success response object
  updateQueue(data, id) {
    this.endPointService.updateQueue(data, id).subscribe(
      (res: any) => {
        if (res.id) {
          let queue = this.queueData.find((item) => item.id == res.id);
          let index = this.queueData.indexOf(queue);
          this.queueData[index] = res;
          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Queue Updated Successfully",
            1
          );
        }
        this.dialog.closeAll();
        this.cd.detectChanges();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to edit PQ,it accepts `templateRef' & `data` object as parameter,`data` object (name:string, mrd:object, agentSelectcriteria:string, serviceLevelType:string ,serviceLevelThreshold:number)
  //and patches the existing values with form controls and opens the form dialog
  editQueue(templateRef, data) {
    const mrdIndex = this.mrdData.findIndex((item) => item.id == data.mrd.id);
    this.editData = data;
    this.queueForm.patchValue({
      name: data.name,
      mrd: this.mrdData[mrdIndex],
      serviceLevelThreshold: data.serviceLevelThreshold,
      serviceLevelType: data.serviceLevelType,
    });
    this.formHeading = "Edit Queue";
    this.saveBtnText = "Update";
    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      height: "400px",
      panelClass: "add-attribute",
      disableClose: true,
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.saveBtnText = "Create";
      this.editData = undefined;
    });
  }

  //to check if queue is mapped to any channel, it accepts queue object as 'data' and queue ID as 'id' parameter
  checkChannelMapping(data, id) {
    this.endPointService.getChannelMapping(id).subscribe(
      (res: any) => {
        try {
          if (res?.length == 0) {
            this.deleteQueue(data, id);
          } else {
            this.snackbar.snackbarMessage(
              "error-snackbar",
              "Queue is assigned to a channel,cannot be deleted",
              2
            );
            this.spinner = false;
          }
        } catch (e) {
          this.spinner = false;
          console.log("Error in mapping req ==>", e);
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to delete PQ and it accepts `data` object & `id` as parameter,`data` object (name:string, mrd:object, agentSelectcriteria:string, serviceLevelType:string ,serviceLevelThreshold:number)
  //and to update the local list when the operation is successful
  deleteQueue(data, id) {
    this.endPointService.deleteQueue(id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.queueData = this.queueData.filter((item) => item.id != data.id);
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Deleted Successfully",
          1
        );
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        else if (error && error.status == 409)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "Queue is in use,Cannot be deleted",
            1
          );
      }
    );
  }

  //delete confirmation dialog with PQ object as `data` parameter
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this Queue ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Delete Queue",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.checkChannelMapping(data, id);
          // this.deleteQueue(data, id);
        } else {
          this.spinner = false;
        }
      });
  }

  //Object formation for request body
  saveObjFormation() {
    const temp = this.queueForm.value;
    let data: any = {
      mrd: {},
    };
    data.name = temp.name;
    data.mrd.id = temp.mrd.id;
    data.serviceLevelThreshold = temp.serviceLevelThreshold;
    data.serviceLevelType = temp.serviceLevelType;
    return data;
  }

  //to save/update precision queue
  onQueueSave() {
    this.spinner = true;
    let data = this.saveObjFormation();

    if (this.editData) {
      data.id = this.editData.id;
      this.updateQueue(data, data.id);
    } else {
      this.createQueue(data);
    }
  }

  ///////////////////  Step Functions  /////////////

  //to open step form dialog,this method accepts the `templateRef` as a parameter assigned to the form in html and index of the PQ in the list as 'i'.
  openStepModal(templateRef, i) {
    this.stepFormHeading = "Add Step";
    this.stepSaveBtnText = "Add";
    let dialogRef = this.dialog.open(templateRef, {
      width: "800px",
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res == "save") {
        this.createNewStep(i);
      } else {
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
      expressions[0].preExpressionCondition = null;
      for (let j = 0; j < termsCopy.length; j++) {
        let termObj: any = {
          routingAttribute: {},
          relationalOperator: "",
          value: "",
          preTermCondition: "",
        };
        termsCopy[0].preTermCondition = null;
        termObj.routingAttribute = termsCopy[j].routingAttribute;
        termObj.relationalOperator = termsCopy[j].relationalOperator;
        termObj.preTermCondition = termsCopy[j].preTermCondition;
        if (termsCopy[j].routingAttribute.type == "BOOLEAN") {
          termObj.value = JSON.parse(termsCopy[j].boolVal);
        } else {
          termObj.value = termsCopy[j].profVal;
        }
        termsCopy[j] = termObj;
      }
      expressions[i].terms = termsCopy;
    }
    data.expressions = expressions;
    return data;
  }

  //to create PQ step, it accepts step form data object as `data`, queue ID & step ID  as parameter
  createStep(data, queueId) {
    this.endPointService.createStep(data, queueId).subscribe(
      (res: any) => {
        this.getQueue();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Created Successfully",
          1
        );
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update PQ step, it accepts step form data object as `data`, queue ID & step ID  as parameter
  updateStep(data, queueId, stepId) {
    this.endPointService.updateStep(data, queueId, stepId).subscribe(
      (res: any) => {
        this.getQueue();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Created Successfully",
          1
        );
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to delete PQ step and it accepts queue list index as 'i', queue ID & step ID as parameter
  deleteStep(i, queueId, stepId) {
    this.endPointService.deleteStep(queueId, stepId).subscribe(
      (res: any) => {
        // console.log("queue id==>", queueId);
        // let queue = this.queueData.find((item) => item.id == queueId);
        // console.log("queue==>", queue);
        // queue?.steps.filter((item) => {
        //   item.id != stepId;
        // });
        // if (queue?.steps?.length == 0) 
        this.getQueue();

        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Created Successfully",
          1
        );
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //delete confirmation dialog with mrd object as `data` parameter
  deleteStepConfirm(stepData, queueData, i) {
    let msg = "Are you sure you want to delete this Step ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Delete Step",
          message: msg,
          text: "confirm",
          // stepData: stepData,
          // i: i,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteStep(i, queueData.id, stepData.id);
        } else {
          this.spinner = false;
        }
      });
  }

  //Updating reponse object to match required form object structure
  reconstructFormData(stepData) {
    let data = JSON.parse(JSON.stringify(stepData));
    let expressions = JSON.parse(JSON.stringify(data.expressions));
    for (let i = 0; i < expressions.length; i++) {
      let termsCopy = JSON.parse(JSON.stringify(expressions[i].terms));
      for (let j = 0; j < termsCopy.length; j++) {
        let termObj = {
          routingAttribute: {},
          relationalOperator: "",
          profVal: 1,
          boolVal: "1",
          preTermCondition: "AND",
        };
        const temp = this.attrData.filter(
          (item) => item.id == termsCopy[j].routingAttribute.id
        );
        termObj.relationalOperator = termsCopy[j].relationalOperator;
        termObj.routingAttribute = temp[0];
        termObj.preTermCondition = termsCopy[j].preTermCondition;
        if (termsCopy[j].routingAttribute.type == "BOOLEAN") {
          termObj.boolVal = JSON.stringify(termsCopy[j].value);
        } else {
          termObj.profVal = termsCopy[j].value;
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

  //to edit PQ,it accepts template reference as 'templateRef', step object as `data` & queue object index as 'i' as parameter
  //and patches the existing values with form controls and opens the form dialog
  editStep(templateRef, data, i) {
    this.stepFormHeading = "Edit Step";
    this.stepSaveBtnText = "Update";
    let temp = JSON.parse(JSON.stringify(data));
    const control = <FormArray>this.stepForm.controls["expressions"];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
    let stepData = this.reconstructFormData(temp);
    let tempStep: any = {};
    tempStep.expressions = stepData.expressions;
    tempStep.timeout = stepData.timeout;

    this.loadFormExpression(tempStep);
    let dialogRef = this.dialog.open(templateRef, {
      width: "800px",
      panelClass: "add-attribute",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res == "save") {
        this.saveEditStep(i, data.id);
      } else {
        this.resetStepForm();
      }
    });
  }

  //to save new queue step, it accepts index of PQ object index as 'i' parameter
  createNewStep(i) {
    this.spinner = true;
    const formData = JSON.parse(JSON.stringify(this.stepForm.value));
    let stepData = this.manipulateExpTerm(formData);
    let data = stepData;
    let queue = this.queueData[i];
    const stepLength = queue?.steps?.length;
    // const stepLength = 10;
    // console.log("queue==>", stepLength);
    if (stepLength && stepLength >= 10) {
      this.snackbar.snackbarMessage(
        "error-snackbar",
        "Only 10 Step allowed in a queue",
        2
      );
      this.spinner = false;
    } else {
      this.createStep(data, queue.id);
    }
    this.resetStepForm();
  }

  //to save updated step, it accepts index of PQ object index as 'i' & step ID as parameter
  saveEditStep(i, stepId) {
    this.spinner = true;
    const formData = JSON.parse(JSON.stringify(this.stepForm.value));
    let stepData = this.manipulateExpTerm(formData);
    let data = stepData;
    data.id = stepId;
    const queueId = this.queueData[i].id;
    this.updateStep(data, queueId, stepId);
    this.resetStepForm();
  }

  get term(): FormGroup {
    return this.fb.group({
      routingAttribute: [""],
      relationalOperator: [""],
      profVal: [1],
      boolVal: ["true"],
      preTermCondition: ["AND"],
    });
  }

  get expression(): FormGroup {
    return this.fb.group({
      preExpressionCondition: ["AND"],
      terms: new FormArray([]),
    });
  }

  // to reset step form after dialog close
  resetStepForm() {
    this.stepForm.reset();
    const control = <FormArray>this.stepForm.controls["expressions"];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
    this.addExpressionButton();
  }

  pageChange(e) {
    sessionStorage.setItem("currentQueuePage", e);
  }

  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("currentQueuePage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }

  // progress bar setting
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "k";
    }

    return value;
  }

  // Move the scroll to down after the given time in milliseconds and the given behavior of the movement
  downTheScrollAfterMilliSecs(milliseconds, behavior, div) {
    setTimeout(() => {
      let ele: any = document.getElementById(div);
      if (ele) ele.scrollIntoView({ block: "nearest", behavior: behavior });
    }, milliseconds);
  }
}
