import { Component, HostListener, OnInit } from '@angular/core';

import { DashboardComponent } from "../dashboard/dashboard.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-layoutpage',
  templateUrl: './layoutpage.component.html',
  styleUrls: ['./layoutpage.component.css']
})
export class LayoutpageComponent {

    constructor(private router:Router){}
  
  
  theme: any = localStorage.getItem('theme')
  sidebarCollapsed = true;
  message: any = localStorage.getItem('theme');
  messageSubscription: any;
  userName: any = localStorage.getItem('username')

  ngOnInit() {
    if (this.userName == '' || this.userName == null) {
      localStorage.clear()
      this.router.navigate([''])
    }
  }

  toggleSidebar(): void {
      this.sidebarCollapsed = !this.sidebarCollapsed;
  } 

  toggleTheme(): void {
    this.theme = this.theme === 'light-theme' ? 'dark-theme' : 'light-theme';
  } 

 
}
