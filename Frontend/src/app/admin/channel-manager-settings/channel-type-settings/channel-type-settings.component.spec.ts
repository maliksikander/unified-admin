import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelTypeSettingsComponent } from './channel-type-settings.component';

describe('ChannelTypeSettingsComponent', () => {
  let component: ChannelTypeSettingsComponent;
  let fixture: ComponentFixture<ChannelTypeSettingsComponent>;

  beforeEach(async(() => {
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
