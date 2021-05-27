import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../services/common.service';
import { EndpointService } from '../services/endpoint.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  searchTerm = "";
  addForm: boolean = false;
  editData;
  pageTitle = "Forms";
  formsList = [];
  spinner = true;
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,) { }

  ngOnInit(): void {

    this.commonService.tokenVerification();
    let pageNumber = localStorage.getItem('formsPage');
    if (pageNumber) this.p = pageNumber;
    this.getForms();
  }

  // change the UI to form view and change page title
  addNewForm() {
    this.addForm = true;
    this.pageTitle = "New Form";
  }

  // change the UI to list view and reset local data variable it accepts a boolean value as parameter
  childToParentUIChange(e): void {
    this.addForm = e;
    if (this.addForm == false) {
      this.pageTitle = "Forms";
      this.searchTerm = "";
      this.getForms();
    }
    this.editData = undefined;
  }

  //to get form list and set the local variable with the response 
  getForms() {
    this.endPointService.getForm().subscribe(
      (res: any) => {
        this.spinner = false;
        this.formsList = res;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
      });
  }

  //converting date string to `date` type
  stringAsDate(dateStr: string) { return new Date(dateStr); }

  //Confirmation dialog for delete operation , it accepts the form object as parameter 
  deleteConfirm(data) {

    let msg = "Are you sure you want to delete this form ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Form",
        message: msg,
        text: 'confirm',
        data: data
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') {
        this.deleteForm(data);
      }
      else {
        this.spinner = false;
      }
    });
  }

  //to delete form, it accepts `data` containing `form` object as parameter and filters that particular object from local variable on success response
  deleteForm(data): void {

    //form delete endpoint, it accepts form object id as parameter
    this.endPointService.deleteForm(data.id).subscribe(
      (res: any) => {

        if (res && res.code == "Deleted") {
          this.formsList = this.formsList.filter(item => item.id != data.id);
          this.snackbar.snackbarMessage('success-snackbar', "Deleted", 1);
        }
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  //to edit form and change the view to edit  page,it accepts form object as parameter
  editForm(data): void {

    this.addForm = true;
    this.pageTitle = "Edit Form";
    this.editData = data;
  }

  // change form to lsit view and show snackbar message it accepts request repsonse('Created','Updated') as parameter 
  // and resets data variable and makes request to get updated forms list
  onSave(e) {

    this.snackbar.snackbarMessage('success-snackbar', e + ' ' + 'Successfully', 1);
    this.addForm = !this.addForm;
    this.editData = undefined;
    this.spinner = true;
    setTimeout(() => {
      this.getForms();
    }, 500);
  }

  // ngx-pagination setting methods
  pageChange(e) { localStorage.setItem('formsPage', e); }

  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('formsPage', e);
  }

  selectPage() { this.itemsPerPage = this.selectedItem; }
}
