import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatMenuTrigger } from '@angular/material';
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
  formHeading = 'User Profile';
  reqServiceType = 'agents';
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
  @ViewChild('attributeMenuTrigger') attributeMenuTrigger: MatMenuTrigger;
  attrName = '';
  attrValue = '';
  attrType: any;
  attrId;
  userObj;
  keycloakUsers = [];
  routingEngineUsers = [];
  // roles = [];
  rolesTooltip = [];
  save = "save";
  editREUserData: any;
  newREUserData: any;

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.validations = this.commonService.userFormErrorMessages;
    let pageNumber = localStorage.getItem('currentUsersPage');
    if (pageNumber) this.p = pageNumber;

    this.userForm = this.formBuilder.group({
      // agentId: [''],
      firstName: [''],
      lastName: [''],
      roles: ['']
    });

    this.userAttributeForm = this.formBuilder.group({
      associatedRoutingAttributes: [[]],
    });

    // this.userForm.controls['roles'].disable();
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
    // this.editData = undefined;
  }

  getAttribute() {
    this.endPointService.get('routing-attributes').subscribe(
      (res: any) => {
        this.attrData = JSON.parse(JSON.stringify(res));
        if (this.attrData && this.attrData.length > 0) {
          this.attrData.map(item => {
            item.isChecked = false;
          });
          if (this.userAttributeForm.value.associatedRoutingAttributes && this.userAttributeForm.value.associatedRoutingAttributes.length > 0)
            this.attrData.forEach(attr => {
              this.userAttributeForm.value.associatedRoutingAttributes.forEach(selected => {
                if (attr.id == selected.id) {
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

  updateREUserAttribute(data, id) {
    this.endPointService.update(data, id, this.reqServiceType).subscribe(
      (res: any) => {
        this.snackbar.snackbarMessage('success-snackbar', "User Updated Successfully", 1);
        // this.getUsers();
        this.dialog.closeAll();
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  deleteREUser(id) {
    this.endPointService.delete(id, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        this.getUsers();
        // this.userData = this.userData.filter(i => i !== data)
        //   .map((i, idx) => (i.position = (idx + 1), i));
        // this.snackbar.snackbarMessage('success-snackbar', "User Deleted Successfully", 1);
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  deleteConfirm(data) {
    let id = data.id;
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
      // this.spinner = true;
      // if (res === 'delete') { this.deleteUser(data, id); }
      // else { this.spinner = false; }
    });
  }

  editUserAttributes(templateRef, item) {

    this.attrSpinner = true;
    let data = JSON.parse(JSON.stringify(item));
    this.editREUserData = JSON.parse(JSON.stringify(item));
    // console.log("edit data-->", data);

    if (data.associatedRoutingAttributes) {
      this.userAttributeForm.patchValue({
        associatedRoutingAttributes: data.associatedRoutingAttributes,
      });

    }

    let dialogRef = this.dialog.open(templateRef, {
      width: '650px',
      height: '500px',
      panelClass: 'add-user',
      disableClose: true,
      data: data
    });
    this.spinner = true;
    this.getAttribute();

    dialogRef.afterClosed().subscribe(res => {
      // this.editData = undefined;
      // this.attrData = undefined;
      // this.attributeFilterTerm = '';
      // this.selectedAttributeFilterTerm = '';
      // this.userAttributeForm.patchValue({
      // associatedRoutingAttributes: [],
      // questioning: this.question.questioning
      // });
      if (res == "save") {
        this.onSave();
      }
      // console.log("close res-->",res);
    });
  }

  onStatusChange(e, data) {
    let payload = JSON.parse(JSON.stringify(data));
    this.spinner = true;
    if (payload.id) delete payload.id;
    payload.Interruptible = e.checked;
    // this.updateUser(payload, data.id);
  }

  onSave() {
    // this.spinner = true;
    // console.log("save data-->", this.editREUserData);
    let data = JSON.parse(JSON.stringify(this.editREUserData));
    data.associatedRoutingAttributes = this.userAttributeForm.value.associatedRoutingAttributes;
    console.log("save data-->", data);
    if (data && data.id) {
      // this.updateUser(data, this.editData.id);
    }
    else {
      this.createREUser(data);
    }

  }

  availableToSelectedAttribute(e, data, i) {
    // console.log(i, "triggered===>", data);
    let attrObj: any = {};
    attrObj.routingAttribute = data;
    attrObj.value = data.defaultValue;
    let checked = e.target.checked;
    this.attrData[i].isChecked = checked;
    let formAttributes = JSON.parse(JSON.stringify(this.userAttributeForm.value.associatedRoutingAttributes));
    let selectedList = [];
    if (formAttributes && formAttributes != null) selectedList = formAttributes;
    // console.log("test-->", selectedList);
    if (selectedList.length > 0) {
      let selectedIndex = selectedList.findIndex(x => x.routingAttribute.id == data.id);
      // console.log("index-->",selectedIndex);
      if (selectedIndex != -1) {
        if (checked == false) {
          this.userAttributeForm.value.associatedRoutingAttributes.splice(selectedIndex, 1);
          this.selectedAttributeFilterTerm = '';
        };
      }
      else {
        if (checked == true) this.userAttributeForm.value.associatedRoutingAttributes.push(attrObj);
      }
    }
    else {
      this.userAttributeForm.value.associatedRoutingAttributes.push(attrObj);
      // console.log("form data-->", this.userAttributeForm.value);
    }
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

    let data = JSON.parse(JSON.stringify(item));
    // console.log("data-->", data);
    // this.editData = JSON.parse(JSON.stringify(item));
    let roleTip = data.keycloakUser.roles;
    if (roleTip && roleTip.length > 5) this.rolesTooltip = roleTip.slice(5, roleTip.length);
    // console.log("roeltip-->", this.rolesTooltip)
    this.userForm.patchValue({
      // agentId: data.agentId,
      firstName: data.keycloakUser.firstName,
      lastName: data.keycloakUser.lastName,
      roles: data.keycloakUser.roles
    });
    let dialogRef = this.dialog.open(templateRef, {
      width: '650px',
      height: '300px',
      panelClass: 'add-user',
      disableClose: true,
      data: data
    });

    // this.getAttribute();

    dialogRef.afterClosed().subscribe(res => {
      // this.editData = undefined;
      // this.attrData = undefined;
      // this.attributeFilterTerm = '';
      // this.selectedAttributeFilterTerm = '';
    });
  }



  onSliderChange(e, i) {
    // console.log("e-->", e, "==i==", i);
    if (e.value || e.value == 0) {
      this.userAttributeForm.value.associatedRoutingAttributes[i].value = JSON.stringify(e.value);
    }
  }

  onToggleChange(e, i) {
    if (e.checked || e.checked == false) {
      this.userAttributeForm.value.associatedRoutingAttributes[i].value = JSON.stringify(e.checked);
    }
  }

  updateAttributeValue(attr, data) {
    // console.log("attr-->",attr)
    // console.log("data-->",data)
    this.attrName = attr.routingAttribute.name;
    this.attrValue = attr.value;
    this.attrType = attr.routingAttribute.type;
    this.attrId = attr.routingAttribute.id;
    this.userObj = data;
    if (attr.routingAttribute.type == 'BOOLEAN') {
      this.attrValueList = ["true", "false"];
    }
    else {
      this.attrValueList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    }
  }

  onAttrChange(e) {

    if (this.userObj.associatedRoutingAttributes && this.userObj.associatedRoutingAttributes.length > 0) {
      let attr = this.userObj.associatedRoutingAttributes.find(item => item.routingAttribute.id == this.attrId);
      let index = this.userObj.associatedRoutingAttributes.indexOf(attr);
      if (e == 'false') {
        this.userObj.associatedRoutingAttributes.splice(index, 1);
        console.log("user-->",this.userObj);
        if(this.userObj.associatedRoutingAttributes.length == 0){
          return this.deleteREUser(this.userObj.id);
        }
      }
      else {
        this.userObj.associatedRoutingAttributes[index].value = e;
        this.closeMenu();
      }
      this.updateREUserAttribute(this.userObj, this.userObj.id);
    }


  }

  removeAttribute() {
    if (this.userObj.associatedRoutingAttributes && this.userObj.associatedRoutingAttributes.length > 0) {
      let attr = this.userObj.associatedRoutingAttributes.find(item => item.routingAttribute.id == this.attrId);
      let index = this.userObj.associatedRoutingAttributes.indexOf(attr)
      this.userObj.associatedRoutingAttributes.splice(index, 1);

      if(this.userObj.associatedRoutingAttributes.length == 0){
        return this.deleteREUser(this.userObj.id);
      }
      this.updateREUserAttribute(this.userObj, this.userObj.id);
    }
  }

  closeMenu() {
    this.attributeMenuTrigger.closeMenu();
  }

  createREUser(data) {
    this.endPointService.create(data, this.reqServiceType).subscribe(
      (res: any) => {
        // this.snackbar.snackbarMessage('success-snackbar', "Created Successfully", 1);
        // console.log("res-->",res);
        this.resetAttributeForm();
        this.getUsers();
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  resetAttributeForm() {
    this.editREUserData = undefined;
    this.attrData = undefined;
    this.attributeFilterTerm = '';
    this.selectedAttributeFilterTerm = '';
    this.userAttributeForm.patchValue({
      associatedRoutingAttributes: []
    });
  }


  getKeycloakUsers() {
    this.spinner = true;
    this.endPointService.getKeycloakUser().subscribe(
      (res: any) => {
        this.keycloakUsers = JSON.parse(JSON.stringify(res));
        if (this.keycloakUsers && this.keycloakUsers.length > 0) {
          for (let i = 0; i < this.keycloakUsers.length; i++) {
            let temp = { "keycloakUser": this.keycloakUsers[i] };
            this.userData.push(temp);
          }
        }
        this.getRoutingEngineUsers();
        // this.spinner = false;

      },
      error => {
        console.log("Error fetching:", error);
        this.spinner = false;
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }


  getRoutingEngineUsers() {
    this.endPointService.get(this.reqServiceType).subscribe(
      (res: any) => {
        this.routingEngineUsers = JSON.parse(JSON.stringify(res));
        // console.log("routing users res-->", this.routingEngineUsers);
        const usersListLength = this.userData.length;
        const routingEngineUsersLength = this.routingEngineUsers.length;
        if (usersListLength > 0 && routingEngineUsersLength > 0) {
          for (let i = 0; i < this.userData.length; i++) {
            for (let j = 0; j < this.routingEngineUsers.length; j++) {
              if (this.userData[i].keycloakUser.id == this.routingEngineUsers[j].keycloakUser.id) {
                this.userData[i].id = this.routingEngineUsers[j].id;
                this.userData[i].associatedRoutingAttributes = this.routingEngineUsers[j].associatedRoutingAttributes;
              }
            }
          }
        }

        // this.usersCopy = JSON.parse(JSON.stringify(res));
        console.log("users data 2-->", this.userData);
        if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }



  getUsers() {
    this.spinner = true;
    this.getKeycloakUsers();
    // this.getRoutingEngineUsers();



  }

  pageChange(e) { localStorage.setItem('currentUsersPage', e); }

  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('currentUsersPage', e);
  }

  selectPage() { this.itemsPerPage = this.selectedItem; }
}