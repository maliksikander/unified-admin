import { FormBuilder } from "@angular/forms";
import { EndpointService } from "src/app/admin/services/endpoint.service";
import { BotSettingsComponent } from "./bot-settings.component";

describe("BotSettingsComponent", () => {
  let formBuilderMock: FormBuilder;
  let component: BotSettingsComponent;
  let endPointService: EndpointService;
  let snackbarService: any;
  let commonService: any;

  beforeEach(() => {
    formBuilderMock = new FormBuilder();
    component = new BotSettingsComponent(
      commonService,
      formBuilderMock,
      snackbarService,
      endPointService
    );
  });

  it("should create bot settings component", () => {
    expect(component).toBeTruthy();
  });

  describe("Bot Settings", () => {
    it("should reset the form", () => {
      component.botSettingForm.reset = jest.fn().mockReturnValue("Called");
      component.onClose();

      expect(component.botSettingForm.reset()).toBe("Called");
    });
  });
});
