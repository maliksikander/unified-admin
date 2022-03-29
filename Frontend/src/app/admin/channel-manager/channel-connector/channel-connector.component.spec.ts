import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { ChannelConnectorComponent } from "./channel-connector.component";

describe("ChannelConnectorComponent", () => {
  let component: ChannelConnectorComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new ChannelConnectorComponent(
      commonService,
      dialog,
      endPointService,
      snackbarService
    );
  });

  it("should create channel connector list component", () => {
    expect(component).toBeTruthy();
  });
});
