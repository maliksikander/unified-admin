import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-channel-type',
  templateUrl: './channel-type.component.html',
  styleUrls: ['./channel-type.component.scss']
})
export class ChannelTypeComponent implements OnInit {

  addType: boolean = false;
  spinner: boolean = false;
  pageTitle: String = 'Channel Type'
  editData;
  typeList = [];
  searchTerm: String = '';
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  reqEndpoint = 'channel-types';

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,) { }

  ngOnInit(): void {

    this.getChannelTypes();
  }

  //to get channel type list
  getChannelTypes() {

    //calling endpoint service method to get channel list which accepts resource name as 'channelServiceReq' and channnel type id as `typeId` object as parameter
    this.endPointService.getChannel(this.reqEndpoint).subscribe(
      (res: any) => {
        this.spinner = false;
        console.log("res-->", res);
        // this.typeList = res;
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }


  addChannelType() { }

  editChannelType(data) { }

  //Confirmation dialog for delete operation , it accepts the attribute object as `data` parameter 
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this channel type ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Channel Type",
        message: msg,
        text: 'confirm',
        data: data
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') { this.deleteChannelType(data, id); }
      else { this.spinner = false; }
    });
  }

  deleteChannelType(data, id) { }

}
