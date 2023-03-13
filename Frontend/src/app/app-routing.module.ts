import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./authentication/login/login.component";
import { NotFoundComponent } from "./authentication/not-found/not-found.component";

export const loginRoute: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  // {
  //   path: "not-found",
  //   component: NotFoundComponent,
  //   // canActivate: [AuthGuard],
  // },
];

// export const routes: Routes = [
//   // { path: '', redirectTo: '/login', pathMatch: 'full' },
//   // { path: 'login', component: LoginComponent },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
