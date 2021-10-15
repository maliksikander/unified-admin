import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-channel-provider",
  templateUrl: "./channel-provider.component.html",
  styleUrls: ["./channel-provider.component.scss"],
})
export class ChannelProviderComponent implements OnInit {
  addChannelProvider: boolean = false;
  spinner: boolean = true;
  pageTitle: String = "Channel Provider Interface";
  editProviderData;
  channelProviderList = [];
  searchTerm: String = "";
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.commonService.checkTokenExistenceInStorage();
    let pageNumber = sessionStorage.getItem("currentProviderPage");
    if (pageNumber) this.p = pageNumber;

    this.getChannelProviders();
  }

  //to get channel provider list
  getChannelProviders() {
    this.endPointService.getChannelProvider().subscribe(
      (res: any) => {
        this.spinner = false;
        this.channelProviderList = res;
      },
      (error: any) => {
        this.spinner = false;
        console.error("Error fetching:", error);
      }
    );
  }

  //to get logo/image from file engine, it accepts the file name as parameter and returns the url
  getFileURL(filename) {
    console.log("name==>",filename)
    // return `${this.endPointService.FILE_ENGINE_URL}/${this.endPointService.endpoints.fileEngine.downloadFileStream}?filename=${filename}`;
  }


  // ngx-pagination setting methods
  pageChange(e) {
    sessionStorage.setItem("channelTypePage", e);
  }

  pageBoundChange(e) {
    this.p = e;
    sessionStorage.setItem("channelTypePage", e);
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }
}
