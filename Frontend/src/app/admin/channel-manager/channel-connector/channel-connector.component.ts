import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-channel-connector',
  templateUrl: './channel-connector.component.html',
  styleUrls: ['./channel-connector.component.scss']
})
export class ChannelConnectorComponent implements OnInit {

  spinner = true;
  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '40px';
  addChannelBool = false;
  typeServiceReq = 'channel-types';
  connectorServiceReq = 'channel-connectors';
  pageTitle = "Channel Connectors";
  channelTypes = [];
  channelConnectors = [];
  channelType;
  editConnectorData;


  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,
    private httpClient: HttpClient) { }

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

  getChannelConnector(typeId) {

    //calling endpoint service method to get connector list which accepts resource name as 'connectorServiceReq' and channnel type id as `typeId` object as parameter
    this.endPointService.getByChannelType(this.connectorServiceReq, typeId).subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelConnectors = res;
        this.getConnectorStatus(this.channelConnectors);
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  panelOpenCallback(data) {

    this.spinner = true;
    this.getChannelConnector(data.id);
  }

  editChannelConnector(data) {

    this.addChannelBool = true;
    this.pageTitle = "Edit" + " " + data.type.typeName + " " + "Type Connector";
    this.editConnectorData = data;
  }

  deleteConfirm(data) {

    let msg = "Are you sure you want to delete this Channel Connector?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Channel Connector",
        message: msg,
        text: 'confirm',
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') {
        this.deleteChannelConnector(data);
      }
      else { this.spinner = false; }
    });
  }

  addChannelConnector(type) {
    this.addChannelBool = true;
    this.channelType = type;
    this.pageTitle = "Set up" + " " + type.typeName + " " + "Type Connector";
  }

  childToParentUIChange(e) {
    this.addChannelBool = e;
    if (this.addChannelBool == false) {
      this.pageTitle = "Channel Connectors";
      this.editConnectorData = undefined;
    }

  }

  onSave(data) {
    this.spinner = true;
    this.addChannelBool = false;
    this.pageTitle = "Channel Connectors";
    this.editConnectorData = undefined;
    if (data.id) {
      this.updateChannelConnector(data);
    }
    else {
      this.createChannelConnector(data);
    }
  }

  //to create channel connector and it accepts `data` object as parameter containing channel connector properties
  createChannelConnector(data) {

    //calling endpoint service method which accepts resource name as 'connectorServiceReq' and `data` object as parameter
    this.endPointService.createChannel(data, this.connectorServiceReq).subscribe(
      (res: any) => {
        this.spinner = false;
        this.snackbar.snackbarMessage('success-snackbar', "Connector Created", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to update channel connector and it accepts `data` object as parameter containing channel connector properties
  updateChannelConnector(data) {

    //calling endpoint service method which accepts resource name as 'connectorServiceReq' and `data` object as parameter
    this.endPointService.updateChannel(data, this.connectorServiceReq).subscribe(
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

  //to update channel connector and it accepts `data` object as parameter containing channel connector properties
  deleteChannelConnector(data) {

    //calling endpoint service method which accepts resource name as 'connectorServiceReq' and connector id as `id` object as parameter
    this.endPointService.deleteChannel(data.id, this.connectorServiceReq).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res.code && res.code == "Success") {
          this.channelConnectors = this.channelConnectors.filter(i => i !== data)
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



  getConnectorStatus(list) {
    list.forEach((item) => {
      let url = item.channelWebhook;
      this.httpClient.get(`${url}/channel-connectors/health`)
        .subscribe((res: any) => {
          item['status'] = res.status.toLowerCase();
        },
          (error: any) => {
            this.spinner = false;
            item['status'] = "unhealthy"
            console.log("Error fetching:", error);
            if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
          });




    })
  }
}