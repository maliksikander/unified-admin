import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  today = new Date();
  userName = "User Name"

  constructor(private router: Router,) { }

  ngOnInit() {
    let user = localStorage.getItem('username');
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
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('currentAttributePage');
    localStorage.removeItem('currentMRDPage');
    localStorage.removeItem('currentQueuePage');
    localStorage.removeItem('currentUsersPage');
    localStorage.removeItem('tenant');
    
    this.router.navigate(['/login']);
  }

}
