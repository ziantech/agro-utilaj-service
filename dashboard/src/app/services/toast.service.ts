import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public message:string = '';
  public isVisible: boolean = false;
  public type: 'success' | 'error' = 'success';

  show(message:string, type: 'success' | 'error') {
    this.message = message;
    this.isVisible = true;
    this.type = type;
    setTimeout(() => this.isVisible = false, 5000);
  }
}
