import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
    botFile: ''
  };
  validations;
  valid = false;
  fileData: any;
  serializedFile;

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
      botURL: [''],
      botType: [{ value: '', disabled: true }],
      botFile: [{ value: null, disabled: true }]
    });

    this.botSettingForm.controls['botType'].patchValue(this.botTypeData);
    this.setValidation(this.botTypeData);

    if (this.botData) {
      this.botSettingForm.patchValue({
        botName: this.botData.botName,
        botURL: this.botData.botUri,
        botType: this.botTypeData,
      });

      if (this.botSettingForm.status == "INVALID") {

        this.valid = false;
      }
      else {
        let val = this.botSettingForm.controls['botFile'].value;
        if (this.botTypeData == 'DIALOGFLOW' && (val == undefined || val == null || val.length == 0)) {
          this.valid = false;
        }
        else {
          this.valid = true;
        }
      }

    }

    //setting form validation messages 
    this.botSettingForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.botSettingForm, this.formErrors, this.validations);

      if (this.botSettingForm.status == "INVALID") {

        this.valid = false;
      }
      else {
        let val = this.botSettingForm.controls['botFile'].value;
        if (this.botTypeData == 'DIALOGFLOW' && (val == undefined || val == null || val.length == 0)) {
          this.valid = false;
        }
        else {
          this.valid = true;
        }
      }
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
    if (this.botTypeData == 'DIALOGFLOW') data.botUri = this.serializedFile;
    if (this.botData) data.botId = this.botData.botId;
    this.formSaveData.emit(data);
    this.botSettingForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childBotBool.emit(!this.parentBotBool);
    this.botSettingForm.reset();
  }


  //to view selected image and save in base64 format and it accepts file properties as 'files' and change event as 'e'
  fileUpload(files, event) {

    if (files.length != 0) {
      var reader = new FileReader();
      var t = this;
      reader.onload = ((e: any) => {
        let obj = JSON.parse(e.target.result);
        t.fileData = obj;
        t.setFileValue(t.fileData);
      });
      reader.readAsText(event.target.files[0]);
      this.botSettingForm.controls['botFile'].setValue(files[0].name);
    }
  }


  setFileValue(val) {

    let file = JSON.stringify(val);
    this.serializedFile = file;
  }

  setValidation(val) {

    if (val == 'DIALOGFLOW') {
      this.botSettingForm.controls['botURL'].setValidators(null);
    }
    else {
      this.botSettingForm.controls['botURL'].setValidators([Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)]);
    }
  }

}