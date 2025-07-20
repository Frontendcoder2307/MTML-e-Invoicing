import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  @Input() theme: 'light-theme' | 'dark-theme' = 'light-theme';

  currentYear = new Date().getFullYear();

}
