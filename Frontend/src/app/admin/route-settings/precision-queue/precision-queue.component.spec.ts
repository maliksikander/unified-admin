import { ChangeDetectorRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PrecisionQueueComponent } from "./precision-queue.component";

describe("PrecisionQueueComponent", () => {
  let component: PrecisionQueueComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new PrecisionQueueComponent(
      commonService,
      dialog,
      endPointService,
      fb,
      snackbarService,
      cd
    );
  });

  it("should create precision component", () => {
    expect(component).toBeTruthy();
  });
});
