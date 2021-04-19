import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  addForm: boolean = true;
  editFormData;
  pageTitle = "Forms";

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService,) { }

  ngOnInit(): void {
  }


  addNewForm() {
    this.addForm = true;
    // this.botType = type;
    this.pageTitle = "New Form";
  }



  childToParentUIChange(e): void {
    this.addForm = e;
    if (this.addForm == false) {
      this.pageTitle = "Forms";
    }
    this.editFormData = undefined;
  }

  onSave(event) {

  }
}
