import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-channel-connector",
  templateUrl: "./channel-connector.component.html",
  styleUrls: ["./channel-connector.component.scss"],
})
export class ChannelConnectorComponent implements OnInit {
  spinner = true;
  customCollapsedHeight: string = "40px";
  customExpandedHeight: string = "40px";
  addChannelBool = false;
  pageTitle = "Channel Connectors";
  channelConnectors = [];
  editConnectorData;
  searchTerm = "";
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  managePermission:boolean = false;

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();
    let pageNumber = sessionStorage.getItem("currentConnectorPage");
    if (pageNumber) this.p = pageNumber;

    this.getChannelConnector();
    this.managePermission = this.commonService.checkManageScope("channel");
  }

  //to get logo/image from file engine, it accepts the file name as parameter and returns the url
  getFileURL(filename) {
    return `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${filename}`;
  }

  //to change view to settings and pass connector object to child component
  editChannelConnector(data) {
    try {
      this.addChannelBool = true;
      this.pageTitle = `Edit Connector Settings`;
      this.editConnectorData = data;
    } catch (e) {
      console.error("Error in edit connector :", e);
    }
  }

  // to open delete confirmation dialog
  deleteConfirm(data) {
    let msg = "Are you sure you want to delete this Channel Connector?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Delete Channel Connector",
          message: msg,
          text: "confirm",
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteChannelConnector(data);
        } else {
          this.spinner = false;
        }
      });
  }

  // change UI to settings view from list view
  changeViewToSetings() {
    try {
      this.addChannelBool = true;
      this.pageTitle = `New Channel Connector`;
    } catch (e) {
      console.error("Error in view setting method :", e);
    }
  }

  // reset UI to list view from settings view
  resetUI() {
    try {
      this.addChannelBool = false;
      this.pageTitle = "Channel Connectors";
      this.editConnectorData = undefined;
    } catch (e) {
      console.error("Error in reset UI :", e);
      this.spinner = false;
    }
  }

  // to reset view on save event received by the child component
  onSave(msg) {
    try {
      this.spinner = true;
      this.resetUI();
      this.snackbar.snackbarMessage("success-snackbar", msg, 1.5);
      this.getChannelConnector();
    } catch (e) {
      console.error("Error on save :", e);
    }
  }

  // to fetch connector list
  getChannelConnector() {
    this.endPointService.getConnector().subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelConnectors = res;
      },
      (error) => {
        this.spinner = false;
        console.error("Error Fetching Connector List :", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update channel connector and it accepts `data` object as parameter containing channel connector properties
  deleteChannelConnector(data) {
    this.endPointService.deleteConnector(data.id).subscribe(
      (res: any) => {
        this.removeRecordFromLocalList(data);
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

  // to remove the deleted channel connector from local list, it expects the data object of the record as paramter on success response
  removeRecordFromLocalList(data) {
    try {
      this.channelConnectors = this.channelConnectors.filter(
        (item) => item.id != data.id
      );
      this.snackbar.snackbarMessage("success-snackbar", "Deleted", 1);
    } catch (e) {
      this.spinner = false;
      console.error("Error in removing record from local:", e);
    }
  }

  //save page number storage for reload
  pageChange(e) {
    sessionStorage.setItem("currentConnectorPage", e);
  }

  //page bound change and saving for reload
  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("currentConnectorPage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }

  // //to hit channel connector health endpoint, it accetps the connectors list as parameter and takes the request URL from the `interface address` attribute
  // getConnectorStatus(list) {
  //   list.forEach((item) => {
  //     let url = item.interfaceAddress;
  //     this.httpClient.get(`${url}/channel-connectors/health`).subscribe(
  //       (res: any) => {
  //         item["status"] = res.status.toLowerCase();
  //       },
  //       (error: any) => {
  //         this.spinner = false;
  //         item["status"] = "unhealthy";
  //         console.error("Error fetching:", error);
  //         if (error && error.status == 0)
  //           this.snackbar.snackbarMessage(
  //             "error-snackbar",
  //             error.statusText,
  //             1
  //           );
  //       }
  //     );
  //   });
  //   this.spinner = false;
  // }
}
