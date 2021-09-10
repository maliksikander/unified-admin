import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
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
  // typeServiceReq = 'channel-types';
  // channelServiceReq = 'channels';
  channelTypes = [];
  channels = [];

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.commonService.checkTokenExistenceInStorage();
    this.getChannelType();
  }

  getChannelType() {
    //calling endpoint service method to get channel types list which accepts its request endpoint as parameter
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
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to sanitize and bypass dom security warnings for channel type logo images
  // transform(image) {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(image);
  // }

  transform(filename) {
    // this.getFileStats(file)
    return `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${filename}`
    // return this.sanitizer.bypassSecurityTrustResourceUrl(image);
  }

  //to get channels list, it accepts channel-type-id as `typeId` parameter for fetching type particular channels
  getChannels(typeId) {
    //calling endpoint service method to get channel list which accepts resource name as 'channelServiceReq' and channnel type id as `typeId` object as parameter
    this.endPointService.getChannelByChannelType(typeId).subscribe(
      (res: any) => {
        this.spinner = false;
        this.channels = res;
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to create channel, it accepts `data` object as parameter containing channel properties
  createChannel(data) {
    //calling endpoint service method which accepts resource name as 'channelServiceReq' and `data` object as parameter
    this.endPointService.createChannel(data).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage("success-snackbar", "Channel Created", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update channel, it accepts `data` object as parameter containing channel properties
  updateChannel(data) {
    //calling endpoint service method which accepts resource name as 'channelServiceReq' and `data` object as parameter
    this.endPointService.updateChannel(data, data.serviceIdentifier).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage("success-snackbar", "Updated", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to delete channel, it accepts `data` object as parameter containing channel  properties and
  //splices the particular object from local list variable if there is a success response.
  deleteChannel(data) {
    //calling endpoint service method which accepts resource name as 'channelServiceReq' and channel id as `id` object as parameter
    this.endPointService.deleteChannel(data.serviceIdentifier).subscribe(
      (res: any) => {
        this.spinner = false;
        this.channels = this.channels.filter(item => item.id != data.id);
        this.snackbar.snackbarMessage('success-snackbar', "Deleted", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to edit channel and change the view to form page and load input fields and pass channel object as 'data' parameter
  editChannel(data) {
    this.addChannelBool = true;
    this.pageTitle =
      "Edit" +
      " " +
      data.channelConnector.channelType.typeName +
      " " +
      "Type Channel";
    // console.log("datya-->",data)
    this.editChannelData = data;
    this.channelType = data.channelConnector.channelType;
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
    this.addChannelBool = true;
    this.channelType = type;
    this.pageTitle = "Set up" + " " + type.typeName + " " + "Type Channel";
  }

  //to change the view from `form` to `list` page and load channel type list and it accepts boolean value as 'e' parameter from child component
  childToParentUIChange(e) {
    this.addChannelBool = e;
    if (this.addChannelBool == false) {
      this.pageTitle = "Customer Channels";
      this.editChannelData = undefined;
    }
  }

  //to get channel list by channel type id on expansion panel event, it accepts channel type object as 'data' paramter
  panelOpenCallback(data) {
    this.channels = [];
    this.spinner = true;
    this.getChannels(data.id);
  }

  //to create/update a channel, it accepts channel object as 'data' paramter
  onSave(data) {
    this.spinner = true;
    this.addChannelBool = false;
    this.pageTitle = "Customer Channels";
    this.editChannelData = undefined;
    if (data.id) {
      this.updateChannel(data);
    } else {
      this.createChannel(data);
    }
  }
}
