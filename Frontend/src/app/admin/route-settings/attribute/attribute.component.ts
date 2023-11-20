import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-attribute",
  templateUrl: "./attribute.component.html",
  styleUrls: ["./attribute.component.scss"],
})
export class AttributeComponent implements OnInit {
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  spinner: any = true;
  searchTerm = "";
  formErrors = {
    name: "",
    description: "",
    type: "",
  };
  validations;
  attributeForm: FormGroup;
  formHeading = "Add New Attribute";
  saveBtnText = "Create";
  attrData = [];
  editData;
  // reqServiceType = 'routing-attributes';
  editFlag: boolean = false;
  managePermission:boolean = false;

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
    this.validations = this.commonService.attributeFormErrorMessages;

    this.attributeForm = this.formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: ["", [Validators.maxLength(500)]],
      type: ["", [Validators.required]],
      profVal: [1],
      boolVal: [true],
    });

    let pageNumber = sessionStorage.getItem("currentAttributePage");
    if (pageNumber) this.p = pageNumber;

    //checking for Attribute form validation failures
    this.attributeForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(
        this.attributeForm,
        this.formErrors,
        this.validations
      );
    });

    this.getAttribute();
    this.managePermission = this.commonService.checkManageScope("routing-attribute");
  }

  //to open form dialog,this method accepts the `template variable` as a parameter assigned to the form in html.
  openModal(templateRef) {
    this.attributeForm.reset();
    this.attributeForm.controls["profVal"].patchValue(1);
    this.attributeForm.controls["boolVal"].patchValue(true);
    this.formHeading = "Add New Attribute";
    this.saveBtnText = "Create";
    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      // height: '440px',
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

  //to create attribute and it accepts `data` object as parameter with following properties
  //name:string, description:string, type:string, defaultValue:string
  createAttribute(data) {
    this.endPointService.createAttribute(data).subscribe(
      (res: any) => {
        this.getAttribute();
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Attribute Created Successfully",
          1
        );
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to get attribute list and set the local variable with the response
  getAttribute() {
    this.endPointService.getAttribute().subscribe(
      (res: any) => {
        this.spinner = false;
        this.attrData = res;
        // if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
      }
    );
  }

  //to update attribute and it accepts `data` object & `id` as parameter,`data` object (name:string, description:string, type:string, defaultValue:string)
  //and updating the local list with the success response object
  updateAttribute(data, id) {
    this.endPointService.updateAttribute(data, id).subscribe(
      (res: any) => {
        if (res.id) {
          let attr = this.attrData.find((item) => item.id == res.id);
          let index = this.attrData.indexOf(attr);
          this.attrData[index] = res;
          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Attribute Updated Successfully",
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

  //to delete attribute and it accepts `data` object & `id` as parameter,`data` object (name:string, description:string, type:string, defaultValue:string)
  //and to update the local list when the operation is successful
  deleteAttribute(data, id) {
    this.endPointService.deleteAttribute(id).subscribe(
      (res: any) => {
        this.spinner = false;
        if (res) {
          this.attrData = this.attrData.filter((item) => item.id != data.id);

          this.snackbar.snackbarMessage(
            "success-snackbar",
            "Attribute Deleted Successfully",
            1
          );
        }
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        if (error && error.status == 409)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "Attribute is assigned, Cannot be deleted",
            1
          );
      }
    );
  }

  //to edit attribute,it accepts `templateRef' & `data` object as parameter,`data` object (name:string, description:string, type:string, defaultValue:string)
  //and patches the existing values with form controls and opens the form dialog
  editAttribute(templateRef, data) {
    this.editData = data;
    let boolVal;
    if (data.type == "BOOLEAN") {
      if (data.defaultValue == 0) {
        boolVal = false;
      } else {
        boolVal = true;
      }
    }
    this.attributeForm.patchValue({
      name: data.name,
      description: data.description,
      type: data.type,
      profVal: data.defaultValue,
      boolVal: boolVal,
    });

    this.editFlag = true;
    this.formHeading = "Edit Attribute";
    this.saveBtnText = "Update";
    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      // height: '440px',
      panelClass: "add-attribute",
      disableClose: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.editData = undefined;
      this.editFlag = false;
    });
  }

  //Confirmation dialog for delete operation , it accepts the attribute object as `data` parameter
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this attribute ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: ['confirm-dialog-container' , 'delete-confirmation'],
        disableClose: true,
        data: {
          heading: "Delete Attribute",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteAttribute(data, id);
        } else {
          this.spinner = false;
        }
      });
  }

  onSave() {
    this.spinner = true;
    let data: any = this.onSaveObject();
    if (this.editData) {
      this.updateAttribute(data, this.editData.id);
    } else {
      this.createAttribute(data);
    }
  }

  // Object manipulation for request body
  onSaveObject() {
    let data: any = {};
    data.name = this.attributeForm.value.name;
    data.description = this.attributeForm.value.description;
    data.type = this.attributeForm.value.type;
    if (this.attributeForm.value.type == "BOOLEAN") {
      if (this.attributeForm.value.boolVal == false) {
        data.defaultValue = 0;
      } else {
        data.defaultValue = 1;
      }
    } else {
      data.defaultValue = this.attributeForm.value.profVal;
    }
    return data;
  }

  //progress bar setting
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "k";
    }
    return value;
  }

  //save page number storage for reload
  pageChange(e) {
    sessionStorage.setItem("currentAttributePage", e);
  }

  //page bound change and saving for reload
  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("currentAttributePage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }
}
