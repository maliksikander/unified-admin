import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-bot-list',
  templateUrl: './bot-list.component.html',
  styleUrls: ['./bot-list.component.scss']
})
export class BotListComponent implements OnInit {

  spinner = false;
  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '40px';
  addBot = false;
  pageTitle = "Bot Settings";
  editBotData;
  serviceReq = 'bot-connectors';
  // channel = [];
  // channels = [];
  botType


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    // this.getChannelType();
  }


  // getChannelType() {

    //calling endpoint service method to get channel types list which accepts its resource name as 'typeServiceReq' parameter
    // this.endPointService.getChannel(this.typeServiceReq).subscribe(
    //   (res: any) => {
    //     this.spinner = false;
    //     this.channelTypes = res.channelTypes;
    //     if (res.channelTypes.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
    //   },
    //   error => {
    //     this.spinner = false;
    //     console.log("Error fetching:", error);
    //     if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
    //   });
  // }

  //to get channels list, it accepts channel-type-id as `typeId` parameter for fetching type particular channels
  getBotList() {

    //calling endpoint service method to get channel list which accepts resource name as 'channelServiceReq' and channnel type id as `typeId` object as parameter
    // this.endPointService.getByChannelType(this.channelServiceReq, typeId).subscribe(
    //   (res: any) => {
    //     this.spinner = false;
    //     this.channels = res;
    //   },
    //   error => {
    //     this.spinner = false;
    //     console.log("Error fetching:", error);
    //     if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
    //   });
  }

  //to create channel, it accepts `data` object as parameter containing channel properties
  createBot(data) {

    //calling endpoint service method which accepts resource name as 'channelServiceReq' and `data` object as parameter
    // this.endPointService.createChannel(data, this.channelServiceReq).subscribe(
    //   (res: any) => {
    //     this.spinner = false;
    //     this.snackbar.snackbarMessage('success-snackbar', "Channel Created", 1);
    //   },
    //   (error: any) => {
    //     this.spinner = false;
    //     console.log("Error fetching:", error);
    //     if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
    //   });
  }

  //to update channel, it accepts `data` object as parameter containing channel properties
  updateBot(data) {

    //calling endpoint service method which accepts resource name as 'channelServiceReq' and `data` object as parameter
    // this.endPointService.updateChannel(data, this.channelServiceReq).subscribe(
    //   (res: any) => {
    //     this.spinner = false;
    //     this.snackbar.snackbarMessage('success-snackbar', "Updated", 1);
    //   },
    //   (error: any) => {
    //     this.spinner = false;
    //     console.log("Error fetching:", error);
    //     if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
    //   });
  }

  //to delete channel, it accepts `data` object as parameter containing channel  properties and
  //splices the particular object from local list variable if there is a success response.
  deleteBot(data) {

    //calling endpoint service method which accepts resource name as 'channelServiceReq' and channel id as `id` object as parameter
    // this.endPointService.deleteChannel(data.id, this.channelServiceReq).subscribe(
    //   (res: any) => {
    //     this.spinner = false;
    //     if (res.code && res.code == "Success") {
    //       this.channels = this.channels.filter(i => i !== data)
    //         .map((i, idx) => (i.position = (idx + 1), i));

    //       this.snackbar.snackbarMessage('success-snackbar', "Deleted", 1);
    //     }
    //   },
    //   (error: any) => {
    //     this.spinner = false;
    //     console.log("Error fetching:", error);
    //     if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
    //   });
  }

  //to edit channel and change the view to form page and load input fields and pass channel object as 'data' parameter
  editBotSettings(data) {

    this.addBot = true;
    this.pageTitle = "Edit Bot";
    // this.editBotData = data;
    // this.botType = data.channelConnector.type;
    this.botType = data;
  }

  // to open delete confirmation dialog
  deleteConfirm(data) {

    // let msg = "Are you sure you want to delete this Channel ?";
    // return this.dialog.open(ConfirmDialogComponent, {
    //   panelClass: 'confirm-dialog-container',
    //   disableClose: true,
    //   data: {
    //     heading: "Delete Channel",
    //     message: msg,
    //     text: 'confirm',
    //   }
    // }).afterClosed().subscribe((res: any) => {
    //   this.spinner = true;
    //   if (res === 'delete') {
    //     this.deleteChannel(data);
    //   }
    //   else { this.spinner = false; }
    // });
  }

  //to add channel and change the view to form page and load input fields and pass channel type object as 'type' parameter
  addBotSettings(data) {
    this.addBot = true;
    this.botType = data;
    this.pageTitle = "Configure Bot";
  }

  //to change the view from `form` to `list` page and load channel type list and it accepts boolean value as 'e' parameter from child component
  childToParentUIChange(e) {
    this.addBot = e;
    if (this.addBot == false) {
      this.pageTitle = "Bot Settings";
    }

  }

  //to get channel list by channel type id on expansion panel event, it accepts channel type object as 'data' paramter
  panelOpenCallback() {

    // this.spinner = true;
    // this.getChannels(data.id);
  }

  //to create/update a channel, it accepts channel object as 'data' paramter
  onSave(data) {
    // this.spinner = true;
    // this.addChannelBool = false;
    // this.pageTitle = "Customer Channels";
    // this.editChannelData = undefined;
    // if (data.id) {
    //   this.updateChannel(data);
    // }
    // else {
    //   this.createChannel(data);
    // }
  }

}
