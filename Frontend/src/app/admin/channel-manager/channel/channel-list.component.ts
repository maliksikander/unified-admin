import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-channel-manager-settings',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss']
})
export class ChannelListComponent implements OnInit {

  spinner = true;
  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '40px';
  addChannelBool = false;
  pageTitle = "Customer Channels";
  editChannelData;
  channelType;
  typeServiceReq = 'channel-types';
  channelServiceReq = 'channels';
  channelTypes = [];
  channels = [];


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.getChannelType();
  }


  getChannelType() {

    //calling endpoint service method to get channel types list which accepts its resource name as 'typeServiceReq' parameter
    this.endPointService.getChannel(this.typeServiceReq).subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelTypes = res.channelTypes;
        if (res.channelTypes.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  editChannel(data) {

    // console.log("edit data-->",data.channelConnector.type);
    this.addChannelBool = true;
    this.pageTitle = "Edit" + " " + data.channelConnector.type.typeName + " " + "Type Channel";
    this.editChannelData = data;
    this.channelType = data.channelConnector.type;
  }


  deleteConfirm(data) {
    // let id = data._id;
    let msg = "Are you sure you want to delete this Channel ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Channel",
        message: msg,
        text: 'confirm',
        // data: data
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') {
        this.deleteChannel(data);
      }
      else { this.spinner = false; }
    });
  }


  addChannel(type) {
    this.addChannelBool = true;
    // console.log("type-->",type);
    // if (type === 'whatsapp') this.pageTitle = "Set up Whatsapp Channel";
    // else if (type === 'facebook') this.pageTitle = "Set up Facebook Channel";
    // else if (type === 'web') this.pageTitle = "Set up Web Chat Channel";
    // else if (type === 'viber') this.pageTitle = "Set up Viber Channel";
    // else if (type === 'forwardProxy') this.pageTitle = "Set up Forward Proxy Channel";
    // else if (type === 'smpp') this.pageTitle = "Set up SMPP Channel";
    this.addChannelBool = true;
    this.channelType = type;
    this.pageTitle = "Set up" + " " + type.typeName + " " + "Type Channel";
  }

  childToParentUIChange(e) {
    this.addChannelBool = e;
    if (this.addChannelBool == false) {
      this.pageTitle = "Customer Channels";
    }

  }

  panelOpenCallback(data) {

    this.spinner = true;
    this.getChannels(data.id);
  }

  getChannels(typeId) {

    //calling endpoint service method to get channel list which accepts resource name as 'channelServiceReq' and channnel type id as `typeId` object as parameter
    this.endPointService.getByChannelType(this.channelServiceReq, typeId).subscribe(
      (res: any) => {
        this.spinner = false;
        this.channels = res;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  onSave(data) {
    this.spinner = true;
    this.addChannelBool = false;
    this.pageTitle = "Customer Channels";
    this.editChannelData = undefined;
    // console.log("save data-->", data)
    if (data.id) {
      this.updateChannel(data);
    }
    else {
      this.createChannel(data);
    }
  }



  //to create channel, it accepts `data` object as parameter containing channel properties
  createChannel(data) {

    //calling endpoint service method which accepts resource name as 'channelServiceReq' and `data` object as parameter
    this.endPointService.createChannel(data, this.channelServiceReq).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage('success-snackbar', "Channel Created", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to update channel, it accepts `data` object as parameter containing channel properties
  updateChannel(data) {

    //calling endpoint service method which accepts resource name as 'channelServiceReq' and `data` object as parameter
    this.endPointService.updateChannel(data, this.channelServiceReq).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage('success-snackbar', "Updated", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to update channel, it accepts `data` object as parameter containing channel  properties
  deleteChannel(data) {

    //calling endpoint service method which accepts resource name as 'channelServiceReq' and channel id as `id` object as parameter
    this.endPointService.deleteChannel(data.id, this.channelServiceReq).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.code && res.code == "Success") {
          this.channels = this.channels.filter(i => i !== data)
            .map((i, idx) => (i.position = (idx + 1), i));

          this.snackbar.snackbarMessage('success-snackbar', "Deleted", 1);
        }
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }
}
