import { Component, OnInit } from "@angular/core";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-mrd-tasks",
  templateUrl: "./mrd-tasks.component.html",
  styleUrls: ["./mrd-tasks.component.scss"],
})
export class MrdTasksComponent implements OnInit {
  warningBool: boolean = true;
  p: any = 1;
  spinner: any = true;
  searchTerm = "";
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  userData = [];
  keycloakUsers = [];
  routingEngineUsers = [];
  mrdTasksData = [];
  managePermission: boolean = false;

  constructor(
    private endPointService: EndpointService,
    private snackbar: SnackbarService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    let pageNumber = sessionStorage.getItem("currentMrdTaskPage");
    if (pageNumber) this.p = pageNumber;
    this.getData();

    this.managePermission = this.commonService.checkManageScope("agent-mrd");
  }

  getData() {
    this.getMrdTaskList();
    this.getUsers();
  }

  taskArray(mrd) {
    let maxRequests = mrd.maxRequests;
    if (mrd.id == "6298b744b777de61844f616b") {
      maxRequests = 1;
    } else {
      maxRequests = ++maxRequests;
    }
    return new Array(maxRequests);
  }

  //save page number storage for reload
  pageChange(e) {
    sessionStorage.setItem("currentMrdTaskPage", e);
  }

  //page bound change and saving for reload
  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("currentMrdTaskPage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }

  //get keycloak users and set the local user list
  getKeycloakUsers() {
    // this.spinner = true;
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

  // get MRD Task List
  getMrdTaskList() {
    try {
      this.endPointService.getMrd().subscribe(
        (res: any) => {
          this.mrdTasksData = JSON.parse(JSON.stringify(res));
          //const mrdTasksDataLength = this.mrdTasksData.length;
          // if (mrdTasksDataLength > 0) {
          //   console.log("mrdTasksDataLength: ", this.mrdTasksData);
          // }
        },
        (error) => {
          console.error("Error fetching:", error);
          if (error && error.status == 0)
            this.snackbar.snackbarMessage(
              "error-snackbar",
              error.statusText,
              1
            );
        }
      );
    } catch (error) {
      console.error("Error on get Mrd Task List :", error);
    }
  }

  //get keycloak users
  getUsers() {
    // this.spinner = true;
    this.userData = [];
    this.getKeycloakUsers();
  }

  //to update AGENT and it accepts `data` object & `id` as parameter , `data` object (data.associatedMrds: array)
  //and updating the local list with the success response object

  updateAgent(data, id) {
    try {
      this.endPointService.updateAgent(data, id).subscribe(
        (res: any) => {
          if (res.id) {
            this.snackbar.snackbarMessage(
              "success-snackbar",
              "AssociatedMrd List Updated Successfully",
              1
            );
          }
          this.spinner = false;
          this.getData();
          console.log("Response of APIs: ", res);
        },
        (error: any) => {
          this.spinner = false;
          console.error("Error Updating MRD:", error);
          if (error && error.status == 0)
            this.snackbar.snackbarMessage(
              "error-snackbar",
              error.statusText,
              1
            );
        }
      );
    } catch (error) {
      console.error("Error on the Agent Update :", error);
    }
  }

  onMrdSelect(e, data, mrd) {
    try {
      let mrdData = JSON.parse(JSON.stringify(data.associatedMrds));
      this.spinner = true;
      let attr = mrdData.find((item) => item.mrdId == mrd);
      attr.maxAgentTasks = parseInt(e);
      let index = mrdData.indexOf(attr);
      mrdData[index] = attr;
      data.associatedMrds = mrdData;
      if (data.keycloakUser.firstName == null) data.keycloakUser.firstName = "";
      if (data.keycloakUser.lastName == null) data.keycloakUser.lastName = "";
      this.updateAgent(data, data.id);
    } catch (e) {
      console.error("Error on status change :", e);
    }
    // this.ngOnInit();
  }

  getMaxAgentTasks(mrdId, associatedMrdList: any) {
    try {
      const associateMrdObj = associatedMrdList.find((item) => {
        return item.mrdId == mrdId;
      });
      if (associateMrdObj) return associateMrdObj.maxAgentTasks;
    } catch (error) {
      console.error("Unable to fetch associatedMrdList: ", error);
    }
  }
}
