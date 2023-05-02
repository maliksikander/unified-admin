import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-channel-provider",
  templateUrl: "./channel-provider.component.html",
  styleUrls: ["./channel-provider.component.scss"],
})
export class ChannelProviderComponent implements OnInit {
  addChannelProvider: boolean = false;
  spinner: boolean = true;
  pageTitle: String = "Channel Providers";
  editProviderData;
  channelProviderList = [];
  searchTerm: String = "";
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  managePermission: boolean = false;

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    // this.commonService.checkTokenExistenceInStorage();
    let pageNumber = sessionStorage.getItem("currentProviderPage");
    if (pageNumber) this.p = pageNumber;

    this.getChannelProviders();
    this.managePermission = this.commonService.checkManageScope("channel");
  }

  //to get channel provider list
  getChannelProviders() {
    this.endPointService.getChannelProvider().subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelProviderList = res;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Fetching Channel Providers :", error);
      }
    );
  }

  //to get logo/image from file engine, it accepts the file name as parameter and returns the url
  getFileURL(filename) {
    return `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${filename}`;
  }

  //to change form ui view to list view
  childToParentUIChange(e): void {
    try {
      this.addChannelProvider = e;
      if (this.addChannelProvider == false) {
        this.pageTitle = "Channel Providers";
      }
      this.editProviderData = undefined;
    } catch (e) {
      console.error("Error in ui change method :", e);
    }
  }

  //to enable channel provider form view and change page title
  addProvider() {
    try {
      this.addChannelProvider = true;
      this.pageTitle = "New Channel Provider";
    } catch (e) {
      console.error("Error in add provider :", e);
    }
  }

  //to edit channel provider and enable form view and change page title an pass data to child component
  editChannelProvider(data) {
    try {
      this.addChannelProvider = true;
      this.pageTitle = "Edit Channel Provider Settings";
      this.editProviderData = data;
    } catch (e) {
      console.error("Error in edit provider :", e);
    }
  }

  //Confirmation dialog for delete operation , it accepts the provider object as `data` parameter
  deleteConfirm(data) {
    let msg = "Are you sure you want to delete this channel provider?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: ['confirm-dialog-container' , 'delete-confirmation'],
        disableClose: true,
        data: {
          heading: "Delete Channel Provider",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteChannelProvider(data);
        } else {
          this.spinner = false;
        }
      });
  }

  //to delete channel provider, it accepts `data` as parameter containing channel provider properties and
  //filters that particular object from local list variable if there is a success response.
  deleteChannelProvider(data) {
    this.endPointService.deleteChannelProvider(data.id).subscribe(
      (res: any) => {
        this.removeRecordFromLocalList(data);
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
      }
    );
  }

  // to remove the deleted channel provider from local list, it expects the data object of the record as paramter on success response
  removeRecordFromLocalList(data) {
    try {
      this.channelProviderList = this.channelProviderList.filter(
        (item) => item.id != data.id
      );
      this.snackbar.snackbarMessage("success-snackbar", "Deleted", 1);
    } catch (e) {
      this.spinner = false;
      console.error("Error in removing record from local:", e);
    }
  }

  //on save callback function
  onSave(msg) {
    try {
      this.pageTitle = "Channel Type";
      this.addChannelProvider = false;
      this.spinner = true;
      this.snackbar.snackbarMessage("success-snackbar", msg, 1);
      this.getChannelProviders();
    } catch (e) {
      console.error("Error on save callback:", e);
    }
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
