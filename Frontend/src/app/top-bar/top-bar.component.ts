import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.scss"],
})
export class TopBarComponent implements OnInit {
  today = new Date();
  userName = "User Name";

  constructor(private router: Router) {}

  ngOnInit() {
    let user = localStorage.getItem("username")
      ? localStorage.getItem("username")
      : sessionStorage.getItem("username");
    if (user) this.userName = user;
    // this.clock();
  }

  // clock() {
  //   this.today = new Date();
  //   let timeoutId = setInterval(() => {
  //     this.today = new Date();
  //   }, 1000);
  // }

  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("currentAttributePage");
    sessionStorage.removeItem("currentMRDPage");
    sessionStorage.removeItem("currentQueuePage");
    sessionStorage.removeItem("currentUsersPage");
    sessionStorage.removeItem("channelTypePage");
    sessionStorage.removeItem("currentReasonCodePage");
    sessionStorage.removeItem("currentPullModePage");
    sessionStorage.removeItem("webWidgetPage");
    sessionStorage.removeItem("tenant");
    sessionStorage.removeItem("formsPage");
    localStorage.removeItem("username");
    localStorage.removeItem("tenant");
    localStorage.removeItem("token");
    
    // sessionStorage.removeItem('permittedResources');

    this.router.navigate(["/login"]);
  }
}
