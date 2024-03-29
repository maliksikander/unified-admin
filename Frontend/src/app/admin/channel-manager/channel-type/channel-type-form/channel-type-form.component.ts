import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../../../admin/services/common.service";
import { EndpointService } from "../../../../admin/services/endpoint.service";
import { SnackbarService } from "../../../../admin/services/snackbar.service";

@Component({
  selector: "app-channel-type-form",
  templateUrl: "./channel-type-form.component.html",
  styleUrls: ["./channel-type-form.component.scss"],
})
export class ChannelTypeFormComponent implements OnInit {
  @Input() parentBool;
  @Input() editData;
  @Output() childBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  channelTypeForm: FormGroup;
  formErrors = {
    name: "",
    channelLogo: "",
    isInteractive: "",
    mediaRoutingDomain: "",
  };
  validations;
  fileData: any;
  imageName: String;
  imageData;
  mrdData = [];
  formsList: [];
  spinner = true;
  valid = false;
  disclaimerText = `• Please select an image with no background. \n • A maximum file size of 100KB is allowed.`;
  uploadFilePayload;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private endPointService: EndpointService
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.channelTypeErrorMessages;

    this.channelTypeForm = this.formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9_-]+(?:\040[a-zA-Z0-9_-]+)*$/),
        ],
      ],
      channelLogo: [null, [Validators.required]],
      isInteractive: [true, [Validators.required]],
      mediaRoutingDomain: ["", [Validators.required]],
    });

    // this.getForms();
    this.getMRD();

    //setting form validation messages
    this.channelTypeForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.channelTypeForm,
        this.formErrors,
        this.validations
      );
    });
  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) {}

  //to cancel form editing
  onClose() {
    this.childBool.emit(!this.parentBool);
    this.channelTypeForm.reset();
  }

  //to set selected file name and set file name on UI and it accepts file properties as 'files' and change event as 'e'
  fileUpload(file, e) {
    try {
      let reader = new FileReader();
      if (file.length != 0) {
        if (file[0].size > 100000)
          return this.snackbar.snackbarMessage(
            "error-snackbar",
            "Image Size greater than 100KB",
            3
          );
        reader.readAsDataURL(file[0]);
        reader.onload = (_event) => {
          this.imageData = reader.result;
          this.imageName = e.target.files[0].name;
          this.channelTypeForm.controls["channelLogo"].setValue(this.imageName);
        };
      }

      let fd = new FormData();
      if (file[0]) {
        fd.append("file", file[0]);
        fd.append(
          "conversationId",
          `${Math.floor(Math.random() * 90000) + 10000}`
        );

        this.uploadFilePayload = fd;
      }
    } catch (e) {
      console.error("Error in File Upload :", e);
    }
  }

  //to get MRD list and set the local variable with the response
  getMRD() {
    this.endPointService.getMrd().subscribe(
      (res: any) => {
        this.mrdData = res;
        if (res.length == 0)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "NO MRD DATA FOUND",
            2
          );
        if (this.editData) this.patchEditValues();
        this.spinner = false;
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching MRD:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //patch value to form for editing
  patchEditValues() {
    try {
      const mrdIndex = this.mrdData.findIndex(
        (item) => item.id === this.editData.mediaRoutingDomain
      );
      this.channelTypeForm.patchValue({
        name: this.editData.name,
        isInteractive: this.editData.isInteractive,
        mediaRoutingDomain: this.mrdData[mrdIndex],
        channelLogo: " ",
      });

      this.channelTypeForm.controls["name"].disable();
      this.imageData = `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${this.editData?.channelLogo}`;
    } catch (e) {
      console.error("Error Patching:", e);
      this.spinner = false;
    }
  }

  // to upload file to file server and passing saved file fileName on success response
  uploadFile() {
    this.endPointService.uploadToFileEngine(this.uploadFilePayload).subscribe(
      (res: any) => {
        let fileName = res.name;
        this.setChannelTypeRequestPayload(fileName);
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Uploading File:", error);
      }
    );
  }

  //on save callback function to create
  onSave() {
    this.spinner = true;
    if (this.uploadFilePayload) {
      this.uploadFile();
    } else {
      this.setChannelTypeRequestPayload(this.editData?.channelLogo);
    }
  }

  // to create request payload, it receives selected file for logo as filename parameter
  setChannelTypeRequestPayload(filename) {
    try {
      let data = JSON.parse(JSON.stringify(this.channelTypeForm.value));
      data.channelLogo = filename;
      data.mediaRoutingDomain = data.mediaRoutingDomain.id;
      if (this.editData) {
        if (!data.name) data.name = this.editData.name;
        data.id = this.editData.id;
      }
      if (data.id) {
        this.updateChannel(data);
      } else {
        this.createChannelType(data);
      }
    } catch (e) {
      console.error("Error", e);
    }
  }

  // to send event msg and reset form after success response
  emitMsgAndResetForm(status) {
    try {
      let msg = `${status} Successfully`;
      this.formSaveData.emit(msg);
      this.channelTypeForm.reset();
    } catch (e) {
      console.error("Type Event Emitter Error", e);
    }
  }

  //to create channel, it accepts `data` object as parameter containing channel type properties
  createChannelType(data) {
    this.endPointService.createChannelType(data).subscribe(
      (res: any) => {
        this.emitMsgAndResetForm("Created");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Creating Type:", error);
      }
    );
  }

  //to update channel type, it accepts `data` object as parameter containing channel type properties
  updateChannel(data) {
    this.endPointService.updateChannelType(data, data.id).subscribe(
      (res: any) => {
        this.emitMsgAndResetForm("Updated");
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Updating Type:", error);
      }
    );
  }
}
