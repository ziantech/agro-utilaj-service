import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../app/services/token.service';



@Injectable({
  providedIn: 'root'
})
export class LoggedOutGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {

  }

  canActivate(): boolean {
    const isLoggedIn = this.tokenService.getToken();

    if(isLoggedIn) {
        this.router.navigate(['/dashboard']);
        return false;
    }
    return true;
  }
}
