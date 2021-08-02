import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/admin/services/common.service';
import { EndpointService } from 'src/app/admin/services/endpoint.service';
import { SnackbarService } from 'src/app/admin/services/snackbar.service';

@Component({
  selector: 'app-channel-type-form',
  templateUrl: './channel-type-form.component.html',
  styleUrls: ['./channel-type-form.component.scss']
})
export class ChannelTypeFormComponent implements OnInit {

  @Input() parentBool;
  @Input() editData;
  // @Input() botData;
  @Output() childBool = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  channelTypeForm: FormGroup;
  formErrors = {
    typeName: '',
    channelLogo: '',
    isInteractive: '',
    channelConfigSchema: '',
    mediaRoutingDomain: '',
  };
  validations;
  valid = false;
  fileData: any;
  imageName: String = '';
  imageData;
  mrdData = [];
  formsList: [];
  spinner = true;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private endPointService: EndpointService) { }

  ngOnInit() {

    this.commonService.tokenVerification();

    //setting local form validation messages 
    this.validations = this.commonService.channelTypeErrorMessages;

    this.channelTypeForm = this.formBuilder.group({
      typeName: ['', [Validators.required]],
      channelLogo: [{ value: '', disabled: true }, [Validators.required]],
      isInteractive: [true, [Validators.required]],
      channelConfigSchema: ['', [Validators.required]],
      mediaRoutingDomain: ['', [Validators.required]],
    });

    this.getForms();

    //setting form validation messages 
    this.channelTypeForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.channelTypeForm, this.formErrors, this.validations);
    });

  }

  //lifecycle hook to reflect parent component changes in child component
  ngOnChanges(changes: SimpleChanges) { }

  //to cancel form editing
  onClose() {
    this.childBool.emit(!this.parentBool);
    this.channelTypeForm.reset();
  }

  //to set selected file name and set file name on UI and it accepts file properties as 'files' and change event as 'e'
  fileUpload(files, e) {

    let reader = new FileReader();
    if (files.length != 0) {
      if (files[0].size > 2097152) return this.snackbar.snackbarMessage('error-snackbar', 'Image Size greater than 2Mb', 3);
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imageData = reader.result;
        this.imageName = e.target.files[0].name;
      }
    }
  }

  //to get form list and set the local variable with the response 
  getForms() {
    this.endPointService.getForm().subscribe(
      (res: any) => {
        // this.spinner = false;
        if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO FORM DATA FOUND", 2);
        this.formsList = res;
        this.getMRD();
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
      });
  }

  //to get MRD list and set the local variable with the response 
  getMRD() {
    this.endPointService.getMrd().subscribe(
      (res: any) => {

        this.mrdData = res;
        if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO MRD DATA FOUND", 2);
        this.patchEditValues();
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //patch value to form to be edited
  patchEditValues() {
    if (this.editData) {

      const mrdIndex = this.mrdData.findIndex(item => item.id === this.editData.mediaRoutingDomain);
      const formIndex = this.formsList.findIndex((item: any) => item.id === this.editData.channelConfigSchema.id);

      this.channelTypeForm.patchValue({
        typeName: this.editData.typeName,
        isInteractive: this.editData.isInteractive,
        channelConfigSchema: this.formsList[formIndex],
        mediaRoutingDomain: this.mrdData[mrdIndex],
      });
      this.imageData = this.editData.channelLogo;
    }
  }

  removeAttrInFormSchema(data) {
    let obj = { id: "" };
    obj.id = data.id;
    return obj;
  }

  //to create 'data' object and pass it to the parent component
  onSave() {

    let data = JSON.parse(JSON.stringify(this.channelTypeForm.value));
    data.channelConfigSchema = this.removeAttrInFormSchema(data.channelConfigSchema);
    data.channelLogo = this.imageData;
    data.mediaRoutingDomain = data.mediaRoutingDomain.id;
    if (this.editData) data.id = this.editData.id;
    // console.log("test==>", data);
    this.formSaveData.emit(data);
    this.channelTypeForm.reset();
  }
}