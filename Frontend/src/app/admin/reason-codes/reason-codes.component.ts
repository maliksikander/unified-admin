import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../services/common.service";
import { EndpointService } from "../services/endpoint.service";
import { SnackbarService } from "../services/snackbar.service";

@Component({
  selector: "app-reason-codes",
  templateUrl: "./reason-codes.component.html",
  styleUrls: ["./reason-codes.component.scss"],
})
export class ReasonCodesComponent implements OnInit {
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  spinner: any = true;
  searchTerm = "";
  formErrors = {
    label: "",
    description: "",
    type: "",
  };
  validations;
  reasonForm: FormGroup;
  formHeading = "Add New Reason";
  saveBtnText = "Create";
  reasonCodeData = [];
  reasonType = ["LOG_OUT", "NOT_READY"];
  editReasonData;

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    // this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.reasonFormErrorMessages;

    this.reasonForm = this.formBuilder.group({
      label: ["", [Validators.required, Validators.maxLength(100)]],
      description: ["", [Validators.maxLength(500)]],
      type: ["", [Validators.required]],
    });

    let pageNumber = sessionStorage.getItem("currentReasonCodePage");
    if (pageNumber) this.p = pageNumber;

    //checking for reason form validation failures
    this.reasonForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.reasonForm,
        this.formErrors,
        this.validations
      );
    });

    this.getReasonCode();
  }

  //to get reason code list and set the local variable with response
  getReasonCode() {
    this.endPointService.getReasonCode().subscribe(
      (res: any) => {
        this.reasonCodeData = res;
        // if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
        this.spinner = false;
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to open form dialog,this method accepts the `template variable` as a parameter assigned to the form in html.
  openCreateReasonModal(templateRef) {
    this.reasonForm.reset();
    this.formHeading = "Add Reason Code";
    this.saveBtnText = "Create";
    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  //resetting dialog
  onClose() {
    this.dialog.closeAll();
    this.searchTerm = "";
  }

  //Confirmation dialog for delete, it accepts the reason object as `data` parameter
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this reason code ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Delete Reason Code",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteReasonCode(id);
        } else {
          this.spinner = false;
        }
      });
  }

  // to edit reason code ,it excepts form template reference in html as `templateRef` and reason object as `data` parameter
  editReasonCode(templateRef, data) {
    this.editReasonData = data;
    this.reasonForm.patchValue(data);
    this.formHeading = "Edit Reason Code";
    this.saveBtnText = "Update";
    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      panelClass: "add-attribute",
      disableClose: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.editReasonData = undefined;
    });
  }

  //to delete reason code, it accepts reason code object id as `id` parameter and updating the local list on success response
  deleteReasonCode(id) {
    this.endPointService.deleteReasonCode(id).subscribe(
      (res: any) => {
        this.spinner = false;
        // if (res) {
        this.reasonCodeData = this.reasonCodeData.filter(
          (item) => item.id != id
        );
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Deleted Successfully",
          1
        );
        // }
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  // to save the reason object
  onSave() {
    this.spinner = true;
    let data = this.reasonForm.value;
    if (this.editReasonData) {
      data.id = this.editReasonData.id;
      this.updateReasonCode(data);
    } else {
      this.createReasonCode(data);
    }
  }

  //to update reason object, it accepts reason object (label:string, description:string, type:string, code:number) as `data` parameter
  //and update the local list on success response
  updateReasonCode(data) {
    this.endPointService.updateReasonCode(data).subscribe(
      (res: any) => {
        if (res.id) {
          let attr = this.reasonCodeData.find((item) => item.id == res.id);
          let index = this.reasonCodeData.indexOf(attr);
          this.reasonCodeData[index] = res;
          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Updated Successfully",
            1
          );
        }
        this.dialog.closeAll();
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to create reason object, it accepts reason object (label:string, description:string, type:string) as `data` parameter
  //and update the local list on success response
  createReasonCode(data) {
    this.endPointService.createReasonCode(data).subscribe(
      (res: any) => {
        this.getReasonCode();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Created Successfully",
          1
        );
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //save page number storage for reload
  pageChange(e) {
    sessionStorage.setItem("currentReasonCodePage", e);
  }

  //page bound change and saving for reload
  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("currentReasonCodePage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }
}
