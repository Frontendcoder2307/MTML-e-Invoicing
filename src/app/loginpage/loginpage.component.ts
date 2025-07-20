import { Component, Renderer2, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {ToastService} from "../toast.service";
import { Router } from "@angular/router";
import { ThemeService } from "../theme.service";
@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {
  email = '';
  password = '';
  theme = 'dark-theme'; // default

  // Toast state
  showToast = false;
  toastMessage = '';

  toggleTheme() {
    this.theme = this.theme === 'light-theme' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', this.theme)
    
  }
  constructor(private toastService: ToastService,private router:Router,private themeObject:ThemeService){}

  onSubmit() {
    if (this.email && this.password) {

      if (this.email == 'admin@mtml.com' && this.password == 'MTML123') {
        this.toastService.show(`Welcome, ${this.email.split('@')[0]}`, 'success');
        this.router.navigate(['/home'])
        localStorage.setItem('username',this.email)
      }
      // else if (this.email == 'gagan@gmail.com' && this.password == '1234567') {
      //   this.toastService.show(`Welcome, ${this.email}`, 'success');
      //   this.router.navigate(['/home'])
      // }
      else {
        this.toastService.show('Invalid User', 'danger');
      }
      
      // your login logic here
    } else {
      this.toastService.show('Please fill in all fields', 'danger');
    }

    localStorage.setItem('theme', this.theme)


  }

  hideToast() {
    this.showToast = false;
  }

  sendMessage() {
    this.themeObject.sendMessage(this.theme);
  }

  ngOnInit() {
      localStorage.removeItem('theme')
  }
}
