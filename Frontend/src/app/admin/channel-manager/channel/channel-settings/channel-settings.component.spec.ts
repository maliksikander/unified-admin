import { ChangeDetectorRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ChannelSettingsComponent } from "./channel-settings.component";

describe("ChannelSettingsComponent", () => {
  let component: ChannelSettingsComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;
  let dialog: MatDialog

  beforeEach(() => {
    component = new ChannelSettingsComponent(
      commonService,
      endPointService,
      fb,
      snackbarService,
      cd,
      dialog
    );
  });

  it("should create channel settings component", () => {
    expect(component).toBeTruthy();
  });
});
