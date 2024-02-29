import {Component, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';
import { FormBuilder, FormGroup, Validators,AbstractControl,ValidationErrors } from "@angular/forms";
import { CommonService } from "../../services/common.service";

@Component({
  selector: 'app-email-signature',
  templateUrl: './email-signature.component.html',
  styleUrls: ['./email-signature.component.scss']
})
export class EmailSignatureComponent implements OnInit {

  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  searchTerm = '';
  editData: any;
  signatureData: any = [];
  allChannels: any = [];
  channelDataByName: any = [];
  spinner: any = false;
  formHeading = 'Create signature';
  saveBtnText = 'Create';
  signatureForm: FormGroup;
  formErrors = {
    signatureName: "",
    channelIdentifer: "",
    signatureBody: "",
  };
  signatures = '';
  htmlText ="";
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{list: 'ordered'}, {list: 'bullet'}],
        //  [{ script: "sub" }, { script: "super" }], // superscript/subscript
        //  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        // [{ direction: "rtl" }], // text direction

        // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        [{color: []}, {background: []}],

        [{font: []}],
        [{align: []}],

        ['clean'], // remove formatting button

        ['link', 'image'],
        ['attachment']
      ],
    }
  };

  constructor(
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    ) {}

  ngOnInit(): void {


    this.signatureForm = this.formBuilder.group({
      signatureName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(256),
        ],
      ],
      channelIdentifer: ['', [
        Validators.maxLength(500),
      ]],
      signatureBody: ['']
    });

    this.getSignatures();
    this.getChannelsTypeByName()

  }



   async getSignatures() {
    try {
      const res: any = await this.endPointService.getSignature().toPromise();
      this.signatureData = res;
      this.spinner = false;

    } catch (error) {
      this.spinner = false;
      console.error("Error fetching Email Signatures:", error);
    }
  }

  async createSignature(data) {
    this.endPointService.createSignature(data).subscribe(
      (res: any) => {
        this.getSignatures();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Email Signature Created Successfully",
          3
        );
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Creating Email Signature:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 2);
      }
    );
  }


  async getChannelsTypeByName() {
    try {
      const id = "65a9406d6a07914e2f360799"
        const res: any = await this.endPointService.getChannelByChannelType(id).toPromise();
        this.channelDataByName = res
        this.spinner = false;
    } catch (error) {
        console.error("Error fetching Email Signatures:", error);
        throw new Error("Error fetching Email Signatures");
    }

  }



  editSignature(templateRef, data) {
    
    this.editData = data
    this.signatureForm.patchValue({
      signatureName: data.signatureName,
      channelIdentifer: data.channelIdentifer,
      signatureBody: data.signatureBody
    });

    this.formHeading = 'Edit signature';
    this.saveBtnText = 'Update';
    this.signatures = data.name;

    let dialogRef = this.dialog.open(templateRef, {
      width: '100%',
      maxWidth: '800px',
      panelClass: ['add-attribute', 'add-team'],
      disableClose: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.editData = undefined;
    });
  }

  updateSignature(data, id) {

    this.endPointService.updateSignature(data, id).subscribe(
      (res: any) => {

          let attr = this.signatureData.response.find((item) => item.id == id);

          let index = this.signatureData.response.indexOf(attr);

          this.signatureData.response[index] = res.response;
          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Email Signature Updated Successfully",
            4
          );

        this.dialog.closeAll();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Updating Email Signature:", error);
        this.snackbar.snackbarMessage("error-snackbar", error.error.message,4)
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  addSignature(templateRef) {
    this.signatureForm.reset()
    this.formHeading = 'Create signature';
    let dialogRef = this.dialog.open(templateRef, {
      width: '100%',
      maxWidth: '800px',
      panelClass: ['add-attribute', 'add-team'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  deleteSignature(data) {

    this.endPointService.deleteSignature(data.id).subscribe(
      (res: any) => {
        this.getSignatures();
        this.spinner = false;

        if (res) {
          this.signatureData = this.signatureData.response.filter((item) => item.id != data.id);

          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Email Signature Deleted Successfully",
            3
          );
        }
      },
      (error) => {
        this.spinner = false;
        console.error("Error Deleting Email Signature:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  deleteConfirm(data) {
    
    let msg = `Are you sure you want to delete " ${data.signatureName} " signature ?`;
    return this.dialog
        .open(ConfirmDialogComponent, {
          panelClass: ['confirm-dialog-container', 'delete-confirmation'],
          disableClose: true,
          width: '500px',
          data: {
            heading: 'Delete signature',
            message: msg,
            text: 'confirm'
          },
        })
        .afterClosed()
        .subscribe((res: any) => {
          this.spinner = true;
          if (res === "delete") {
            this.deleteSignature(data);
          } else {
            this.spinner = false;
          }
        });
  }

  onSaveObject() {
    try {
      let data: any = {};
      data.signatureName = this.signatureForm.value.signatureName;
      data.channelIdentifer = this.signatureForm.value.channelIdentifer;

      data.signatureBody = this.signatureForm.value.signatureBody;
      return data;
    } catch (e) {
      console.error("Error on save object :", e);
    }
  }
  onSave() {
    try {
      this.spinner = true;
      let data: any = this.onSaveObject();
      if (this.editData) {

        let editedSignature = Object.assign({}, this.editData);
        editedSignature.signatureName = data.signatureName;
        editedSignature.channelIdentifer = data.channelIdentifer;
        editedSignature.signatureBody = data.signatureBody;

        this.updateSignature(editedSignature, this.editData.id);
        this.dialog.closeAll();

      } else {
        
        this.createSignature(data);
        this.dialog.closeAll();
      }
    } catch (e) {
      console.error("Error on save :", e);
    }
  }
  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }

  //save page number storage for reload
  pageChange(e) {
    sessionStorage.setItem('currentAttributePage', e);
  }

  //page bound change and saving for reload
  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem('currentAttributePage', e);
  }

  onClose() {
    this.dialog.closeAll();
  }

}
