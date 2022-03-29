import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarService } from "./snackbar.service";
describe("Snackbar Service", () => {
  let component;
  let snackbar: MatSnackBar;

  beforeEach(() => {
    component = new SnackbarService(snackbar);
  });

  describe("Snackbar Service ", () => {
    it("should call snackbar open method", () => {
      component.snackbarMessage = jest.fn().mockReturnValue("");
      component.snackbarMessage("error-msg", "Test Msg", 1);
      expect(component.snackbarMessage).toHaveBeenCalled();
    });
  });
});
