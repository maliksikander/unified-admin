import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChannelTypeSettingsComponent } from './channel-type-settings.component';

describe('ChannelTypeSettingsComponent', () => {
  let component: ChannelTypeSettingsComponent;
  let fixture: ComponentFixture<ChannelTypeSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelTypeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelTypeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
