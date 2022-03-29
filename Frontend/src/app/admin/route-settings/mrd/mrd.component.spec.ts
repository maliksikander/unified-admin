import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { MrdComponent } from "./mrd.component";

describe("MrdComponent", () => {
  let component: MrdComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new MrdComponent(
      commonService,
      dialog,
      endPointService,
      fb,
      snackbarService
    );
  });

  it("should create mrd component", () => {
    expect(component).toBeTruthy();
  });
});
