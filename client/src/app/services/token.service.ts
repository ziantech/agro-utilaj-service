import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'user_auth_token';
  private readonly REFRESH_TOKEN_KEY = 'user_refresh_token';

  setToken(token: string): void {
    const decoded = this.decodeToken(token);
    const expirationTime = decoded.exp * 1000;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem('token_expiration', expirationTime.toString());


  }
  getTokenExpiration(): number | null {
    const expiration = localStorage.getItem('token_expiration');
    return expiration ? parseInt(expiration, 10) : null;
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
