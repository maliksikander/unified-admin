import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../services/common.service";
import { EndpointService } from "../services/endpoint.service";
import { SnackbarService } from "../services/snackbar.service";

@Component({
  selector: "app-pull-mode-routing",
  templateUrl: "./pull-mode-routing.component.html",
  styleUrls: ["./pull-mode-routing.component.scss"],
})
export class PullModeRoutingComponent implements OnInit {
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  spinner: any = true;
  searchTerm = "";
  formErrors = {
    name: "",
    description: "",
  };
  validations;
  pullModeListForm: FormGroup;
  formHeading = "Add New Pull Mode List";
  saveBtnText = "Create";
  pullModeListData = [];
  // reasonType = ["LOG_OUT", "NOT_READY"]
  editPullModeListData;

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.commonService.checkTokenExistenceInStorage();

    //setting local form validation messages
    this.validations = this.commonService.pullModeListFormErrorMessages;

    this.pullModeListForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      description: ["", [Validators.maxLength(500)]],
    });

    let pageNumber = sessionStorage.getItem("currentPullModePage");
    if (pageNumber) this.p = pageNumber;

    //checking for reason form validation failures
    this.pullModeListForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.pullModeListForm,
        this.formErrors,
        this.validations
      );
    });

    this.getPullModeList();
  }

  //to get pull mode list and set the local variable with response
  getPullModeList() {
    this.endPointService.getPullModeList().subscribe(
      (res: any) => {
        this.pullModeListData = res;
        // if (res.length == 0)
        // this.snackbar.snackbarMessage("error-snackbar", "NO DATA FOUND", 2);
        this.spinner = false;
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to open form dialog,this method accepts the `template variable` as a parameter assigned to the form in html.
  openPullModeModal(templateRef) {
    this.pullModeListForm.reset();
    this.formHeading = "Add Pull Mode List";
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

  //Confirmation dialog for delete, it accepts the pull mode list object as `data` parameter
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this pull mode list ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Delete Pull Mode List",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        // this.spinner = true;
        if (res === "delete") {
          // this.deleteReasonCode(id);
        } else {
          this.spinner = false;
        }
      });
  }

  // to edit pull Mode ,it excepts form template reference in html as `templateRef` and pull mode list object as `data` parameter
  editPullModeList(templateRef, data) {
    this.editPullModeListData = data;
    this.pullModeListForm.patchValue(data);
    this.formHeading = "Edit Pull Mode List";
    this.saveBtnText = "Update";
    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      panelClass: "add-attribute",
      disableClose: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.editPullModeListData = undefined;
    });
  }

  //to delete pull mode list, it accepts pull mode list object id as `id` parameter and updating the local list on success response
  // deleteReasonCode(id) {
  //   this.endPointService.deletePullModeList(id).subscribe(
  //     (res: any) => {
  //       this.spinner = false;
  //       this.pullModeListData = this.pullModeListData.filter(item => item.id != id);
  //       this.snackbar.snackbarMessage('success-snackbar', "Deleted Successfully", 1);
  //     },
  //     (error) => {
  //       this.spinner = false;
  //       console.log("Error fetching:", error);
  //       if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
  //     });
  // }

  // to save the reason object
  onSave() {
    this.spinner = true;
    let data = this.pullModeListForm.value;
    if (this.editPullModeListData) {
      data.id = this.editPullModeListData.id;
      this.updatePullModeList(data);
    } else {
      this.createPullModeList(data);
    }
  }

  //to update pull mode list object, it accepts list object (name:string, description:string) as `data` parameter
  //and update the local list on success response
  updatePullModeList(data) {
    this.endPointService.updatePullModeList(data).subscribe(
      (res: any) => {
        if (res.id) {
          let attr = this.pullModeListData.find((item) => item.id == res.id);
          let index = this.pullModeListData.indexOf(attr);
          this.pullModeListData[index] = res;
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
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to create pull mode list object, it accepts list object (name:string, description:string) as `data` parameter
  //and update the local list on success response
  createPullModeList(data) {
    this.endPointService.createPullModeList(data).subscribe(
      (res: any) => {
        this.getPullModeList();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Created Successfully",
          1
        );
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //save page number storage for reload
  pageChange(e) {
    sessionStorage.setItem("currentPullModePage", e);
  }

  //page bound change and saving for reload
  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("currentPullModePage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }
}
