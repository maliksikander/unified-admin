import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-agent-desk-settings',
  templateUrl: './agent-desk-settings.component.html',
  styleUrls: ['./agent-desk-settings.component.scss']
})
export class AgentDeskSettingsComponent implements OnInit {
  pageTitle = "Agent Desk Settings";
  spinner = false;
  AgentDeskConfigForm: FormGroup;
  isEnableWrapup = false;
  formErrors = {
    enableWrapup: "",
    displaywrapup: "please enter valid value between 15-1800",
  }
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.AgentDeskConfigForm = this.formBuilder.group({
      enableWrapup: [true],
      displaywrapup: [15 , [ Validators.max(1800), Validators.min(15), Validators.pattern("^[0-9*_-]*$"),
      ]],
    });
  }


}
