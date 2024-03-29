import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-bot-list",
  templateUrl: "./bot-list.component.html",
  styleUrls: ["./bot-list.component.scss"],
})
export class BotListComponent implements OnInit {
  spinner = false;
  customCollapsedHeight: string = "40px";
  customExpandedHeight: string = "40px";
  addBot = false;
  pageTitle = "Bot Settings";
  editBotData;
  botList = [];
  botType;
  managePermission:boolean = false

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();
    this.endPointService.getStorageValues();
    this.managePermission = this.commonService.checkManageScope("bot-settings");
  }

  //to get bot settings list, it accepts bot type as `type` parameter
  getBotList(type) {
    //calling bot setting endpoint, it accepts bot type as `type` parameter
    this.endPointService.getBotSettingByType(type).subscribe(
      (res: any) => {
        //passing bot list response to the setter method
        this.setLocalListVariable(res);
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        // else this.snackbar.snackbarMessage('error-snackbar', error.error.message, 1);
      }
    );
  }

  //to delete bot, it accepts `data` containing ('botName','botType'.'botUri') object as parameter  and
  //removes that particular object from local list variable if there is a success response
  deleteBotSetting(data): void {
    this.endPointService.deleteBotSetting(data.botId).subscribe(
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
      this.botList = this.botList.filter((item) => item.botId != data.botId);
      this.snackbar.snackbarMessage("success-snackbar", "Deleted", 1);
    } catch (e) {
      console.error("Error in removing record from local:", e);
      this.spinner = false;
    }
  }

  //to edit bot settings and change the view to form page,it accepts  bot setting object as 'data' ('botName','botType'.'botUri') and bot type as 'type' parameter
  editBotSettings(data, type): void {
    this.addBot = true;
    this.pageTitle = "Edit Bot Settings";
    this.editBotData = data;
    this.botType = type;
  }

  // to open delete confirmation dialog and it returns the dialog component
  openConfirmDialog(data) {
    let msg = "Are you sure you want to delete this Bot ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: ['confirm-dialog-container' , 'delete-confirmation'],
        disableClose: true,
        data: {
          heading: "Delete Bot",
          message: msg,
          text: "confirm",
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.getBotMappedChannel(data);
        } else {
          this.spinner = false;
        }
      });
  }

  //to get channel type list and it expects the relevant mrd id
  getBotMappedChannel(data) {
    this.endPointService.getBotMappedChannel(data.botId).subscribe(
      (res: any) => {
        let channelList: Array<any> = res;
        if (channelList.length == 0) {
          this.deleteBotSetting(data);
        } else {
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "Bot MAPPED TO CHANNEL",
            2
          );
          this.spinner = false;
        }
      },
      (error) => {
        this.spinner = false;
        console.error("Error Fetching MRD mapped channel type:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to add bot and change the view to form page  and pass bot type as 'type' parameter
  addBotSettings(type) {
    this.addBot = true;
    this.botType = type;
    this.pageTitle = `Configure ${this.botType} Bot`;
  }

  //to change the view from `form` to `list` page and load bot type list and it accepts boolean value as 'e' parameter from child component
  childToParentUIChange(e): void {
    this.addBot = e;
    if (this.addBot == false) {
      this.pageTitle = "Bot Settings";
    }
    this.editBotData = undefined;
  }

  //to set bot list by bot type on expansion event, it accepts bot type as 'type' paramter
  panelOpenCallback(type): void {
    this.spinner = true;
    this.botList = [];
    this.getBotList(type);
  }

  // to set local list variable, it accepts bot setting list as `list` parameter
  setLocalListVariable(list) {
    try {
      list.forEach((item) => {
        if (item.botType == "DIALOGFLOW") {
          item.botUri = JSON.parse(item.botUri);
        }
      });
      this.botList = list;
    } catch (error) {
      console.error("Error :", error);
      this.spinner = false;
    }
  }

  //to create/update a bot setting object, it accepts bot object as 'data' parameter
  onSave(msg) {
    // this.spinner = true;
    this.addBot = false;
    this.pageTitle = "Bot Settings";
    this.editBotData = undefined;
    this.snackbar.snackbarMessage("success-snackbar", msg, 1);
  }
}
