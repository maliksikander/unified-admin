import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-channel-type",
  templateUrl: "./channel-type.component.html",
  styleUrls: ["./channel-type.component.scss"],
})
export class ChannelTypeComponent implements OnInit {
  addType: boolean = false;
  spinner: boolean = true;
  pageTitle: String = "Channel Types";
  editTypeData;
  typeList = [];
  searchTerm: String = "";
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.commonService.checkTokenExistenceInStorage();
    let pageNumber = sessionStorage.getItem("channelTypePage");
    if (pageNumber) this.p = pageNumber;
    this.getChannelTypes();
  }

  //to get channel type list
  getChannelTypes() {
    //calling endpoint service method to get channel list which accepts resource name as 'channelServiceReq' and channnel type id as `typeId` object as parameter
    this.endPointService.getChannelType().subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("res-->", res);
        this.typeList = res;
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
      }
    );
  }

  //to get logo/image from file engine, it accepts the file name as parameter and returns the url
  getFileURL(filename) {
    return `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${filename}`;
  }

  //to change form ui view to list view
  childToParentUIChange(e): void {
    this.addType = e;
    if (this.addType == false) {
      this.pageTitle = "Channel Type";
    }
    this.editTypeData = undefined;
  }

  //to enable channel type form view and change page title
  addChannelType() {
    this.addType = true;
    this.pageTitle = "Channel Type Settings";
  }

  //to edit channel type and enable form view and change page title an pass data to child component
  editChannelType(data) {
    this.addType = true;
    this.pageTitle = "Edit Channel Type Settings";
    this.editTypeData = data;
  }

  //Confirmation dialog for delete operation , it accepts the attribute object as `data` parameter
  deleteConfirm(data) {
    // let id = data.id;
    let msg = "Are you sure you want to delete this channel type ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Delete Channel Type",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteChannelType(data);
        } else {
          this.spinner = false;
        }
      });
  }

  //to delete channel type, it accepts `data` as parameter containing channel type properties and
  //filters that particular object from local list variable if there is a success response.
  deleteChannelType(data) {
    //calling endpoint service method which accepts resource name as 'reqEndpoint' and channel type id as `id` object as parameter
    this.endPointService.deleteChannelType(data.id).subscribe(
      (res: any) => {
        this.spinner = false;
        this.typeList = this.typeList.filter((item) => item.id != data.id);
        this.snackbar.snackbarMessage("success-snackbar", "Deleted", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
      }
    );
  }

  //on save callback function
  onSave(msg) {
    this.pageTitle = "Channel Type";
    this.addType = false;
    this.spinner = true;
    this.snackbar.snackbarMessage("success-snackbar", msg, 1);
    this.getChannelTypes();
  }

  // ngx-pagination setting methods
  pageChange(e) {
    sessionStorage.setItem("channelTypePage", e);
  }

  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("channelTypePage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }
}
