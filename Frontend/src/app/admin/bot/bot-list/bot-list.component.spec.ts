import { EndpointService } from "../../services/endpoint.service";
import { MatDialog } from "@angular/material/dialog";
import { BotListComponent } from "./bot-list.component";

describe("BotListComponent", () => {
  let dialog: MatDialog;
  let component: BotListComponent;
  let endPointService: EndpointService;
  let snackbarService: any;
  let commonService: any;

  beforeEach(() => {
    component = new BotListComponent(
      commonService,
      dialog,
      endPointService,
      snackbarService
    );
  });

  it("should create bot list component", () => {
    expect(component).toBeTruthy();
  });
});
