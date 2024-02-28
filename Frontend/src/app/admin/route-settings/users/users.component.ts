import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class UsersComponent implements OnInit {
  p: any = 1;
  warningBool: boolean = true;
  itemsPerPageList = [5, 10, 15, 30, 50];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  spinner: any = true;
  searchTerm = "";
  attributeFilterTerm = "";
  selectedAttributeFilterTerm = "";
  formErrors = {
    attributes: "",
  };
  validations;
  userForm: FormGroup;
  userAttributeForm: FormGroup;
  formHeading = "User Profile";
  // reqServiceType = 'agents';
  userData = [];
  attrData = [];
  attrSpinner = false;
  attrValueList = [];
  customCollapsedHeight: string = "48px";
  customExpandedHeight: string = "48px";
  dataSource = [];
  columnsToDisplay = ["name", "weight", "symbol", "position"];
  expandedElement: "collapsed";
  @ViewChild("attributeMenuTrigger") attributeMenuTrigger: MatMenuTrigger;
  attrName = "";
  attrValue = "";
  attrType: any;
  attrId;
  userObj;
  keycloakUsers = [];
  routingEngineUsers = [];
  rolesTooltip = [];
  save = "save";
  editREUserData: any;
  newREUserData: any;
  managePermission: boolean = false;
  selectedQueueItems: any[] = []; // Array to store selected Queue items
  selectedAttributeItems: any[] = []; // Array to store selected Attribute items


   teamAttributes = [];
   availabeAgentsLis = [
  //   {
  //     'id': '6540ac42kk',
  //     'userName': 'john-hamilton',
  //     'firstName': 'john ',
  //     'lastName': 'Hamilton',
  //     'email': 'aclemits0@pagesperso-orange.fr',
  //     isSelected: false

  //   }, {
  //     'id': '42kke99790',
  //     'userName': 'andrewT9',
  //     'firstName': 'Andrew ',
  //     'lastName': 'Trate',
  //     'email': 'bjays1@technorati.com',
  //     isSelected: false

  //   }, {
  //     'id': '138a594244e9',
  //     'userName': 'mhanery98',
  //     'firstName': 'Michal ',
  //     'lastName': 'Hanery',
  //     'email': 'rfernandez3@elegantthemes.com',
  //     isSelected: false

  //   }, {
  //     'id': '65138a5942',
  //     'userName': 'g_ashley',
  //     'firstName': 'ashley ',
  //     'lastName': 'graham',
  //     'email': 'aclemits0@pagesperso-orange.fr',
  //     isSelected: false

  //   }, {
  //     'id': '54138a5942',
  //     'userName': 'a_miller54',
  //     'firstName': 'Adam ',
  //     'lastName': 'Miller',
  //     'email': 'cnevin4@istockphoto.com',
  //     isSelected: false

  //   }, {
  //     'id': '6540ac4299',
  //     'userName': 'h_andy541',
  //     'firstName': 'Hamilton ',
  //     'lastName': 'Andu',
  //     'email': 'aclemits0@pagesperso-orange.fr',
  //     isSelected: false

  //   }, {
  //     'id': '138a594244e9',
  //     'userName': 'mhanery98',
  //     'firstName': 'Michal ',
  //     'lastName': 'Hanery',
  //     'email': 'rfernandez3@elegantthemes.com',
  //     isSelected: false

  //   }, {
  //     'id': '65138a5942',
  //     'userName': 'g_ashley',
  //     'firstName': 'ashley ',
  //     'lastName': 'graham',
  //     'email': 'aclemits0@pagesperso-orange.fr',
  //     isSelected: false

  //   }, {
  //     'id': '54138a5942',
  //     'userName': 'a_miller54',
  //     'firstName': 'Adam ',
  //     'lastName': 'Miller',
  //     'email': 'cnevin4@istockphoto.com',
  //     isSelected: false

  //   }, {
  //     'id': '6540ac4299',
  //     'userName': 'h_andy541',
  //     'firstName': 'Hamilton ',
  //     'lastName': 'Andu',
  //     'email': 'aclemits0@pagesperso-orange.fr',
  //     isSelected: false

  //   }, {
  //     'id': '4758e99790',
  //     'userName': 'j_trate55',
  //     'firstName': 'Json ',
  //     'lastName': 'Trate',
  //     'email': 'aclemis0@pagesperso-orange.fr',
  //     isSelected: false

  //   }, {
  //     'id': '588a594244e9',
  //     'userName': 'ncawsy5',
  //     'firstName': 'Norton ',
  //     'lastName': 'Cawsy',
  //     'email': 'aclemis0@pagesperso-orange.fr',
  //     isSelected: false

  //   }
  ];
  masterSelected: boolean;
  checkedList: any;
  masterSelected2: boolean;
  checkedList2: any;
  dropdownList = [];
  selectedTeam = [];
  queueDropdownSettings: any;
  attributeDropdownSettings:any;
  availableTeam = [];
  selectedData: any;
  ngSelectedQueues: any; // for ng model data model
  ngSelectedAttributes: any; // for ng model data model
  selectedQueue: any;
  selectedAttribute: any;


  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();
    
    // this.dropdownList = [
    //   {'id': 1, 'team': 'Marketing', 'queue': 'Technical support', 'attribute': 'channel team'},
    //   {'id': 2, 'team': 'Sales', 'queue': 'Chat Queue', 'attribute': 'English'},
    //   {'id': 3, 'team': 'Customer support','queue': 'voice Queue', 'attribute': 'voice'},
    //   {'id': 4, 'team': 'Customer Interaction', 'queue':'support', 'attribute': 'chat only'},
    //   {'id': 5, 'team': 'Technical support', 'queue':'Marketing', 'attribute': 'Andrew Trate'},
    //   {'id': 6, 'team': 'Chat Support', 'queue':'customer support', 'attribute': 'Customer Support'},
    //   {'id': 7, 'team': 'Voice support', 'queue':'telegram', 'attribute': 'seles'},
    // ];
    // this.selectedTeam = [
    //   {'id': 1, 'team': 'Marketing'},
    //   {'id': 2, 'team': 'Sales'},
    // ];
    this.queueDropdownSettings = {
      singleSelection: true,
      text: '',
      enableSearchFilter: true,
      classes: 'custom-class',
      badgeShowLimit: 3,
      searchPlaceholderText: 'Search'
    };

this.attributeDropdownSettings = {
  singleSelection: false,
  text: '',
  enableSearchFilter: true,
  classes: 'custom-class',
  badgeShowLimit: 3,
  searchPlaceholderText: 'Search'
};

    //setting local form validation messages
    this.validations = this.commonService.userFormErrorMessages;

    let pageNumber = sessionStorage.getItem("currentUsersPage");
    if (pageNumber) this.p = pageNumber;

    this.userForm = this.formBuilder.group({
      username:[""],
      firstName: [""],
      lastName: [""],
      roles: [""],
    });

    this.userAttributeForm = this.formBuilder.group({
      associatedRoutingAttributes: [[]],
    });

    // to disable user form controls
    this.userForm.controls["firstName"].disable();
    this.userForm.controls["lastName"].disable();
    this.userForm.controls["username"].disable();
    //checking for attribute form validation failure
    // this.userAttributeForm.valueChanges.subscribe((data) => {
    //   this.commonService.logValidationErrors(this.userAttributeForm, this.formErrors, this.validations);
    // });

    this.getUsers();
    this.managePermission = this.commonService.checkManageScope("agent-attributes");
  }

  //resetting dialog
  onClose() {
    this.dialog.closeAll();
    this.searchTerm = "";
  }

  //to get RE attributes and upadte if already assigned to any agent
  getAttribute() {
    this.endPointService.getAttribute().subscribe(
      (res: any) => {
        this.attrData = JSON.parse(JSON.stringify(res));
        this.teamAttributes=this.attrData;
        console.log("ATTRIBUTE ===>", this.attrData)
        if (this.attrData && this.attrData.length > 0) {
          this.attrData.map((item) => {
            item.isChecked = false;
          });
          if (
            this.userAttributeForm.value.associatedRoutingAttributes &&
            this.userAttributeForm.value.associatedRoutingAttributes.length > 0
          )
            this.attrData.forEach((attr) => {
              this.userAttributeForm.value.associatedRoutingAttributes.forEach(
                (selected) => {
                  if (attr.id == selected.routingAttribute.id) {
                    attr.isChecked = true;
                  }
                }
              );
            });
        }
        this.spinner = false;
        this.attrSpinner = false;
      },
      (error) => {
        this.spinner = false;
        this.attrSpinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get RE queues
  getQueue() {
   
    this.endPointService.getQueue().subscribe(
      (res: any) => {
        this.dropdownList=res;
        console.log("QUEUE ===>", this.dropdownList)
       
        
      },
      (error) => {
       
        console.error("Error fetching:", error);
      //   if (error && error.status == 0)
      //     this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
       }
    );
  }

  //update routing engine user with RE user object as 'data' parameter and object id as 'id'
  updateREUserAttribute(data, id) {
    this.endPointService.updateAgent(data, id).subscribe(
      (res: any) => {
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "User Updated Successfully",
          1
        );
        if (res.id) {
          let user = this.userData.find(
            (item) => item.keycloakUser.id == res.keycloakUser.id
          );
          let index = this.userData.indexOf(user);
          this.userData[index] = res;
        }
        this.dialog.closeAll();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //removing user from RE
  deleteREUser(id) {
    this.endPointService.deleteAgent(id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.getUsers();
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        else if (error && error.status == 409)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "Agent is assigned to a task,Cannot be deleted",
            1
          );
      }
    );
  }

  //to edit User attributes ,it accepts `templateRef' & user object as `item` (keycloakUser:object, associatedRoutingAttributes:[]) parameter
  //and patches the existing values with form controls and opens the form dialog
  editUserAttributes(templateRef, item) {
    let userData = {
      firstName: "",
      lastName: "",
      id: "",
      roles: [],
      username: "",
      realm: localStorage.getItem("tenant")
        ? localStorage.getItem("tenant")
        : sessionStorage.getItem("tenant"),
    };
    this.attrSpinner = true;
    let data = JSON.parse(JSON.stringify(item));
    this.editREUserData = JSON.parse(JSON.stringify(item));
    let temp = { ...userData, ...this.editREUserData.keycloakUser };
    this.editREUserData.keycloakUser = temp;
    if (data.associatedRoutingAttributes) {
      data.associatedRoutingAttributes.forEach((item) => {
        if (item.routingAttribute.type == "BOOLEAN") {
          if (item.value == 0) {
            item.value = "false";
          } else {
            item.value = "true";
          }
        }
      });
      this.userAttributeForm.patchValue({
        associatedRoutingAttributes: data.associatedRoutingAttributes,
      });
    }
    let dialogRef = this.dialog.open(templateRef, {
      width: "650px",
      height: "500px",
      panelClass: "add-user",
      disableClose: true,
      data: data,
    });
    this.spinner = true;
    this.getAttribute();

    dialogRef.afterClosed().subscribe((res) => {
      if (res == "save") {
        this.onSave();
      }
      this.resetAttributeForm();
    });
  }

  onSave() {
    this.spinner = true;
    let data = JSON.parse(JSON.stringify(this.editREUserData));
    data.associatedRoutingAttributes =
      this.userAttributeForm.value.associatedRoutingAttributes;
    data.participantType = "CCUser";
    if (data.associatedRoutingAttributes) {
      data.associatedRoutingAttributes.forEach((item) => {
        if (item.routingAttribute.type == "BOOLEAN") {
          if (item.value == "false") {
            item.value = 0;
          } else {
            item.value = 1;
          }
        }
      });
    }
    if (data && data.id) {
      if (data.associatedRoutingAttributes.length == 0) {
        return this.deleteREUser(data.id);
      }
      this.updateREUserAttribute(data, this.editREUserData.id);
    } else {
      this.createREUser(data);
    }
  }

  //updating state once any attribute is selected and patched along the form control and it accepts folowing paramters
  //checked event as 'e' and user object as 'data' and user object index as 'i'
  availableToSelectedAttribute(e, data, i) {
    let attrObj: any = {};
    attrObj.routingAttribute = data;
    attrObj.value = data.defaultValue;
    if (attrObj.routingAttribute.type == "BOOLEAN") {
      attrObj.value = "true";
    }
    let checked = e.target.checked;
    this.attrData[i].isChecked = checked;
    let formAttributes = JSON.parse(
      JSON.stringify(this.userAttributeForm.value.associatedRoutingAttributes)
    );
    let selectedList = [];
    if (formAttributes && formAttributes != null) selectedList = formAttributes;
    if (selectedList.length > 0) {
      let selectedIndex = selectedList.findIndex(
        (x) => x.routingAttribute.id == data.id
      );
      if (selectedIndex != -1) {
        if (checked == false) {
          this.userAttributeForm.value.associatedRoutingAttributes.splice(
            selectedIndex,
            1
          );
          this.selectedAttributeFilterTerm = "";
        }
      } else {
        if (checked == true)
          this.userAttributeForm.value.associatedRoutingAttributes.push(
            attrObj
          );
      }
    } else {
      this.userAttributeForm.value.associatedRoutingAttributes.push(attrObj);
    }
  }

  //progress bar setting
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "k";
    }
    return value;
  }

  //to open user form dialog and it accepts template reference variable assigned in html as 'templateRef' and user object as 'item'
  viewUserProfile(templateRef, item) {
    let data = JSON.parse(JSON.stringify(item));
    let roleTip = data.keycloakUser.roles;
    if (roleTip && roleTip.length > 5)
      this.rolesTooltip = roleTip.slice(5, roleTip.length);
    this.userForm.patchValue({
      username: data.keycloakUser.username ? data.keycloakUser.username : "N/A",
      firstName: data.keycloakUser.firstName
        ? data.keycloakUser.firstName
        : "N/A",
      lastName: data.keycloakUser.lastName ? data.keycloakUser.lastName : "N/A",
      roles: data.keycloakUser.roles,
    });
    let dialogRef = this.dialog.open(templateRef, {
      width: "650px",
      height: "350px",
      panelClass: "add-user",
      disableClose: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.userForm.reset();
    });
  }

  //update slider value and it accepts slider value event as 'e' and attribute object index in attribute form control as 'i'
  onSliderChange(e, i) {
    if (e.value || e.value == 0) {
      this.userAttributeForm.value.associatedRoutingAttributes[i].value =
        e.value;
    }
  }

  //update toggle value and it accepts slider value event as 'e',attribute object index in attribute form control as 'i'
  //and attribute object as  `data`
  onToggleChange(e, data, i) {
    if (e.checked || e.checked == false) {
      if (e.checked == false) {
        this.attrData.forEach((attr) => {
          if (attr.id == data.routingAttribute.id) attr.isChecked = false;
        });
        this.userAttributeForm.value.associatedRoutingAttributes[i].value = 0;
        return this.userAttributeForm.value.associatedRoutingAttributes.splice(
          i,
          1
        );
      }
      this.userAttributeForm.value.associatedRoutingAttributes[i].value = 1;
    }
  }

  //update attribute value in menu and it accepts attribute object as 'attr' and RE user object as 'data'
  updateAttributeValue(attr, data) {
    this.attrName = attr.routingAttribute.name;
    this.attrType = attr.routingAttribute.type;
    this.attrValue = attr.value;
    this.attrId = attr.routingAttribute.id;
    this.userObj = data;
    if (attr.routingAttribute.type == "BOOLEAN") {
      if (attr.value == 0) {
        this.attrValue = "false";
      } else {
        this.attrValue = "true";
      }
      this.attrValueList = ["true", "false"];
    } else {
      this.attrValueList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    }
  }

  //callback for attribute value changes in `menu` and it accepts event change as `e`
  onAttrChange(e) {
    if (
      this.userObj.associatedRoutingAttributes &&
      this.userObj.associatedRoutingAttributes.length > 0
    ) {
      this.spinner = true;
      let attr = this.userObj.associatedRoutingAttributes.find(
        (item) => item.routingAttribute.id == this.attrId
      );
      let index = this.userObj.associatedRoutingAttributes.indexOf(attr);
      this.userObj.participantType = "CCUser";
      let data = JSON.parse(JSON.stringify(this.userObj));
      if (e == "false") {
        data.associatedRoutingAttributes.splice(index, 1);
        if (data.associatedRoutingAttributes.length == 0)
          return this.removeREUser(data.id, index);
      } else {
        data.associatedRoutingAttributes[index].value = JSON.parse(e);
        this.closeMenu();
      }
      this.updateREUserAttrValue(data, data.id, index);
    }
  }

  //to remove attributes from the selected from control list
  removeAttribute() {
    if (
      this.userObj.associatedRoutingAttributes &&
      this.userObj.associatedRoutingAttributes.length > 0
    ) {
      this.spinner = true;
      let attr = this.userObj.associatedRoutingAttributes.find(
        (item) => item.routingAttribute.id == this.attrId
      );
      let index = this.userObj.associatedRoutingAttributes.indexOf(attr);
      this.userObj.participantType = "CCUser";
      let data = JSON.parse(JSON.stringify(this.userObj));
      data.associatedRoutingAttributes.splice(index, 1);
      if (data.associatedRoutingAttributes.length == 0) {
        return this.removeREUser(data.id, index);
      }
      this.updateREUserAttrValue(data, data.id, index);
    }
  }

  //removing user from RE
  removeREUser(id, index) {
    this.endPointService.deleteAgent(id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.userObj.associatedRoutingAttributes.splice(index, 1);
        this.getUsers();
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        else if (error && error.status == 409)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "Agent is assigned to a task,Cannot be deleted",
            1
          );
      }
    );
  }

  //update routing engine user with RE user object as 'data' parameter and object id as 'id'
  updateREUserAttrValue(data, id, index) {
    this.endPointService.updateAgent(data, id).subscribe(
      (res: any) => {
        // this.userObj.associatedRoutingAttributes.splice(index, 1);
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "User Updated Successfully",
          1
        );
        if (res.id) {
          let user = this.userData.find(
            (item) => item.keycloakUser.id == res.keycloakUser.id
          );
          let index = this.userData.indexOf(user);
          this.userData[index] = res;
        }
        this.dialog.closeAll();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //create RE user and accepts user object(keycloakUser:object, associatedRoutingAttributes:[]) as 'data'
  createREUser(data) {
    this.endPointService.createAgent(data).subscribe(
      (res: any) => {
        if (res.id) {
          let user = this.userData.find(
            (item) => item.keycloakUser.id == res.keycloakUser.id
          );
          let index = this.userData.indexOf(user);
          this.userData[index] = res;
        }
        this.resetAttributeForm();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //reset attribute form
  resetAttributeForm() {
    this.editREUserData = undefined;
    this.attrData = undefined;
    this.attributeFilterTerm = "";
    this.selectedAttributeFilterTerm = "";
    this.userAttributeForm.patchValue({
      associatedRoutingAttributes: [],
    });
  }

  //get keycloak users and set the local user list
  getKeycloakUsers() {
    this.spinner = true;
    this.endPointService.getKeycloakUser().subscribe(
      (res: any) => {
        this.keycloakUsers = JSON.parse(JSON.stringify(res));
        if (this.keycloakUsers && this.keycloakUsers.length > 0) {
          for (let i = 0; i < this.keycloakUsers.length; i++) {
            let temp = { keycloakUser: this.keycloakUsers[i] };
            this.userData.push(temp);
          }
        }
        this.getRoutingEngineUsers();
      },
      (error) => {
        console.error("Error fetching:", error);
        this.spinner = false;
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // get RE users list and update the local user list if any agent exists in RE list and keycloak user list
  getRoutingEngineUsers() {
    this.endPointService.getAgent().subscribe(
      (res: any) => {
        this.routingEngineUsers = JSON.parse(JSON.stringify(res));
        const usersListLength = this.userData.length;
        const routingEngineUsersLength = this.routingEngineUsers.length;
        if (usersListLength > 0 && routingEngineUsersLength > 0) {
          for (let i = 0; i < this.userData.length; i++) {
            for (let j = 0; j < this.routingEngineUsers.length; j++) {
              if (
                this.userData[i].keycloakUser.id ==
                this.routingEngineUsers[j].keycloakUser.id
              ) {
                this.userData[i].id = this.routingEngineUsers[j].id;
                this.userData[i].associatedRoutingAttributes =
                  this.routingEngineUsers[j].associatedRoutingAttributes;
              }
            }
          }
        }
        this.spinner = false;
        if (usersListLength > 0) this.warningBool = false;
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //get keycloak users
  getUsers() {
    this.spinner = true;
    this.userData = [];
    this.getKeycloakUsers();
  }

  pageChange(e) {
    sessionStorage.setItem("currentUsersPage", e);
  }

  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("currentUsersPage", e);
  }

  closeMenu() {
    this.attributeMenuTrigger.closeMenu();
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }

  //assign bulk attributes
  assignUnassignAgents(templateRef) {
    this.getAttribute()
    this.getQueue();
    
    let dialogRef = this.dialog.open(templateRef, {
      width: '100%',
      maxWidth: '1200px',
      maxHeight: '100vh',
      panelClass: ['add-attribute', 'assign-unassign-agents'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
    });

  }

  checkUncheckAll(e) {
    if (e == 'avail-agents') {

      for (var i = 0; i < this.availabeAgentsLis.length; i++) {
        this.availabeAgentsLis[i].isSelected = this.masterSelected;
      }
      this.getCheckedItemList(e);
    }
    else {

      for (var i = 0; i < this.teamAttributes.length; i++) {
        this.teamAttributes[i].isSelected = this.masterSelected2;
      }
      this.getCheckedItemList('avail-agents');
    }
  }

  isAllSelected(e) {
    if (e == 'avail-agents') {
      this.masterSelected = this.availabeAgentsLis.every(function(item: any) {
        return item.isSelected == true;
      });
      this.getCheckedItemList(e);
    }else {
      this.masterSelected2 = this.teamAttributes.every(function(item: any) {
        return item.isSelected == true;
      });
      this.getCheckedItemList('avail-agents');
    }
  }

  getCheckedItemList(e) {
    this.checkedList = [];
    this.checkedList2 = [];
    if (e == 'avail-agents') {
      for (var i = 0; i < this.availabeAgentsLis.length; i++) {
        if (this.availabeAgentsLis[i].isSelected) {
          this.checkedList.push(this.availabeAgentsLis[i]);
        }
      }
      this.checkedList = JSON.stringify(this.checkedList);
    }
    else {
      for (var i = 0; i < this.teamAttributes.length; i++) {
        if (this.teamAttributes[i].isSelected) {
          this.checkedList2.push(this.teamAttributes[i]);
        }
      }
      this.checkedList2 = JSON.stringify(this.checkedList2);
    }
  }

  onItemSelect(item: any) {
  // this.selectedData = item;
    if(item.serviceLevelType){
      this.selectedQueue = item;
      console.log('this.selectedQueue', this.selectedQueue);
    }else{
      this.selectedAttribute = item;
      console.log('this.selectedAttribute', this.selectedAttribute);
  }
    
    //call add agent API here
  }

  OnItemDeSelect(item: any) {
  //   this.selectedData = item;
  //   console.log('this.selectedData', this.selectedData);   
  // }
  if (item.serviceLevelType) {
    // Remove the item from the selectedQueueItems array
    this.selectedQueueItems = this.selectedQueueItems.filter(q => q !== item);
    console.log('Delected Queue Items', this.selectedQueueItems);
  } else {
    // Remove the item from the selectedAttributeItems array
    this.selectedAttributeItems = this.selectedAttributeItems.filter(a => a !== item);
    console.log('Delected Attribute Items', this.selectedAttributeItems);
  }
}
}