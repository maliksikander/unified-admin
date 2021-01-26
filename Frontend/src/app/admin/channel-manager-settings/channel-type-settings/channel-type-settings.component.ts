import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-channel-type-settings',
  templateUrl: './channel-type-settings.component.html',
  styleUrls: ['./channel-type-settings.component.scss']
})
export class ChannelTypeSettingsComponent implements OnInit, OnChanges {


  @Input() parentChannelBool;
  @Output() childChannelBool = new EventEmitter<any>();
  spinner = false;
  channelSettingForm: FormGroup;


  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.channelSettingForm = this.formBuilder.group({
      name: [''],
      mode: [''],
      responseSLA: [''],
      inactivityTimeout: [''],
      routingPolicy: [''],
      active: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) { }

  // childToParentEvent() { this.childChannelBool.emit(!this.parentChannelBool); }

  onChange(e) { }

  onSave() {
    this.childChannelBool.emit(!this.parentChannelBool);
  }

}
