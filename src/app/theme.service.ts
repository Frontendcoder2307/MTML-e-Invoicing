import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }
  private mySubject = new Subject<string>();

  sendMessage(message: string) {
    this.mySubject.next(message);
  }

  getMessage() {
    return this.mySubject.asObservable();
  }


}
