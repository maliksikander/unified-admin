import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelManagerSettingsComponent } from './channel-manager-settings.component';

describe('ChannelManagerSettingsComponent', () => {
  let component: ChannelManagerSettingsComponent;
  let fixture: ComponentFixture<ChannelManagerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelManagerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelManagerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
