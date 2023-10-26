import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { validateEvents } from "angular-calendar/modules/common/util";
import { CommonService } from "../services/common.service";
import { EndpointService } from "../services/endpoint.service";
import { SnackbarService } from "../services/snackbar.service";

@Component({
  selector: "app-agent-desk-settings",
  templateUrl: "./agent-desk-settings.component.html",
  styleUrls: ["./agent-desk-settings.component.scss"],
})
export class AgentDeskSettingsComponent implements OnInit {
  pageTitle = "Agent Desk Settings";
  spinner = false;
  AgentDeskConfigForm: FormGroup;
  agentDeskSettings:any;
  formErrors = {
    enableWrapup: "",
    // displaywrapup: "please enter valid value between 15-1800",
    // prefixCode: "",
    // displayprefixcode:"please enter country code"
  };
  managePermission: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.AgentDeskConfigForm = this.formBuilder.group({
      isConversationParticipantsEnabled:[false],
      isFileSharingEnabled:[false],
      isEmojisEnabled:[false],
      isMessageFormattingEnabled:[false],
      // isWrapUpEnabled: [false],
      // wrapUpTime: [
      //   15,
      //   [ Validators.required,
      //     Validators.max(1800),
      //     Validators.min(15),
      //     Validators.pattern("^[0-9*_-]*$"),
      //   ],
      // ],
      isOutboundSmsEnabled:[false],
      isOutboundSmsSendandClose: [false],
      prefixCode:[
        "+1",
        [ //Validators.required,
          Validators.pattern('^(?:[+0]?[1-9]{1,3})?$'),

        ],
      ]
    });
    this.getAgentDeskSettings();
    // this.AgentDeskConfigForm.get('isWrapUpEnabled').valueChanges.subscribe(() => {
    //   if (!this.AgentDeskConfigForm.get('isWrapUpEnabled').value) {
    //     this.AgentDeskConfigForm.patchValue({'wrapUpTime':15})
    //   }
    // });

    // this.AgentDeskConfigForm.get('isOutboundSmsEnabled').valueChanges.subscribe(() => {
    //   if (!this.AgentDeskConfigForm.get('isOutboundSmsEnabled').value) {
    //     this.AgentDeskConfigForm.patchValue({'prefixCode':"+1"})
    //   }
    // });


    this.managePermission = this.commonService.checkManageScope("agent-desk-setting");
  }
  

  getAgentDeskSettings() {
    this.endPointService.getAgentDeskSettings().subscribe(
      (res: any) => {
        this.spinner = false;
        this.agentDeskSettings=res[0];
        this.AgentDeskConfigForm.patchValue(this.agentDeskSettings);
        
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error getting agent desk settings", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }
  updateAgentDeskSettings(data) {
    this.endPointService.updateAgentDeskSettings(data).subscribe(
      (res: any) => {
        this.spinner = false;
        this.agentDeskSettings=res;
        this.snackbar.snackbarMessage("success-snackbar","Settings Saved Successfully" , 1);
        this.AgentDeskConfigForm.markAsPristine();
      },
      (error: any) => {
        console.error("Error updating agent desk settings", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }
  onSave()
  {
    if(this.agentDeskSettings && this.agentDeskSettings['id'])
    {
      this.AgentDeskConfigForm.value.id=this.agentDeskSettings['id'];
      this.updateAgentDeskSettings(this.AgentDeskConfigForm.value);
    }
    else
    {
      this.snackbar.snackbarMessage("error-snackbar",'Unable to Save Agent Desk Settings', 1);
    }
  }

}
