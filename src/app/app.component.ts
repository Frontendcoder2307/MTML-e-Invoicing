import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'e-Invoicing';

  darkMode = false;

  ngOnInit() {
    // Initialize theme from localStorage or default
    const saved = localStorage.getItem('darkMode');
    this.darkMode = saved === 'true';
    this.updateBodyClass();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    this.updateBodyClass();
  }

  updateBodyClass() {
    document.body.classList.toggle('dark-theme', this.darkMode);
  }
}
