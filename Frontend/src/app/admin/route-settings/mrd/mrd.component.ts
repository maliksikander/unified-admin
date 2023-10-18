import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators,AbstractControl,ValidationErrors } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";
import { even } from "@rxweb/reactive-form-validators";
@Component({
  selector: "app-mrd",
  templateUrl: "./mrd.component.html",
  styleUrls: ["./mrd.component.scss"],
})
export class MrdComponent implements OnInit {
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  spinner: any = true;
  searchTerm = "";
  formErrors = {
    name: "",
    description: "",
    mrdType: "",
    maxRequests: "",
  };
  validations;
  mrdForm: FormGroup;
  formHeading = "Add New MRD";
  saveBtnText = "Create";
  mrdData = [];
  mrdType = [];
  editData: any;
  managePermission: boolean = false;

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();
    this.validations = this.commonService.mrdFormErrorMessages;
    //setting local form validation messages
    this.mrdForm = this.formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(256),
        ],
      ],
      description: ["", [
        Validators.maxLength(500),
      ]],
      mrdType: [null, [
        Validators.required,
      ]],
      maxRequests: ['',[Validators.required, Validators.min(0), Validators.max(10)]],
    });
    let pageNumber = sessionStorage.getItem("currentMRDPage");
    if (pageNumber) this.p = pageNumber;

    //checking for MRD form validation failures
    this.mrdForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.mrdForm,
        this.formErrors,
        this.validations
      );
    });

    this.getMRD();
    this.getMRDType();
    this.managePermission = this.commonService.checkManageScope("routing");
  }

  getMaxRequestsValue(selectedType:any) {
    if(selectedType.interruptible === false) {
      this.mrdForm.get('maxRequests').setValidators([Validators.min(0), Validators.max(1)]);
    } else {
      this.mrdForm.get('maxRequests').setValidators([Validators.min(0), Validators.max(10)]);
    }
    this.mrdForm.get('maxRequests').updateValueAndValidity();
  }

  //to open form dialog,this method accepts the `templateRef` as a parameter assigned to the form in html.
  openModal(templateRef) {
    try {
      this.mrdForm.reset();
      this.formHeading = "Add New MRD";
      this.saveBtnText = "Create";
      let dialogRef = this.dialog.open(templateRef, {
        width: "500px",
        height: "auto",
        panelClass: "add-attribute",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => { });
    } catch (e) {
      console.error("Error on open modal :", e);
    }
  }

  //resetting dialog
  onClose() {
    this.dialog.closeAll();
    this.searchTerm = "";
    this.editData = undefined;
  }

  //to create MRD and it accepts `data` object as parameter with following properties (name:string, description:string, interruptible:string,maxRequests:number)
  //and update the local list
  createMRD(data) {
    this.endPointService.createMrd(data).subscribe(
      (res: any) => {
        this.getMRD();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "MRD Created Successfully",
          1
        );
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Creating MRD:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get MRD list and set the local variable with the response
  getMRD() {
    this.endPointService.getMrd().subscribe(
      (res: any) => {
        this.spinner = false;
        this.mrdData = res;
      },
      (error) => {
        this.spinner = false;
        console.error("Error Fetching MRD:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  getMRDType() {
    this.endPointService.getMrdType().subscribe(
      (res: any) => {
        this.spinner = false;
        this.mrdType = res;
        //console.log("here is the mrd type", res)
      },
      (error) => {
        this.spinner = false;
        console.error("Error Fetching MRD TYPE:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // Returning the ItemTypeID to ItemType Name
  getMrdTypeByID(typeID) {
    const mrdItem = this.mrdType.find(item => item.id === typeID);
    return mrdItem ? mrdItem.name : 'N/A';
    
  }
  //to update MRD and it accepts `data` object & `id` as parameter,`data` object (name:string, description:string, interruptible:string)
  //and updating the local list with the success response object
  updateMRD(data, id) {
    this.endPointService.updateMrd(data, id).subscribe(
      (res: any) => {
        if (res.id) {
          let attr = this.mrdData.find((item) => item.id == res.id);
          let index = this.mrdData.indexOf(attr);
          this.mrdData[index] = res;
          this.snackbar.snackbarMessage(
            "success-snackbar",
            "MRD Updated Successfully",
            1
          );
        }
        this.dialog.closeAll();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error Updating MRD:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to delete MRD and it accepts `data` object & `id` as parameter,`data` object (name:string, description:string, interruptible:string)
  //and to update the local list when the operation is successful
  deleteMRD(data, id) {
    this.endPointService.deleteMrd(id).subscribe(
      (res: any) => {
        this.spinner = false;

        if (res) {
          this.mrdData = this.mrdData.filter((item) => item.id != data.id);

          this.snackbar.snackbarMessage(
            "success-snackbar",
            "MRD Deleted Successfully",
            1
          );
        }
      },
      (error) => {
        this.spinner = false;
        console.error("Error Deleting MRD:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        else if (error && error.status == 409)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "MRD is assigned, Cannot be deleted",
            1
          );
      }
    );
  }

  //delete confirmation dialog with mrd object as `data` parameter
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this MRD ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: ['confirm-dialog-container', 'delete-confirmation'],
        disableClose: true,
        data: {
          heading: "Delete Media Routing Domain",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          // this.deleteMRD(data, id);
          this.getMRDMappingToChannelType(data, id);
        } else {
          this.spinner = false;
        }
      });
  }

  //to get channel type list and it expects the relevant mrd id
  getMRDMappingToChannelType(data, id) {
    this.endPointService.getMRDMappedChannelType(id).subscribe(
      (res: any) => {
        let channelTypeList: Array<any> = res;
        if (channelTypeList.length == 0) {
          this.deleteMRD(data, id);
        } else {
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "MRD MAPPED TO CHANNEL TYPE",
            2
          );
          this.spinner = false;
        }
      },
      (error) => {
        this.spinner = false;
        console.error("Error Fetching MRD mapped channel type:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to edit MRD,it accepts `templateRef' & `data` object as parameter,`data` object (name:string, description:string, interruptible:string)
  //and patches the existing values with form controls and opens the form dialog
  editMrd(templateRef, data) {
    try {
      //console.log("here is the data to be edited",data,"and tempplateRef", templateRef, )
      this.editData = data;
      let selectedMrdType = this.mrdType.find(item =>item.id === data.type)
      this.mrdForm.patchValue({
        name: data.name,
        description: data.description,
        maxRequests: data.maxRequests,
      });
      this.mrdForm.get('mrdType').setValue(selectedMrdType)
      this.getMaxRequestsValue(selectedMrdType)
      this.formHeading = "Edit MRD";
      this.saveBtnText = "Update";
      let dialogRef = this.dialog.open(templateRef, {
        width: "500px",
        height: "auto",
        panelClass: "add-attribute",
        disableClose: true,
        data: data,
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.editData = undefined;
      });
    } catch (e) {
      console.error("Error on edit mrd :", e);
    }
  }

  // To change toggle value and updating MRD ,it accepts toggle value paramter as 'e' and mrd object parameter as data.
  onStatusChange(e, data) {
    try {
      let payload = JSON.parse(JSON.stringify(data));
      this.spinner = true;
      if (payload.id) delete payload.id;
      payload.interruptible = e.checked;
      this.updateMRD(payload, data.id);
    } catch (e) {
      console.error("Error on status change :", e);
    }
  }

  // Object manipulation for request body
  onSaveObject() {
    try {
      let data: any = {};
      data.name = this.mrdForm.value.name;
      data.description = this.mrdForm.value.description;
      if (this.mrdForm.value.mrdType) {
        data.mrdTypeId = this.mrdForm.value.mrdType.id;
      }
      data.maxRequests = this.mrdForm.value.maxRequests;
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
        this.updateMRD(data, this.editData.id);
      } else {
        this.createMRD(data);
      }
    } catch (e) {
      console.error("Error on save :", e);
    }
  }

  //save page number storage for reload
  pageChange(e) {
    sessionStorage.setItem("currentMRDPage", e);
  }

  //page bound change and saving for reload
  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("currentMRDPage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }
}
