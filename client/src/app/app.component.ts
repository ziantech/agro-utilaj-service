import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from "./components/toast/toast.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastComponent,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AgroUtilaj Service';
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router
  ){}


  navigateToTerms():void {
    this.router.navigate(['/termeni-si-conditii'])
  }
}
