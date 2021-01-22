import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-channel-type-settings',
  templateUrl: './channel-type-settings.component.html',
  styleUrls: ['./channel-type-settings.component.scss']
})
export class ChannelTypeSettingsComponent implements OnInit, OnChanges {


  @Input() parentChannelBool;
  @Output() childChannelBool = new EventEmitter<any>();


  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) { }

  test() { this.childChannelBool.emit(!this.parentChannelBool); }

}
