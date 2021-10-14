import {
  HttpClient,
} from "@angular/common/http";
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
  

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,
    private httpClient: HttpClient,
  ) {}

  ngOnInit() {
    this.commonService.checkTokenExistenceInStorage();
    let pageNumber = sessionStorage.getItem("currentConnectorPage");
    if (pageNumber) this.p = pageNumber;

    this.getChannelConnector();
  }

  //to get logo/image from file engine, it accepts the file name as parameter and returns the url
  getFileURL(filename) {
    return `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${filename}`;
  }

  // expansion panel callback function,triggered on expanded event
  // panelOpenCallback(data) {
  //   this.channelConnectors = [];
  //   this.spinner = true;
  //   this.getChannelConnector(data.id);
  // }

  //to change view to settings and pass connector object to child component
  editChannelConnector(data) {
    this.addChannelBool = true;
    this.pageTitle = `Edit Connector Settings`;
    this.editConnectorData = data;
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
    this.addChannelBool = true;
    this.pageTitle = `Channel Connector Settings`;
  }

  // reset UI to list view from settings view
  resetUI() {
    this.addChannelBool = false;
    this.pageTitle = "Channel Connectors";
    this.editConnectorData = undefined;
  }

  // to reset view on save event received by the child component
  onSave(msg) {
    this.resetUI();
    this.snackbar.snackbarMessage("success-snackbar", msg, 1.5);
  }



  // to fetch connector list
  getChannelConnector() {
    this.endPointService.getConnector().subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelConnectors = res;
        // this.getConnectorStatus(this.channelConnectors);
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update channel connector and it accepts `data` object as parameter containing channel connector properties
  deleteChannelConnector(data) {
    //calling endpoint service method which accepts resource name as 'connectorServiceReq' and connector id as `id` object as parameter
    this.endPointService.deleteConnector(data.id).subscribe(
      (res: any) => {
        this.spinner = false;

        this.channelConnectors = this.channelConnectors.filter(
          (item) => item.id != data.id
        );

        this.snackbar.snackbarMessage("success-snackbar", "Deleted", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to hit channel connector health endpoint, it accetps the connectors list as parameter and takes the request URL from the `interface address` attribute
  getConnectorStatus(list) {
    list.forEach((item) => {
      let url = item.interfaceAddress;
      this.httpClient.get(`${url}/channel-connectors/health`).subscribe(
        (res: any) => {
          item["status"] = res.status.toLowerCase();
        },
        (error: any) => {
          this.spinner = false;
          item["status"] = "unhealthy";
          console.error("Error fetching:", error);
          if (error && error.status == 0)
            this.snackbar.snackbarMessage(
              "error-snackbar",
              error.statusText,
              1
            );
        }
      );
    });
    this.spinner = false;
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

}
