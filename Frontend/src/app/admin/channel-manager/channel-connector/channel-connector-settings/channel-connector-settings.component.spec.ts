import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelConnectorSettingsComponent } from './channel-connector-settings.component';

describe('ChannelConnectorSettingsComponent', () => {
  let component: ChannelConnectorSettingsComponent;
  let fixture: ComponentFixture<ChannelConnectorSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelConnectorSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelConnectorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
