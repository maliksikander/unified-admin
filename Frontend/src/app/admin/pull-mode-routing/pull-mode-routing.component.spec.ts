import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { PullModeRoutingComponent } from "./pull-mode-routing.component";

describe("PullModeRoutingComponent", () => {
  let component: PullModeRoutingComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new PullModeRoutingComponent(
      commonService,
      dialog,
      endPointService,
      fb,
      snackbarService
    );
  });

  it("should create pull mode component", () => {
    expect(component).toBeTruthy();
  });
});
