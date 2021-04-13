import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-mrd',
  templateUrl: './mrd.component.html',
  styleUrls: ['./mrd.component.scss']
})
export class MrdComponent implements OnInit {

  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  spinner: any = true;
  searchTerm = '';
  formErrors = {
    name: '',
    description: '',
    enabled: '',
  };
  validations;
  mrdForm: FormGroup;
  formHeading = 'Add New MRD';
  saveBtnText = 'Create';
  mrdData = [];
  editData: any;
  reqServiceType = 'media-routing-domains';

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.validations = this.commonService.mrdFormErrorMessages;

    //setting local form validation messages 
    this.mrdForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(110), Validators.pattern("^[a-zA-Z0-9!@#$%^*_&()\\\"-]*$")]],
      description: ['', [Validators.maxLength(500)]],
      enabled: [],
    });

    let pageNumber = localStorage.getItem('currentMRDPage');
    if (pageNumber) this.p = pageNumber;

    //checking for MRD form validation failures
    this.mrdForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.mrdForm, this.formErrors, this.validations);
    });

    this.getMRD();
  }

  //to open form dialog,this method accepts the `templateRef` as a parameter assigned to the form in html.
  openModal(templateRef) {
    this.mrdForm.reset();
    this.mrdForm.controls['enabled'].patchValue(true);
    this.formHeading = 'Add New MRD';
    this.saveBtnText = 'Create'
    let dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  //resetting dialog
  onClose() {
    this.dialog.closeAll();
    this.searchTerm = "";
    this.editData = undefined;
  }

  //to create MRD and it accepts `data` object as parameter with following properties (name:string, description:string, interruptible:string)
  //and update the local list 
  createMRD(data) {
    this.endPointService.create(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.getMRD();
        this.snackbar.snackbarMessage('success-snackbar', "MRD Created Successfully", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to get MRD list and set the local variable with the response 
  getMRD() {
    this.endPointService.get(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        this.mrdData = res;
        if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to update MRD and it accepts `data` object & `id` as parameter,`data` object (name:string, description:string, interruptible:string)
  //and updating the local list with the success response object
  updateMRD(data, id) {
    this.endPointService.update(data, id, this.reqServiceType).subscribe(
      (res: any) => {
        if (res.id) {
          let attr = this.mrdData.find(item => item.id == res.id);
          let index = this.mrdData.indexOf(attr);
          this.mrdData[index] = res;
          this.snackbar.snackbarMessage('success-snackbar', "MRD Updated Successfully", 1);
        }
        this.dialog.closeAll();
        this.spinner = false
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to delete MRD and it accepts `data` object & `id` as parameter,`data` object (name:string, description:string, interruptible:string)
  //and to update the local list when the operation is successful
  deleteMRD(data, id) {
    this.endPointService.delete(id, this.reqServiceType).subscribe(
      (res: any) => {

        if (res) {
          this.spinner = false;
          this.mrdData = this.mrdData.filter(i => i !== data)
            .map((i, idx) => (i.position = (idx + 1), i));
          this.snackbar.snackbarMessage('success-snackbar', "MRD Deleted Successfully", 1);
        }
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
        // if (error && error.status == 409) this.snackbar.snackbarMessage('error-snackbar', "MRD in use,cannot be deleted", 1);
      });
  }

  //delete confirmation dialog with mrd object as `data` parameter
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this MRD ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Media Routing Domain",
        message: msg,
        text: 'confirm',
        data: data
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') { this.deleteMRD(data, id); }
      else { this.spinner = false; }
    });
  }

  //to edit MRD,it accepts `templateRef' & `data` object as parameter,`data` object (name:string, description:string, interruptible:string)
  //and patches the existing values with form controls and opens the form dialog
  editMrd(templateRef, data) {
    this.editData = data;
    this.mrdForm.patchValue({
      name: data.name,
      description: data.description,
      enabled: data.interruptible,
    });

    this.formHeading = 'Edit MRD';
    this.saveBtnText = 'Update'
    let dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editData = undefined;
    });
  }

  // To change toggle value and updating MRD ,it accepts toggle value paramter as 'e' and mrd object parameter as data.
  onStatusChange(e, data) {
    let payload = JSON.parse(JSON.stringify(data));
    this.spinner = true;
    if (payload.id) delete payload.id;
    payload.interruptible = e.checked;
    this.updateMRD(payload, data.id);
  }

  // Object manipulation for request body
  onSaveObject() {
    let data: any = {};
    data.name = this.mrdForm.value.name;
    data.description = this.mrdForm.value.description;
    data.interruptible = this.mrdForm.value.enabled;
    return data;
  }

  onSave() {
    this.spinner = true;
    let data: any = this.onSaveObject()
    if (this.editData) {
      this.updateMRD(data, this.editData.id);
    }
    else {
      this.createMRD(data);
    }
  }

  //save page number storage for reload
  pageChange(e) { localStorage.setItem('currentMRDPage', e); }

  //page bound change and saving for reload
  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('currentMRDPage', e);
  }

  selectPage() { this.itemsPerPage = this.selectedItem; }
}
