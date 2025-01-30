import { Injectable } from "@angular/core";
import { TokenService } from "./token.service";
import { AxiosService } from "./axios.service";

import {  Observable } from "rxjs";
import { Router } from "@angular/router";
import { IErrorResponse } from "../interfaces/shared.interface";
import { IAuthResponse, IForgotPasswordInterface, IForgotResponse, ILoginInterface, IResetPasswordInterface, IResetResponse } from "../interfaces/auth.interface";
import { ToastService } from "./toast.service";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/auth';

  constructor(private tokenService: TokenService, private axiosService: AxiosService, private router: Router, private toastService: ToastService) {};

   login(data: ILoginInterface):Observable<IAuthResponse | IErrorResponse> {

    const dataToParse: ILoginInterface = {
      email: data.email,
      password: data.password,
    }

    return new Observable((observer) => {
      this.axiosService
      .post<IAuthResponse>(`${this.apiUrl}/login`, dataToParse)
      .then((response) => {
        if(response.token && response.refreshToken) {
          this.tokenService.setToken(response.token);
          this.tokenService.setRefreshToken(response.refreshToken);
          localStorage.setItem('user', JSON.stringify( response.id));
          observer.next(response);
          observer.complete();
        }
      })
      .catch((error) => {
        const errorResponse: IErrorResponse = {
          message: error.response?.data?.message || 'An unknown error occured',
          field: error.response?.data?.field || undefined
        };
        observer.error(errorResponse);
      })
    })
  }

  getLoggedInUserId() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  async logout() {
    const userId = this.getLoggedInUserId()
    await this.axiosService.post('/auth/logout', { userId });
    localStorage.removeItem('user');
    this.tokenService.removeToken();
    this.router.navigate(['auth']).then(() => {
      window.location.reload()
     })
  }

   forgotPassword(data: IForgotPasswordInterface):Observable<IForgotResponse> {
    return new Observable((observer) => {
      this.axiosService
      .post<IForgotResponse>(`${this.apiUrl}/forgot-password`, data)
      .then((response) => {
          observer.next(response);
          observer.complete();
      })
      .catch((error) => {
        const errorResponse: IErrorResponse = {
          message: error.response?.data?.message || 'An unknown error occured',
          field: error.response?.data?.field || undefined
        };
        observer.error(errorResponse);
      })
    })
  }

  resetPassword(data: IResetPasswordInterface):Observable<IResetResponse> {
    return new Observable((observer) => {
      this.axiosService
      .post<IResetResponse>(`${this.apiUrl}/reset-password`, data)
      .then((response) => {
          observer.next(response);
          observer.complete();
      })
      .catch((error) => {
        const errorResponse: IErrorResponse = {
          message: error.response?.data?.message || 'An unknown error occured',
          field: error.response?.data?.field || undefined
        };
        observer.error(errorResponse);
      })
    })
  }







}
