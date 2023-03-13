import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { ChannelListComponent } from "./channel-list.component";

describe("ChannelListComponent", () => {
  let component: ChannelListComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new ChannelListComponent(
      commonService,
      dialog,
      endPointService,
      snackbarService
    );
  });

  it("should create channel list component", () => {
    expect(component).toBeTruthy();
  });
});
