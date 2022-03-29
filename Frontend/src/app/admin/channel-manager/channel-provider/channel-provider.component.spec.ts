import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { ChannelProviderComponent } from "./channel-provider.component";

describe("ChannelProviderComponent", () => {
  let component: ChannelProviderComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new ChannelProviderComponent(
      commonService,
      dialog,
      endPointService,
      snackbarService
    );
  });

  it("should create channel provider list component", () => {
    expect(component).toBeTruthy();
  });
});
