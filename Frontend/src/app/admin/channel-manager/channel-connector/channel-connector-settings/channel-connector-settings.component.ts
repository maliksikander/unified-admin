import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from 'src/app/admin/services/common.service';
import { EndpointService } from 'src/app/admin/services/endpoint.service';
import { SnackbarService } from 'src/app/admin/services/snackbar.service';

@Component({
  selector: 'app-channel-connector-settings',
  templateUrl: './channel-connector-settings.component.html',
  styleUrls: ['./channel-connector-settings.component.scss']
})
export class ChannelConnectorSettingsComponent implements OnInit {

  @Input() parentChannelBool;
  @Output() childChannelBool = new EventEmitter<any>();
  spinner = false;
  channelConnectorForm: FormGroup;


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.channelConnectorForm = this.formBuilder.group({
      channelConnectorName: [''],
      channelWebhook: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) { }

  // childToParentEvent() { this.childChannelBool.emit(!this.parentChannelBool); }

  onSave() { }

  onClose() {
    this.childChannelBool.emit(!this.parentChannelBool);
  }

}
