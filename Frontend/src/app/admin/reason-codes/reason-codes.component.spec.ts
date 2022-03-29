import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { ReasonCodesComponent } from "./reason-codes.component";

describe("ReasonCodesComponent", () => {
  let component: ReasonCodesComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new ReasonCodesComponent(
      commonService,
      dialog,
      endPointService,
      fb,
      snackbarService
    );
  });

  it("should create reason code component", () => {
    expect(component).toBeTruthy();
  });
});
