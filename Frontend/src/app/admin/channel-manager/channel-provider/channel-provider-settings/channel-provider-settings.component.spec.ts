import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { ChannelProviderSettingsComponent } from "./channel-provider-settings.component";

describe("ChannelProviderSettingsComponent", () => {
  let component: ChannelProviderSettingsComponent;
  let endPointService: any;
  let cd: ChangeDetectorRef;
  let commonService: any;
  let fb: FormBuilder;

  beforeEach(() => {
    component = new ChannelProviderSettingsComponent(
      commonService,
      fb,
      endPointService,
      cd
    );
  });

  it("should create channel provider settings component", () => {
    expect(component).toBeTruthy();
  });
});
