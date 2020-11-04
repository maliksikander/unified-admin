import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  spinner: any = true;
  searchTerm = '';
  attributeFilter = { name: '' };
  selectedAttributeFilter = { name: '' };
  formErrors = {
    agentId: '',
    attributes: '',
    firstName: '',
    lastName: '',
  };
  validations;
  userForm: FormGroup;
  formHeading = 'User Profile';
  // saveBtnText = 'Create';
  reqServiceType = 'agent';
  editData: any;
  userData = [];
  attrData = [];

  customCollapsedHeight: string = '48px';
  customExpandedHeight: string = '48px';
  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.validations = this.commonService.userFormErrorMessages;
    let pageNumber = localStorage.getItem('currentUsersPage');
    if (pageNumber) {
      this.p = pageNumber;
    }

    this.userForm = this.formBuilder.group({
      agentId: [''],
      attributes: [''],
      firstName: [''],
      lastName: [''],
    });

    this.userForm.controls['agentId'].disable();
    this.userForm.controls['firstName'].disable();
    this.userForm.controls['lastName'].disable();

   

    this.userForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.userForm, this.formErrors, this.validations);
    });

    this.getUsers();

  }

  // openModal(templateRef) {
  //   this.userForm.reset();
  //   // this.userForm.controls['enabled'].patchValue(true);
  //   let dialogRef = this.dialog.open(templateRef, {
  //     width: '500px',
  //     height: '350px',
  //     panelClass: 'add-attribute',
  //     disableClose: true,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  onClose() {
    this.dialog.closeAll();
    this.searchTerm = "";
    this.editData = undefined;
  }

  // createUser(data) {
  //   this.endPointService.create(data, this.reqServiceType).subscribe(
  //     (res: any) => {
  //       this.getMRD();
  //       this.snackbar.snackbarMessage('success-snackbar', "User Created Successfully", 1);
  //     },
  //     (error: any) => {
  //       this.spinner = false;
  //       console.log("Error fetching:", error);
  //       if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
  //     });
  // }

  getAttribute() {
    this.endPointService.get('attribute').subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("attr res-->", res);
        this.attrData = res;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  getUsers() {
    this.endPointService.get(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        this.getAttribute();
        // console.log("user res-->", res);
        this.userData = res;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  updateUser(data, id) {
    this.endPointService.update(data, id, this.reqServiceType).subscribe(
      (res: any) => {
        this.snackbar.snackbarMessage('success-snackbar', "User Updated Successfully", 1);
        this.getUsers();
        this.dialog.closeAll();
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  deleteUser(data, id) {
    this.endPointService.delete(id, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("delete res -->", res);
        this.userData = this.userData.filter(i => i !== data)
          .map((i, idx) => (i.position = (idx + 1), i));
        this.snackbar.snackbarMessage('success-snackbar', "User Deleted Successfully", 1);
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  deleteConfirm(data) {
    let id = data._id;
    let msg = "Are you sure you want to delete this User ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete User",
        message: msg,
        text: 'confirm',
        data: data
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') { this.deleteUser(data, id); }
      else { this.spinner = false; }
    });
  }

  editUser(templateRef, data) {
    this.editData = data;
    console.log("data-->",data)
    this.userForm.patchValue({
      agentId: data.agentId,
      attributes: data.attributes,
      firstName: data.firstName,
      lastName: data.lastName
    });
    // this.formHeading = 'Edit User';
    // this.saveBtnText = 'Update'
    let dialogRef = this.dialog.open(templateRef, {
      width: '650px',
      height: '600px',
      panelClass: 'add-attribute',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editData = undefined;
    });
  }

  onStatusChange(e, data) {
    let payload = JSON.parse(JSON.stringify(data));
    this.spinner = true;
    if (payload._id) delete payload._id;
    payload.Interruptible = e.checked;
    this.updateUser(payload, data._id);
  }

  onSaveObject() {
    let data: any = {};
    // data.Name = this.mrdForm.value.name;
    // data.Description = this.mrdForm.value.description;
    // data.Interruptible = this.mrdForm.value.enabled;
    // return data;
  }

  onSave() {
    this.spinner = true;
    let data: any = this.onSaveObject()
    if (this.editData) {
      // this.updateUser(data, this.editData._id);
    }
    else {
      // this.createMRD(data);
    }
  }

  checkFilterState(event, item) { }
  filterValue(event, item) { }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  syncUsers(){
    this.spinner = true;
    this.getUsers();
  }


  pageChange(e) {
    localStorage.setItem('currentUsersPage', e);
  }

  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('currentUsersPage', e); 
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }

}
