import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MrdTasksComponent } from './mrd-tasks.component';

describe("MrdTasksComponent", () => {
  let component: MrdTasksComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let dialog: MatDialog;

  beforeEach(() => {
    component = new MrdTasksComponent(
      // commonService,
      // dialog,
      endPointService,
      // fb,
      snackbarService
    );
  });

  it("should create mrd tasks component", () => {
    expect(component).toBeTruthy();
  });
});
