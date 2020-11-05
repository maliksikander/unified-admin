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
  attributeFilterTerm = '';
  selectedAttributeFilterTerm = '';
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
  usersCopy = [];

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
    if (pageNumber) this.p = pageNumber; 

    this.userForm = this.formBuilder.group({
      agentId: [''],
      attributes: [],
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

  onClose() {
    this.dialog.closeAll();
    this.searchTerm = "";
    this.editData = undefined;
  }

  getAttribute() {
    this.endPointService.get('attribute').subscribe(
      (res: any) => {


        this.attrData = JSON.parse(JSON.stringify(res));

        if (this.attrData && this.attrData.length > 0) {
          this.attrData.map(item => {
            item.isChecked = false;
          });

          if (this.userForm.value.attributes && this.userForm.value.attributes.length > 0)
            this.attrData.forEach(attr => {
              this.userForm.value.attributes.forEach(selected => {
                if (attr._id == selected._id) {
                  attr.isChecked = true;
                }
              });
            });
          // console.log("attr res 2 -->", this.attrData);
        }
        this.spinner = false;
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
        // console.log("user res-->", res);
        this.userData = JSON.parse(JSON.stringify(res));
        this.usersCopy = JSON.parse(JSON.stringify(res));
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

  editUser(templateRef, item) {

    this.spinner = true;
    let data = JSON.parse(JSON.stringify(item));
    this.editData = JSON.parse(JSON.stringify(item));

    this.userForm.patchValue({
      agentId: data.agentId,
      attributes: data.attributes,
      firstName: data.firstName,
      lastName: data.lastName
    });
    let dialogRef = this.dialog.open(templateRef, {
      width: '650px',
      height: '600px',
      panelClass: 'add-user',
      disableClose: true,
      data: data
    });

    this.getAttribute();

    dialogRef.afterClosed().subscribe(res => {
      this.editData = undefined;
      this.attrData = undefined;
      this.attributeFilterTerm = '';
      this.selectedAttributeFilterTerm = '';
    });
  }

  onStatusChange(e, data) {
    let payload = JSON.parse(JSON.stringify(data));
    this.spinner = true;
    if (payload._id) delete payload._id;
    payload.Interruptible = e.checked;
    this.updateUser(payload, data._id);
  }

  onSave() {
    this.spinner = true;
    let data = JSON.parse(JSON.stringify(this.editData));
    data.attributes = this.userForm.value.attributes;
    this.updateUser(data, this.editData._id);
  }

  availableToSelectedAttribute(e, item, i) {
    let checked = e.target.checked;
    this.attrData[i].isChecked = checked;
    let selectedList = [];
    selectedList = JSON.parse(JSON.stringify(this.userForm.value.attributes));
    if (selectedList.length > 0) {
      let selectedIndex = selectedList.findIndex(x => x._id == item._id);
      if (selectedIndex != -1) {
        if (checked == false) {
          this.userForm.value.attributes.splice(selectedIndex, 1);
          this.selectedAttributeFilterTerm = '';
        };
      }
      else {
        if (checked == true) this.userForm.value.attributes.push(item);
      }
    }
    else { this.userForm.value.attributes.push(item); }
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  syncUsers() {
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

  onSliderChange(e, type, i) {
    if (e.value || e.value == 0) {
      this.userForm.value.attributes[i].value = JSON.stringify(e.value);
    }
  }

  onToggleChange(e, type, i) {
    if (e.checked || e.checked == false) {
      this.userForm.value.attributes[i].value = JSON.stringify(e.checked);
    }
  }

}