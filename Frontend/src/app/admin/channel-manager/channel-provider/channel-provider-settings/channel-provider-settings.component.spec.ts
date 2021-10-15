import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelProviderSettingsComponent } from './channel-provider-settings.component';

describe('ChannelProviderSettingsComponent', () => {
  let component: ChannelProviderSettingsComponent;
  let fixture: ComponentFixture<ChannelProviderSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelProviderSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelProviderSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
