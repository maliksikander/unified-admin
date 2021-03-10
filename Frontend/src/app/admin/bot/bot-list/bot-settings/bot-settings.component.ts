import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from 'src/app/admin/services/common.service';
import { EndpointService } from 'src/app/admin/services/endpoint.service';
import { SnackbarService } from 'src/app/admin/services/snackbar.service';

@Component({
  selector: 'app-bot-settings',
  templateUrl: './bot-settings.component.html',
  styleUrls: ['./bot-settings.component.scss']
})
export class BotSettingsComponent implements OnInit {

  @Input() parentBotBool;
  @Input() botTypeData;
  @Input() botData;
  @Output() childBotBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  botSettingForm: FormGroup;
  modeVal = ['BOT', 'AGENT', 'HYBRID'];
  formErrors = {
    botName: '',
    botURL: '',
  };
  validations;

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.commonService.tokenVerification();

    //setting local form validation messages 
    this.validations = this.commonService.botFormErrorMessages;

    this.botSettingForm = this.formBuilder.group({
      botName: ['', [Validators.required]],
      botURL: ['', [Validators.required]],
      botType: [{ value: '', disabled: true }]
    });

    this.botSettingForm.controls['botType'].patchValue(this.botTypeData);

    if (this.botData) {
      this.botSettingForm.patchValue({
        botName: this.botData.botName,
        botURL: this.botData.botUri,
        botType: this.botTypeData,
      });
    }

    //setting form validation messages 
    this.botSettingForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.botSettingForm, this.formErrors, this.validations);
    });

  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) { }


  //to create 'data' object and pass it to the parent component
  onSave() {

    let data: any = {
      botName: this.botSettingForm.value.botName,
      botUri: this.botSettingForm.value.botURL,
      botType: this.botTypeData,
    }
    if (this.botData) data.botId = this.botData.botId;
    this.formSaveData.emit(data);
    this.botSettingForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childBotBool.emit(!this.parentBotBool);
    this.botSettingForm.reset();
  }

}