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
    // console.log("router==>", route?.routeConfig?.path);
    let path: String = route?.routeConfig?.path;
    let resources: Array<any> = JSON.parse(localStorage.getItem("resources"));
    let local: String = localStorage.getItem("token");
    let session: String = sessionStorage.getItem("token");
    this.checkTokenExistenceInStorage(local, session);
    // console.log("path-->", path);
    let accessRoute: boolean = this.checkRouteAccess(path, resources);
    console.log("val==>", accessRoute);
    return accessRoute;
  }

  checkRouteAccess(path: String, resources: Array<any>) {
    let resPath;
    if (path.includes("general")) {
      resPath = "general";
    } else if (path.includes("bot")) {
      resPath = "bot";
    }
    // console.log("res path-->", resPath);
    let value = this.checkResource(resPath, resources);
    return value;
  }

  checkResource(path, resources) {
    for (let i = 0; i < resources.length; i++) {
      if (resources[i].rsname.includes(path)) {
        let resourceScopes: Array<any> = resources[i].scopes;
        for (let j = 0; j <= resourceScopes.length; j++) {
          if (resourceScopes[j] === "view") return true;
        }
      }
    }
    return false;
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
