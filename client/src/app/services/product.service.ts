import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AxiosService } from "./axios.service";


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = '/product';

  constructor(private axiosService: AxiosService) {}


  getProduct(id:string):Observable<any> {
    return new Observable((observer) => {
      this.axiosService.get(`${this.apiUrl}/get-product/${id}`)
      .then((response:any) => {
        observer.next(response);
        observer.complete();
      })
      .catch((error:any) => {
        observer.error(error)
      })
    })
  }



  getProducts():Observable<any> {
    return new Observable((observer) => {
      this.axiosService.get(`${this.apiUrl}/get-products`)
      .then((response:any) => {
        observer.next(response);
        observer.complete();
      })
      .catch((error:any) => {
        observer.error(error)
      })
    })
  }
  getLastProducts():Observable<any> {
    return new Observable((observer) => {
      this.axiosService.get(`${this.apiUrl}/get-last-products`)
      .then((response:any) => {
        observer.next(response);
        observer.complete();
      })
      .catch((error:any) => {
        observer.error(error)
      })
    })
  }

  sendMessage(name: string, email: string, message: string): Observable<{ success: boolean, message: string }> {
    return new Observable((observer) => {
      this.axiosService.post(`${this.apiUrl}/contact`, { name, email, message })
        .then((response: any) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }


}
