import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { ChannelTypeComponent } from "./channel-type.component";

describe("ChannelTypeComponent", () => {
  let component: ChannelTypeComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new ChannelTypeComponent(
      commonService,
      dialog,
      endPointService,
      snackbarService
    );
  });

  it("should create channel type component", () => {
    expect(component).toBeTruthy();
  });
});
