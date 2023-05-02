import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../services/common.service";
import { EndpointService } from "../services/endpoint.service";
import { SnackbarService } from "../services/snackbar.service";

@Component({
  selector: "app-web-widget-list",
  templateUrl: "./web-widget-list.component.html",
  styleUrls: ["./web-widget-list.component.scss"],
})
export class WebWidgetListComponent implements OnInit {
  addWidget: boolean = false;
  spinner: boolean = true;
  pageTitle: String = "Web Widget";
  editWidgetData;
  webWidgetList = [];
  searchTerm: String = "";
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  managePermission: boolean = false;
  languageList: Array<any>;
  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    // this.commonService.checkTokenExistenceInStorage();
    let pageNumber = sessionStorage.getItem("webWidgetPage");
    if (pageNumber) this.p = pageNumber;
    this.getWebWidgets();
    this.managePermission = this.commonService.checkManageScope("web");
  }

  //to get web widget list
  getWebWidgets() {
    //calling endpoint service method to get web widget list
    this.endPointService.getWebWidgetList().subscribe(
      (res: any) => {
        // this.webWidgetList = res;
        this.getLocaleSettings(res);
        // this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching web widget list:", error);
      }
    );
  }

  getLocaleSettings(widgetList) {
    let widgetListTemp: Array<any> = widgetList;
    //calling endpoint service method to get local settings
    this.endPointService.getLocaleSetting().subscribe(
      (res: any) => {
        this.languageList = res[0]?.supportedLanguages
          ? res[0]?.supportedLanguages
          : [];

        // assigning lang object according to selected lang code in each widget
        widgetListTemp.forEach((widget) => {
          let languageIndex = this.languageList.findIndex(
            (lang) => lang.code == widget.language.code
          );
          if (languageIndex != -1) {
            widget.language = {
              ...widget.language,
              ...this.languageList[languageIndex],
            };
          }
        });

        if (this.languageList.length == 0)
          this.snackbar.snackbarMessage(
            "error-snackbar",
            "No Language Found",
            1
          );
        this.webWidgetList = widgetListTemp;
        this.spinner = false;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching locale settings:", error);
      }
    );
  }

  //to change form ui view to list view
  childToParentUIChange(e): void {
    this.addWidget = e;
    if (this.addWidget == false) {
      this.pageTitle = "Web Widget";
    }
    this.editWidgetData = undefined;
  }

  //to enable web widget form view and change page title
  addWebWidget() {
    this.addWidget = true;
    this.pageTitle = "Web Widget Settings";
  }

  //to edit web widget and enable form view and change page title an pass data to child component
  editWebWidget(data) {
    this.addWidget = true;
    this.pageTitle = "Edit Web Widget Settings";
    this.editWidgetData = data;
  }

  //Confirmation dialog for delete operation , it accepts the attribute object as `data` parameter
  deleteConfirm(data) {
    // let id = data.id;
    let msg = "Are you sure you want to delete this widget config ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: ['confirm-dialog-container' , 'delete-confirmation'],
        disableClose: true,
        data: {
          heading: "Delete Web Widget",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteWebWidget(data);
        } else {
          this.spinner = false;
        }
      });
  }

  //to delete web widget, it accepts `data` as parameter containing web widget properties and
  //filters that particular object from local list variable if there is a success response.
  deleteWebWidget(data) {
    //calling endpoint service method which accepts web widget id as `id` object as parameter
    this.endPointService.deleteWebWidget(data?.widgetIdentifier).subscribe(
      (res: any) => {
        this.spinner = false;
        this.webWidgetList = this.webWidgetList.filter(
          (item) => item.id != data.id
        );
        this.snackbar.snackbarMessage("success-snackbar", "Deleted", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error in deleting widget config:", error);
      }
    );
  }

  //on save callback function
  onSave(msg) {
    this.pageTitle = "Web Widget";
    this.addWidget = false;
    this.spinner = true;
    this.snackbar.snackbarMessage("success-snackbar", msg, 1);
    this.getWebWidgets();
  }

  // ngx-pagination setting methods
  pageChange(e) {
    sessionStorage.setItem("webWidgetPage", e);
  }

  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("webWidgetPage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }
}
