import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../../services/common.service';
import { EndpointService } from '../../../services/endpoint.service';
import { SnackbarService } from '../../../services/snackbar.service';


@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit, OnChanges {


  @Input() parentChannelBool;
  @Output() childChannelBool = new EventEmitter<any>();
  spinner = false;
  channelSettingForm: FormGroup;
  modeVal = ['BOT', 'AGENT', 'HYBRID'];


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.channelSettingForm = this.formBuilder.group({
      channelName: [''],
      serviceIdentifier: [''],
      channelConnector: [],
      channelMode: [''],
      responseSLA: [''],
      customerActivityTimeout: [''],
      routingPolicy: [''],
      botId: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) { }

  // childToParentEvent() { this.childChannelBool.emit(!this.parentChannelBool); }

  onChange(e) { }

  onSave() { }

  onClose() {
    this.childChannelBool.emit(!this.parentChannelBool);
  }

}
