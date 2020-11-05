import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-precision-queue',
  templateUrl: './precision-queue.component.html',
  styleUrls: ['./precision-queue.component.scss']
})
export class PrecisionQueueComponent implements OnInit {

  spinner: any = true;
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  searchTerm = '';
  formErrors = {
    name: '',
    associatedMrd: '',
    agentCriteria: '',
    serviceLevelType: '',
    serviceLevelThreshold: '',
  };
  validations;
  queueForm: FormGroup;
  stepForm: FormGroup;

  agentCriteria = ['longest available', 'most skilled', 'least skilled'];
  serviceLevelType = ['ignore abandoned chats', 'abandoned chats have a negative impact', 'abandoned chats have a positive impact'];
  conditionList = ["AND","OR"]
  reqServiceType = 'pqueue';
  formHeading = 'Add New Queue';
  saveBtnText = 'Create';
  mrdData = [];
  queueData = [];
  attrData = [];
  editData: any;
  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '200px';

  stepFormHeading = 'Add Step';
  operatorList = ["==", "!=", "<", "<=", ">", ">="];


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.validations = this.commonService.queueFormErrorMessages;

    let pageNumber = localStorage.getItem('currentQueuePage');
    if (pageNumber) this.p = pageNumber;

    this.queueForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      associatedMrd: [''],
      agentCriteria: [],
      serviceLevelType: [''],
      serviceLevelThreshold: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
    });

    this.stepForm = this.formBuilder.group({
      timeout: [''],
      // associatedMrd: [''],
      // agentCriteria: [],
      // serviceLevelType: [''],
      // serviceLevelThreshold: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
    });

    this.queueForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.queueForm, this.formErrors, this.validations);
    });


    this.getQueue();
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

  onClose() {
    this.dialog.closeAll();
    this.searchTerm = "";
  }


  getMRD() {
    this.endPointService.get('mrd').subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("mrd res-->", res);
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
    // this.endPointService.create(data, this.reqServiceType).subscribe(
    //   (res: any) => {
    //     this.getMRD();
    //     this.snackbar.snackbarMessage('success-snackbar', "Queue Created Successfully", 1);
    //   },
    //   (error: any) => {
    //     this.spinner = false;
    //     console.log("Error fetching:", error);
    //     if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
    //   });
  }

  getQueue() {
    this.endPointService.get(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        console.log("queue res-->", res);
        this.queueData = res;
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
    // this.endPointService.update(data, id, this.reqServiceType).subscribe(
    //   (res: any) => {
    //     this.snackbar.snackbarMessage('success-snackbar', "Queue Updated Successfully", 1);
    //     this.getMRD();
    //     this.dialog.closeAll();
    //   },
    //   (error: any) => {
    //     this.spinner = false;
    //     console.log("Error fetching:", error);
    //     if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
    //   });
  }

  deleteQueue(data, id) {
    // this.endPointService.delete(id, this.reqServiceType).subscribe(
    //   (res: any) => {
    //     this.spinner = false;
    //     // console.log("delete res -->", res);
    //     this.mrdData = this.mrdData.filter(i => i !== data)
    //       .map((i, idx) => (i.position = (idx + 1), i));
    //     this.snackbar.snackbarMessage('success-snackbar', "Queue Deleted Successfully", 1);
    //   },
    //   (error) => {
    //     this.spinner = false;
    //     console.log("Error fetching:", error);
    //     if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
    //   });
  }

  editQueue(templateRef, data) {

    // const typeIndex = this.attrType.indexOf(data.type);
    // this.editData = data;
    console.log("edit Data-->", data);
    // this.queueForm.patchValue({
    // name: data.name,
    // description: data.description,
    // type: this.attrType[typeIndex],
    // profVal: JSON.parse(data.value),
    // boolVal: JSON.parse(data.value),
    // });
    // this.formHeading = 'Edit Attribute';
    // this.saveBtnText = 'Update'
    // let dialogRef = this.dialog.open(templateRef, {
    //   width: '550px',
    //   height: '400px',
    //   panelClass: 'add-attribute',
    //   disableClose: true,
    //   data: data
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   this.editData = undefined;
    // });
  }

  deleteConfirm(data) {

    console.log("delete Data-->", data);
    // let id = data._id;
    // let msg = "Are you sure you want to delete this Queue ?";
    // return this.dialog.open(ConfirmDialogComponent, {
    //   panelClass: 'confirm-dialog-container',
    //   disableClose: true,
    //   data: {
    //     heading: "Delete Queue",
    //     message: msg,
    //     text: 'confirm',
    //     data: data
    //   }
    // }).afterClosed().subscribe((res: any) => {
    //   this.spinner = true;
    //   if (res === 'delete') { this.deleteQueue(data, id); }
    //   else { this.spinner = false; }
    // });
  }


  onSave() { }

  editStep(data) { }

  deleteStep(data) { }

  openStepModal(templateRef) {
    this.stepForm.reset();
    // this.stepForm.controls['profVal'].patchValue(1);
    let dialogRef = this.dialog.open(templateRef, {
      width: '800px',
      height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
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
