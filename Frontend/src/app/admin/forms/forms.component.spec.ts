import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { FormsComponent } from "./forms.component";

describe("FormsComponent", () => {
  let component: FormsComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new FormsComponent(
      commonService,
      dialog,
      endPointService,
      snackbarService
    );
  });

  it("should create new form component", () => {
    expect(component).toBeTruthy();
  });
});
