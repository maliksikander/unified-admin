import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from "../../../../admin/services/common.service";
import { EndpointService } from "../../../../admin/services/endpoint.service";
import { SnackbarService } from "../../../../admin/services/snackbar.service";

@Component({
  selector: "app-bot-settings",
  templateUrl: "./bot-settings.component.html",
  styleUrls: ["./bot-settings.component.scss"],
})
export class BotSettingsComponent implements OnInit {
  @Input() parentBotBool;
  @Input() botTypeData;
  @Input() botData;
  @Output() childBotBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  botSettingForm: FormGroup;
  formErrors = {
    botName: "",
    botURL: "",
    botFile: "",
  };
  validations;
  valid = false;
  fileData: any;
  serializedFile;
  spinner = false;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private endPointService: EndpointService
  ) {
    this.botSettingForm = this.formBuilder.group({
      botName: ["", [Validators.required]],
      botURL: [""],
      botFile: [{ value: null, disabled: true }],
    });
  }

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.botFormErrorMessages;

    this.setValidation(this.botTypeData);

    if (this.botData) {
      //binding `botUri` value from parent component depending on bot type
      if (this.botTypeData == "DIALOGFLOW") {
        this.botSettingForm.controls["botFile"].patchValue(
          this.botData.botUri.metaData.name
        );
        this.serializedFile = JSON.stringify(this.botData.botUri);
      } else {
        this.botSettingForm.controls["botURL"].patchValue(this.botData.botUri);
      }
      this.botSettingForm.patchValue({
        botName: this.botData.botName,
      });

      if (this.botSettingForm.status == "INVALID") {
        this.valid = false;
      } else {
        let val = this.botSettingForm.controls["botFile"].value;
        if (
          this.botTypeData == "DIALOGFLOW" &&
          (val == undefined || val == null || val.length == 0)
        ) {
          this.valid = false;
        } else {
          this.valid = true;
        }
      }
    }

    //setting form validation messages
    this.botSettingForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.botSettingForm,
        this.formErrors,
        this.validations
      );

      //checking the validations on form fields
      if (this.botSettingForm.status == "INVALID") {
        this.valid = false;
      } else {
        let val = this.botSettingForm.controls["botFile"].value;
        if (
          this.botTypeData == "DIALOGFLOW" &&
          (val == undefined || val == null || val.length == 0)
        ) {
          this.valid = false;
        } else {
          this.valid = true;
        }
      }
    });
  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) {}

  //to create 'data' object and pass it to the parent component
  onSave() {
    let data: any = {
      botName: this.botSettingForm.value.botName,
      botUri: this.botSettingForm.value.botURL,
      botType: this.botTypeData,
    };

    if (this.botTypeData == "DIALOGFLOW") data.botUri = this.serializedFile;

    if (this.botData) data.botId = this.botData.botId;

    if (data.botId) {
      this.updateBotSetting(data);
    } else {
      this.createBotSetting(data);
    }
    // this.formSaveData.emit(data);
    // this.botSettingForm.reset();
  }

  // to send event msg and reset form after success response
  emitMsgAndResetForm(status) {
    let msg = `${status} Successfully`;
    this.formSaveData.emit(msg);
    this.botSettingForm.reset();
  }

  //to cancel form editing
  onClose() {
    this.childBotBool.emit(!this.parentBotBool);
    this.botSettingForm.reset();
  }

  //to set selected file name and set file name on UI and it accepts file properties as 'files' and change event as 'e'
  fileUpload(files, event) {
    if (files.length != 0) {
      var reader = new FileReader();
      var t = this;
      reader.onload = (e: any) => {
        try {
          if (e.target.result && e.target.result.length != 0) {
            let obj = JSON.parse(e.target.result);
            t.fileData = obj;
            t.setFileValue(files, t.fileData);
            t.botSettingForm.controls["botFile"].setValue(files[0].name);
          } else {
            t.botSettingForm.controls["botFile"].setValue(null);
            this.snackbar.snackbarMessage(
              "error-snackbar",
              "Selected File is Emtpy",
              1
            );
          }
        } catch (e) {
          t.botSettingForm.controls["botFile"].setValue(null);
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "Invalid file format",
            1
          );
          console.error("Error :", e);
        }
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  //forming file object to set as `botUri`, it accepts selected file properties as `files` and file data as `data` parameter
  setFileValue(meta, data) {
    let temp = {
      name: meta[0].name,
      size: meta[0].size,
      type: meta[0].type,
    };
    let file: any = {};
    file.metaData = temp;
    file.data = data;
    this.serializedFile = JSON.stringify(file);
  }

  //setting validation on `botURL` form control depending on bot type
  setValidation(val) {
    if (val == "DIALOGFLOW") {
      this.botSettingForm.controls["botURL"].setValidators(null);
    } else {
      this.botSettingForm.controls["botURL"].setValidators([
        Validators.required,
        Validators.pattern(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        ),
      ]);
    }
  }

  //to create bot, it accepts `data` object containing ('botName','botType'.'botUri') as parameter
  createBotSetting(data): void {
    //calling bot setting endpoint, it accepts bot setting object as `data` parameter
    this.endPointService.createBotSetting(data).subscribe(
      (res: any) => {
        // this.snackbar.snackbarMessage("success-snackbar", "Bot Created", 1);
        // this.spinner = false;
        this.emitMsgAndResetForm("Created");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update bot, it accepts `data` object containing ('botId,'botName','botType'.'botUri') as parameter
  updateBotSetting(data): void {
    //calling bot setting endpoint, it accepts bot setting object as `data` parameter
    this.endPointService.updateBotSetting(data).subscribe(
      (res: any) => {
        this.emitMsgAndResetForm("Updated");
        // this.snackbar.snackbarMessage("success-snackbar", "Updated", 1);
        // this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }
}
