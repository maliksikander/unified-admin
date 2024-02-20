import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-email-auto-response',
  templateUrl: './email-auto-response.component.html',
  styleUrls: ['./email-auto-response.component.scss']
})
export class EmailAutoResponseComponent implements OnInit {
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  searchTerm = '';
  spinner: any = false;
  formHeading = 'Create Auto-Response';
  saveBtnText = 'Create';
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

  signatureData = [
    {
      'id': '6540acdaa9138a5942kke99790',
      'team': 'Marketing',
      'signatureName': 'Customer Support - manager',
      'createdOn': '2023-02-03T08:47:03.066+00:00',
      'email': 'rfernandez3@elegantthemes.com',
      'user': 'John Taylor'
    }, {
      'id': '6540acdaa91a5942kke99790',
      'team': 'Customer Support',
      'signatureName': 'Team Lead - Adam Miller',
      'createdOn': '2023-04-03T08:47:03.066+00:00',
      'email': 'aclemits0@pagesperso-orange.fr',
      'user': 'Verne West-Frimley'
    }, {
      'id': '6540acdaa9138a5942k99790',
      'team': 'Technical Support',
      'signatureName': 'Project Director - Andrew Trate',
      'createdOn': '2023-04-03T08:47:03.066+00:00',
      'email': 'bjays1@technorati.com',
      'user': 'Ev Gayforth'
    }, {
      'id': '6540acdaa9138a594ke99790',
      'team': 'Business Management',
      'signatureName': 'Customer Support',
      'createdOn': '2023-05-03T08:47:03.066+00:00',
      'email': 'aclemits0@pagesperso-orange.fr',
      'user': 'Glenn Helgass'
    },

  ];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }


  editSignature(templateRef, data) {
    this.formHeading = 'Edit Response';
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
    });
  }

  addSignature(templateRef) {
    this.formHeading = 'Create Response';
    let dialogRef = this.dialog.open(templateRef, {
      width: '100%',
      maxWidth: '800px',
      panelClass: ['add-attribute', 'add-team'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  deleteConfirm(e) {
    let msg = `Are you sure you want to delete " ${e.name} " Response ?`;
    return this.dialog
        .open(ConfirmDialogComponent, {
          panelClass: ['confirm-dialog-container', 'delete-confirmation'],
          disableClose: true,
          width: '500px',
          data: {
            heading: 'Delete Response',
            message: msg,
            text: 'confirm'
          },
        })
        .afterClosed()
        .subscribe((res: any) => {
        });
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
