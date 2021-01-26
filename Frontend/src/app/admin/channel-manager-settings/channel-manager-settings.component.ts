import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../services/common.service';
import { EndpointService } from '../services/endpoint.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-channel-manager-settings',
  templateUrl: './channel-manager-settings.component.html',
  styleUrls: ['./channel-manager-settings.component.scss']
})
export class ChannelManagerSettingsComponent implements OnInit {

  spinner = false;
  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '40px';
  addChannelBool = false;
  pageTitle = "Customer Channels";


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {
  }


  onStatusChange(e) {

    //  Enter Code Here

  }

  editChannel(e) {

  }


  deleteConfirm(e) {
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
      // this.spinner = true;
      if (res === 'delete') {
        // Enter Code Here
      }
      else { this.spinner = false; }
    });
  }


  addChannel(type) {
    this.addChannelBool = true;
    // console.log("type-->",type);
    if(type === 'whatsapp') this.pageTitle = "Set up Whatsapp Channel";
    else if(type === 'facebook') this.pageTitle = "Set up Facebook Channel";
    else if(type === 'web') this.pageTitle = "Set up Web Chat Channel";
    else if(type === 'viber') this.pageTitle = "Set up Viber Channel";
    else if(type === 'forwardProxy') this.pageTitle = "Set up Forward Proxy Channel";
    else if(type === 'smpp') this.pageTitle = "Set up SMPP Channel";
  }

  childToParentUIChange(e){
    this.addChannelBool = e;
    if(this.addChannelBool == false){
      this.pageTitle = "Customer Channels";
    }

  }

}
