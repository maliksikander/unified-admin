import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let path: String = route?.routeConfig?.path;
    let resources: Array<any> = JSON.parse(localStorage.getItem("resources"));
    let local: String = localStorage.getItem("token");
    let session: String = sessionStorage.getItem("token");
    this.checkTokenExistenceInStorage(local, session);
    let accessRoute: boolean = this.checkRouteAccess(path, resources);
    return accessRoute;
  }

  checkRouteAccess(path: String, resources: Array<any>) {
    try {
      let resPath;
      if (path.includes("general")) {
        resPath = "general";
      } else if (path === "bot-settings") {
        resPath = "bot-settings";
      } else if (path === "form") {
        resPath = "form";
      } else if (path === "reason-code") {
        resPath = "reason-code";
      } else if (path === "pull-mode-list") {
        resPath = "pull-mode-list";
      } else if (path === "web-widget") {
        resPath = "web-widget";
      } else if (path.includes("channel")) {
        resPath = "channel";
      }

        else if (path  === "routing/attributes") {
        resPath = "routing-attribute";
      } else if (path  === "routing/media-routing-domain") {
        resPath = "mrd";
      } else if (path  === "routing/mrd-tasks") {
        resPath = "agent-mrd";
      } else if (path  === "routing/precision-queue") {
        resPath = "queue";
      } else if (path  === "routing/agents") {
        resPath = "agent-attributes";
      }
      
      else if (path.includes("calendar")) {
        resPath = "calendar";
      } else if (path === "agent-desk") {
        resPath = "agent-desk";
      } 

      let value = this.checkResource(resPath, resources);
      return value;
    } catch (e) {
      console.log("[Route Access Error]:", e);
    }
  }

  checkResource(path, resources) {
    try {
      for (let i = 0; i < resources.length; i++) {
        if (resources[i].rsname.includes(path)) {
          let resourceScopes: Array<any> = resources[i].scopes;
          for (let j = 0; j <= resourceScopes.length; j++) {
            if (resourceScopes[j] === "view") return true;
          }
        }
      }
      return false;
    } catch (e) {
      console.log("[Guard Resource Check Error]:", e);
    }
  }

  //to verify token existence in local/session storage
  checkTokenExistenceInStorage(local, session) {
    if (local == null && session == null) this.navigateToLogin();
  }

  //to navigate to login page
  navigateToLogin() {
    this.router.navigate(["/login"]);
    return false;
  }
}
