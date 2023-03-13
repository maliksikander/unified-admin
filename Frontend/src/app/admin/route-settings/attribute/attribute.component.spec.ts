import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AttributeComponent } from "./attribute.component";

describe("AttributeComponent", () => {
  let component: AttributeComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new AttributeComponent(
      commonService,
      dialog,
      endPointService,
      fb,
      snackbarService
    );
  });

  it("should create attribute component", () => {
    expect(component).toBeTruthy();
  });
});
