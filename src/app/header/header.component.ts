import { Component, OnInit, Renderer2, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from "../theme.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isDarkTheme = false;
  @Input() theme: any = localStorage.getItem('theme')
  @Output() toggleTheme = new EventEmitter<void>();
  
  constructor(private renderer: Renderer2,private themeObject:ThemeService) { }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    // this.updateTheme();
  }
  @Output() themeToggle = new EventEmitter<'light-theme' | 'dark-theme'>();


  onToggleTheme() {
    // this.themeToggle.emit();
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme == true) {
      this.theme = 'dark-theme'
    }
    else {
      this.theme = 'light-theme'
    }
    // localStorage.setItem('theme', this.theme)

    const nextTheme = this.theme === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.theme = nextTheme;
    console.log(this.theme)
    localStorage.setItem('theme', this.theme)
    window.dispatchEvent(
      new CustomEvent('theme-changed', { detail: this.theme })
    );
    // Optionally, toggle a class on body for CSS-based theming
    document.body.classList.toggle('dark-theme', this.theme === 'dark');

    this.themeToggle.emit(nextTheme);
    this.sendMessage()
  }
  sendMessage() {
    this.themeObject.sendMessage(this.theme);
  }

}
