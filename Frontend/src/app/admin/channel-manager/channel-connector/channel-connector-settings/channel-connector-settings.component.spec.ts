import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { ChannelConnectorSettingsComponent } from "./channel-connector-settings.component";

describe("ChannelConnectorSettingsComponent", () => {
  let component: ChannelConnectorSettingsComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;

  beforeEach(() => {
    component = new ChannelConnectorSettingsComponent(
      commonService,
      endPointService,
      fb,
      snackbarService
    );
  });

  it("should create channel connector settings component", () => {
    expect(component).toBeTruthy();
  });
});
