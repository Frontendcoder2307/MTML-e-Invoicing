import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }
  toasts: { message: string; type: string }[] = [];

  show(message: string, type: 'success' | 'danger'| 'warning' | 'info' = 'info') {
    this.toasts.push({ message, type });
    setTimeout(() => this.remove(message), 5000);
  }

  remove(message: string) {
    this.toasts = this.toasts.filter(t => t.message !== message);
  }

  clear() {
    this.toasts = [];
  }
}
