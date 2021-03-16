import { Component, OnInit } from '@angular/core';
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
  botList = [];
  panelBotList = [];
  botType;

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();
  }

  //to get bot list and save in local variable, it accepts bot type as `type` parameter
  getBotList(type) {

    //calling endpoint service method to get bot list which accepts resource name as 'serviceReq' as parameter
    this.endPointService.getBot(this.serviceReq, type).subscribe(
      (res: any) => {
        try {
          this.botList = res;
          this.botList.forEach(item => {
            if (item.botType == 'DIALOGFLOW') {
              item.botUri = JSON.parse(item.botUri);
            }
          });
        }
        catch (error) {
          console.error("Error :", error);
          this.spinner = false;
        }
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
        else this.snackbar.snackbarMessage('error-snackbar', error.error.message, 1);
      });
  }

  //to create bot, it accepts `data` object as parameter containing bot properties
  createBot(data) {

    //calling endpoint service method which accepts resource name as 'serviceReq' and `data` object as parameter
    this.endPointService.createBot(data, this.serviceReq).subscribe(
      (res: any) => {
        this.snackbar.snackbarMessage('success-snackbar', "Bot Created", 1);
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);

        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
        else this.snackbar.snackbarMessage('error-snackbar', error.error.message, 1);
      });
  }

  //to update bot, it accepts `data` object as parameter containing bot properties
  updateBot(data) {

    //calling endpoint service method which accepts resource name as 'serviceReq' and `data` object as parameter
    this.endPointService.updateBot(data, data.botId, this.serviceReq).subscribe(
      (res: any) => {
        this.snackbar.snackbarMessage('success-snackbar', "Updated", 1);
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
        else this.snackbar.snackbarMessage('error-snackbar', error.error.message, 1);
      });
  }

  //to delete bot, it accepts `data` object as parameter containing bot object properties and
  //removes the particular object from local list variable if there is a success response
  deleteBot(data) {

    //calling endpoint service method which accepts resource name as 'serviceReq' and `bot id` as parameter
    this.endPointService.deleteBot(data.botId, this.serviceReq).subscribe(
      (res: any) => {

        this.botList = this.botList.filter(i => i !== data)
          .map((i, idx) => (i.position = (idx + 1), i));

        this.panelBotList = this.panelBotList.filter(i => i !== data)
          .map((i, idx) => (i.position = (idx + 1), i));

        this.spinner = false;
        this.snackbar.snackbarMessage('success-snackbar', "Deleted", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
        else this.snackbar.snackbarMessage('error-snackbar', error.error.message, 1);
      });
  }

  //to edit bot settings and change the view to form page  and pass bot object as 'data' parameter
  editBotSettings(data, type) {

    this.addBot = true;
    this.pageTitle = "Edit Bot Settings";
    this.editBotData = data;
    this.botType = type;
  }

  // to open delete confirmation dialog
  deleteConfirm(data) {

    let msg = "Are you sure you want to delete this Bot ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Bot",
        message: msg,
        text: 'confirm',
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') {
        this.deleteBot(data);
      }
      else { this.spinner = false; }
    });
  }

  //to add bot and change the view to form page  and pass bot type object as 'type' parameter
  addBotSettings(type) {
    this.addBot = true;
    this.botType = type;
    this.pageTitle = "Configure Bot";
  }

  //to change the view from `form` to `list` page and load bot type list and it accepts boolean value as 'e' parameter from child component
  childToParentUIChange(e) {
    this.addBot = e;
    if (this.addBot == false) {
      this.pageTitle = "Bot Settings";
    }
    this.editBotData = undefined;
  }

  //to set bot list by bot type on expansion event, it accepts bot type as 'type' paramter
  panelOpenCallback(type) {

    this.spinner = true;
    this.botList = [];
    this.getBotList(type);
  }

  //to create/update a bot, it accepts bot object as 'data' paramter
  onSave(data) {

    this.spinner = true;
    this.addBot = false;
    this.pageTitle = "Bot Settings";
    this.editBotData = undefined;
    if (data.botId) {
      this.updateBot(data);
    }
    else {
      this.createBot(data);
    }
  }

}