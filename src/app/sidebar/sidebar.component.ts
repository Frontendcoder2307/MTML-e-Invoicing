import { Component,EventEmitter, Input, Output } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router:Router){}

  @Input() collapsed = false;
  @Input() mobileVisible = false;
  @Input() theme: 'light-theme' | 'dark-theme' = 'light-theme';
  @Output() toggle = new EventEmitter<void>();
  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
  }

  isMobile = false;

  menu = [
    { label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { label: 'Offline Invoice', icon: 'bi bi-file-earmark-text'},
    { label: 'Reports', icon: 'bi bi-bar-chart'},
    { label: 'Upload', icon: 'bi bi-upload' },
    { label: 'Logout', icon: 'bi bi-box-arrow-right' }
  ];

  gotoPage(route: any) {
    if (route == 'Logout') {
      localStorage.clear()
      this.router.navigate([''])
    }
    if (route == 'Dashboard') {
      this.router.navigate(['home/dashboard'])
    }
    if (route == 'Reports') {
      this.router.navigate(['home/reports'])
    }
    if (route == 'Upload') {
      this.router.navigate(['home/upload'])
    }
    if (route == 'Offline Invoice') {
      this.router.navigate(['home/invoices'])
    }

    
  }


}
