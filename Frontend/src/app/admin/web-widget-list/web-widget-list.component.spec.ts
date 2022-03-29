import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { WebWidgetListComponent } from "./web-widget-list.component";

describe("WebWidgetListComponent", () => {
  let component: WebWidgetListComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new WebWidgetListComponent(
      commonService,
      dialog,
      endPointService,
      snackbarService
    );
  });

  it("should create web widget list component", () => {
    expect(component).toBeTruthy();
  });
});
