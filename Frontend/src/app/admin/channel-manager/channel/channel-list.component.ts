import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-channel-manager-settings",
  templateUrl: "./channel-list.component.html",
  styleUrls: ["./channel-list.component.scss"],
})
export class ChannelListComponent implements OnInit {
  spinner = true;
  customCollapsedHeight: string = "40px";
  customExpandedHeight: string = "40px";
  addChannelBool = false;
  pageTitle = "Channels";
  editChannelData;
  channelType;
  channelTypes = [];
  channels = [];

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();
    this.getChannelType();
  }

  //calling endpoint service method to get channel types list which accepts its request endpoint as parameter
  getChannelType() {
    this.endPointService.getChannelType().subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelTypes = res;
        if (res.length == 0)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "No Channel Type Found",
            2
          );
      },
      (error) => {
        this.spinner = false;
        console.error("Error Fetching Channel Type:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get logo/image from file engine, it accepts the file name as parameter and returns the url
  getFileURL(filename) {
    return `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${filename}`;
  }

  //to get channels list, it accepts channel-type-id as `typeId` parameter for fetching type particular channels
  getChannels(typeId) {
    this.endPointService.getChannelByChannelType(typeId).subscribe(
      (res: any) => {
        this.spinner = false;
        this.channels = res;
      },
      (error) => {
        this.spinner = false;
        console.error("Error Fetching Channel:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to delete channel, it accepts `data` object as parameter containing channel  properties and
  //splices the particular object from local list variable if there is a success response.
  deleteChannel(data) {
    this.endPointService.deleteChannel(data.id).subscribe(
      (res: any) => {

        this.removeRecordFromLocalList(data);
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Fetching Delete Channel:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // to remove the deleted channel connector from local list, it expects the data object of the record as paramter on success response
  removeRecordFromLocalList(data) {
    try {
      this.channels = this.channels.filter((item) => item.id != data.id);
      this.snackbar.snackbarMessage("success-snackbar", "Deleted", 1);
    } catch (e) {
      this.spinner = false;
      console.error("Error in removing record from local:", e);
    }
  }

  //to edit channel and change the view to form page and load input fields and pass channel object as 'data' parameter
  editChannel(data) {
    try {
      this.addChannelBool = true;
      this.pageTitle = `Edit Channel Settings`;
      this.editChannelData = data;
      this.channelType = data.channelType;
    } catch (e) {
      console.error("Error in edit channel :", e);
    }
  }

  // to open delete confirmation dialog
  deleteConfirm(data) {
    let msg = "Are you sure you want to delete this Channel ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Delete Channel",
          message: msg,
          text: "confirm",
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteChannel(data);
        } else {
          this.spinner = false;
        }
      });
  }

  //to add channel and change the view to form page and load input fields and pass channel type object as 'type' parameter
  addChannel(type) {
    try {
      this.addChannelBool = true;
      this.channelType = type;
      this.pageTitle = `New Channel`;
    } catch (e) {
      console.error("Error in add channel :", e);
    }
  }

  //to change the view from `form` to `list` page and load channel type list and it accepts boolean value as 'e' parameter from child component
  childToParentUIChange(e) {
    try {
      this.addChannelBool = e;
      if (this.addChannelBool == false) {
        this.pageTitle = "Channels";
        this.editChannelData = undefined;
      }
    } catch (e) {
      console.error("Error in ui change :", e);
    }
  }

  //to get channel list by channel type id on expansion panel event, it accepts channel type object as 'data' paramter
  panelOpenCallback(channelType) {
    this.channels = [];
    this.spinner = true;
    this.getChannels(channelType.id);
  }

  //to create/update a channel, it accepts channel object as 'data' paramter
  onSave(msg) {
    try {
      this.addChannelBool = false;
      this.pageTitle = "Channels";
      this.editChannelData = undefined;
      this.snackbar.snackbarMessage("success-snackbar", msg, 1);
    } catch (e) {
      console.error("Error on save :", e);
    }
  }
}
