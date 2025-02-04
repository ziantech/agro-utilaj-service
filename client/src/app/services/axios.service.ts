import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';





@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  // private apiUrl =`http://localhost:5000/api/v1`
  private apiUrl = `https://api.agroutilajservice.com/api/v1`;


  constructor(private tokenService: TokenService, private router: Router) {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      timeout: 50000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.tokenService.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: any) => this.handleErrorResponse(error)
    );
  }

  private async handleErrorResponse(error: any) {
    if (error.response && error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;

      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.refreshSubscribers.push((token: string) => {
            error.config.headers['Authorization'] = `Bearer ${token}`;
            resolve(this.axiosInstance(error.config));
          });
        });
      }

      this.isRefreshing = true;
      try {
        const refreshToken = this.tokenService.getRefreshToken();
        const newToken = await this.refreshAccessToken(refreshToken);
        this.tokenService.setToken(newToken);
        this.isRefreshing = false;

        this.refreshSubscribers.forEach((callback) => callback(newToken));
        this.refreshSubscribers = [];
        error.config.headers['Authorization'] = `Bearer ${newToken}`;
        return this.axiosInstance(error.config);
      } catch (refreshError) {
        this.isRefreshing = false;
        this.tokenService.removeToken();
        this.tokenService.removeRefreshToken();
        this.router.navigate(['/auth']).then(() => {
          window.location.reload()
         })
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }


  public async refreshAccessToken(refreshToken: string | null): Promise<string> {
    if (!refreshToken) throw new Error("No refresh token available");
    const response = await axios.post(`${this.apiUrl}/auth/refresh`, { refreshToken });
    return response.data.accessToken;
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config);
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config);
  }
}

