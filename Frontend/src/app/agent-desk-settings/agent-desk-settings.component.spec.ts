// import {
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
//   tick,
// } from "@angular/core/testing";
import { of } from "rxjs";
// import { EndpointService } from "../admin/services/endpoint.service";
import { AgentDeskSettingsComponent } from "./agent-desk-settings.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SnackbarService } from "../admin/services/snackbar.service";

describe("AgentDeskSettingsComponent", () => {
  // let component: AgentDeskSettingsComponent;
  let fixture: AgentDeskSettingsComponent;
  let SnackbarService: SnackbarService;
  let formBuilder: FormBuilder;
  let endPointService: any;
  describe("testing",()=>
  {
  beforeEach(async () => {
    endPointService = {
      updateAgentDeskSettings: jest.fn(() => {
        return of({
          messageFormatting: true,
          fileSharing: true,
          emojis: true,
          conversationParticipants: true,
          wrapUp: true,
          wrapUpTime: 15,
          createdAt: "2022-09-02T05:56:30.413Z",
          updatedAt: "2022-09-02T06:57:40.668Z",
          id: "63119b0eefcbf1512c15b37a",
        });
      }),
      getAgentDeskSettings: jest.fn(() => {
        return of([{
          messageFormatting: true,
          fileSharing: false,
          emojis: true,
          conversationParticipants: true,
          wrapUp: true,
          wrapUpTime: 15,
          createdAt: "2022-09-02T05:56:30.413Z",
          updatedAt: "2022-09-02T06:57:40.668Z",
          id: "63119b0eefcbf1512c15b37a",
        }]);
      }),
    };
    // let endPointServiceSpy=jasmine.createSpyObj('EndpointService',['updateAgentDeskSettings','getAgentDeskSettings']);
    // endPointServiceSpy.updateAgentDeskSettings.and.callFake(function ()
    // {
    //   return of({
    //     "messageFormatting": true,
    //     "fileSharing": true,
    //     "emojis": true,
    //     "conversationParticipants": true,
    //     "wrapUp": true,
    //     "wrapUpTime": 15,
    //     "createdAt": "2022-09-02T05:56:30.413Z",
    //     "updatedAt": "2022-09-02T06:57:40.668Z",
    //     "id": "63119b0eefcbf1512c15b37a"
    //   })
    // })
    // endPointServiceSpy.getAgentDeskSettings.and.callFake(function (data)
    // {
    //   return of({
    //     "messageFormatting": true,
    //     "fileSharing": false,
    //     "emojis": true,
    //     "conversationParticipants": true,
    //     "wrapUp": true,
    //     "wrapUpTime": 15,
    //     "createdAt": "2022-09-02T05:56:30.413Z",
    //     "updatedAt": "2022-09-02T06:57:40.668Z",
    //     "id": "63119b0eefcbf1512c15b37a"
    //   })
    // })
    fixture = new AgentDeskSettingsComponent(
      formBuilder,
      endPointService,
      SnackbarService
    );
    //   await TestBed.configureTestingModule({
    //     declarations: [ AgentDeskSettingsComponent ],
    //     providers:[
    //       {
    //         provide:EndpointService,
    //         useValue:mockService,
    //       },
    //       {provide:FormBuilder,
    //         useValue:FormBuilder
    //       },
    //       {provide:SnackbarService,
    //         useValue:SnackbarService
    //       }
    //     ]
    //   })
    //   .compileComponents();
    // });

    // beforeEach(() => {
    //   fixture = TestBed.createComponent(AgentDeskSettingsComponent);
    //   component = fixture.componentInstance;
    //   fixture.detectChanges();
    // });
  });
  it("should create", () => {
    // component.ngOnInit();
    // tick();
    // fixture.detectChanges();
    fixture.getAgentDeskSettings();
    expect(fixture.agentDeskSettings).toEqual({
      messageFormatting: true,
      fileSharing: false,
      emojis: true,
      conversationParticipants: true,
      wrapUp: true,
      wrapUpTime: 15,
      createdAt: "2022-09-02T05:56:30.413Z",
      updatedAt: "2022-09-02T06:57:40.668Z",
      id: "63119b0eefcbf1512c15b37a",
    });
    fixture.updateAgentDeskSettings({})
    expect(fixture.agentDeskSettings).toEqual({
      messageFormatting: true,
      fileSharing: true,
      emojis: true,
      conversationParticipants: true,
      wrapUp: true,
      wrapUpTime: 15,
      createdAt: "2022-09-02T05:56:30.413Z",
      updatedAt: "2022-09-02T06:57:40.668Z",
      id: "63119b0eefcbf1512c15b37a",
    });
  });
});
});
