import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
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
    // agentId: '',
    attributes: '',
    // firstName: '',
    // lastName: '',
  };
  validations;
  userForm: FormGroup;
  userAttributeForm: FormGroup;
  attributeUpdateForm: FormGroup;
  formHeading = 'User Profile';
  reqServiceType = 'agent';
  editData: any;
  userData = [];
  attrData = [];
  usersCopy = [];
  attrSpinner = false;
  attrValueList = [];
  customCollapsedHeight: string = '48px';
  customExpandedHeight: string = '48px';

  dataSource = [];
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  expandedElement: 'collapsed';


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.validations = this.commonService.userFormErrorMessages;
    let pageNumber = localStorage.getItem('currentUsersPage');
    if (pageNumber) this.p = pageNumber;

    this.userForm = this.formBuilder.group({
      agentId: [''],
      // attributes: [],
      firstName: [''],
      lastName: [''],
    });

    this.userAttributeForm = this.formBuilder.group({
      // agentId: [''],
      attributes: [],
      // firstName: [''],
      // lastName: [''],
    });

    this.attributeUpdateForm = this.formBuilder.group({
      attributeName: [],
      // attributeType: [],
      attributeValue: [],
    });



    this.userForm.controls['agentId'].disable();
    this.userForm.controls['firstName'].disable();
    this.userForm.controls['lastName'].disable();

    this.userAttributeForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.userAttributeForm, this.formErrors, this.validations);
    });

    this.endPointService.readConfigJson().subscribe((e) => {
      this.getUsers();
    });

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
          if (this.userAttributeForm.value.attributes && this.userAttributeForm.value.attributes.length > 0)
            this.attrData.forEach(attr => {
              this.userAttributeForm.value.attributes.forEach(selected => {
                if (attr._id == selected._id) {
                  attr.isChecked = true;
                }
              });
            });
        }
        this.spinner = false;
        this.attrSpinner = false;
      },
      error => {
        this.spinner = false;
        this.attrSpinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  getUsers() {
    this.endPointService.get(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        this.userData = JSON.parse(JSON.stringify(res));
        this.usersCopy = JSON.parse(JSON.stringify(res));
        if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
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

  editUserAttributes(templateRef, item) {
    this.attrSpinner = true;
    let data = JSON.parse(JSON.stringify(item));
    this.editData = JSON.parse(JSON.stringify(item));
    this.userAttributeForm.patchValue({
      attributes: data.attributes,
    });
    let dialogRef = this.dialog.open(templateRef, {
      width: '650px',
      height: '500px',
      panelClass: 'add-user',
      disableClose: true,
      data: data
    });
    // this.spinner = true;
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
    data.attributes = this.userAttributeForm.value.attributes;
    this.updateUser(data, this.editData._id);
  }

  availableToSelectedAttribute(e, item, i) {
    let checked = e.target.checked;
    this.attrData[i].isChecked = checked;
    let selectedList = [];
    selectedList = JSON.parse(JSON.stringify(this.userAttributeForm.value.attributes));
    if (selectedList.length > 0) {
      let selectedIndex = selectedList.findIndex(x => x._id == item._id);
      if (selectedIndex != -1) {
        if (checked == false) {
          this.userAttributeForm.value.attributes.splice(selectedIndex, 1);
          this.selectedAttributeFilterTerm = '';
        };
      }
      else {
        if (checked == true) this.userAttributeForm.value.attributes.push(item);
      }
    }
    else { this.userAttributeForm.value.attributes.push(item); }
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


  viewUserProfile(templateRef, item) {

    // this.spinner = true;
    let data = JSON.parse(JSON.stringify(item));
    // this.editData = JSON.parse(JSON.stringify(item));

    this.userForm.patchValue({
      agentId: data.agentId,
      firstName: data.firstName,
      lastName: data.lastName
    });
    let dialogRef = this.dialog.open(templateRef, {
      width: '650px',
      height: '300px',
      panelClass: 'add-user',
      disableClose: true,
      data: data
    });

    // this.getAttribute();

    // dialogRef.afterClosed().subscribe(res => {
    //   this.editData = undefined;
    //   this.attrData = undefined;
    //   this.attributeFilterTerm = '';
    //   this.selectedAttributeFilterTerm = '';
    // });
  }

  pageChange(e) { localStorage.setItem('currentUsersPage', e); }

  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('currentUsersPage', e);
  }

  selectPage() { this.itemsPerPage = this.selectedItem; }

  onSliderChange(e, type, i) {
    if (e.value || e.value == 0) {
      this.userAttributeForm.value.attributes[i].value = JSON.stringify(e.value);
    }
  }

  onToggleChange(e, type, i) {
    if (e.checked || e.checked == false) {
      this.userAttributeForm.value.attributes[i].value = JSON.stringify(e.checked);
    }
  }

  attrName='';
  attrValue='';
  attrType:any;
  updateAttributeValue(templateRef, attr, data) {

    this.onClose();
    let width='';
    this.attrName = attr.name;
    this.attrValue = attr.value;
    this.attrType = attr.type;
    if (attr.type == 'Boolean') {
      this.attrValueList = ["true", "false"];
      width = '200px';
    }
    else {
      this.attrValueList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
      width = '300px';
    }


    // this.attributeUpdateForm.patchValue({
    //   attributeName: attr.name,
    //   attributeValue: attr.value,
    // });

    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      height: '100px',
      panelClass: 'add-user',
      disableClose: false,
      hasBackdrop: false,
      // data: data
    });
    // this.spinner = true;
    // this.getAttribute();

    dialogRef.afterClosed().subscribe(res => {
      // this.editData = undefined;
      // this.attrData = undefined;
      // this.attributeFilterTerm = '';
      // this.selectedAttributeFilterTerm = '';
    });
  }

}