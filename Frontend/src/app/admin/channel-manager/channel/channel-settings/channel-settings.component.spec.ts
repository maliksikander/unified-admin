import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { ChannelSettingsComponent } from "./channel-settings.component";

describe("ChannelSettingsComponent", () => {
  let component: ChannelSettingsComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    component = new ChannelSettingsComponent(
      commonService,
      endPointService,
      fb,
      snackbarService,
      cd
    );
  });

  it("should create channel settings component", () => {
    expect(component).toBeTruthy();
  });
});
