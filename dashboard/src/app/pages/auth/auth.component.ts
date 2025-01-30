import { Component } from '@angular/core';
import { ToastComponent } from "../../components/toast/toast.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [
    ToastComponent,
    RouterModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
