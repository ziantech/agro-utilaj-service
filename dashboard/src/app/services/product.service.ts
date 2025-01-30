import { Injectable } from "@angular/core";
import { AxiosService } from "./axios.service";
import { IAddProductPayload, ICreatePostResponse, IProduct } from "../interfaces/product.interface";
import { Observable } from "rxjs";
import { IErrorResponse } from "../interfaces/shared.interface";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = '/product';

  constructor(private axiosService: AxiosService) {}

  createProduct(data: IAddProductPayload):Observable<ICreatePostResponse> {
    return new Observable((observer) => {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('make', data.make);
      formData.append('productModel', data.productModel);
      formData.append('negotiable', data.negotiable.toString());
      formData.append('price', JSON.stringify(data.price));

      if(data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append('images', file);
        });
      }

      this.axiosService.post<ICreatePostResponse>(`${this.apiUrl}/create-product`, formData)
      .then((response: ICreatePostResponse) => {
        observer.next(response);
        observer.complete();
      })
      .catch((error) => {
        const errorResponse: IErrorResponse = {
          message: error.response?.data?.message || 'An unknown error occurred',
          field: error.response?.data?.field || undefined,
        };
        observer.error(errorResponse);
      })
    })
  }

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

  deleteProduct(id:string):Observable<any> {
    return new Observable((observer) => {
      this.axiosService.delete(`${this.apiUrl}/delete-product/${id}`)
      .then((response:any) => {
        observer.next(response);
        observer.complete();
      })
      .catch((error:any) => {
        observer.error(error)
      })
    })
  }


  deleteImage(productId:string, imageId: string):Observable<any> {
    return new Observable((observer) => {
      this.axiosService.delete(`${this.apiUrl}/delete-image/${productId}/${imageId}`)
      .then((response:any) => {
        observer.next(response);
        observer.complete();
      })
      .catch((error:any) => {
        observer.error(error)
      })
    })
  }

  addImages(data: File[], id: string):Observable<any> {
    return new Observable((observer) => {
      const formData = new FormData();
      if(data.length > 0) {
        data.forEach((file) => {
          formData.append('images', file);
        });
      }

      this.axiosService.post(`${this.apiUrl}/add-images/${id}`, formData)
      .then((response: any) => {
        observer.next(response);
        observer.complete();
      })
      .catch((error) => {
        const errorResponse: IErrorResponse = {
          message: error.response?.data?.message || 'An unknown error occurred',
          field: error.response?.data?.field || undefined,
        };
        observer.error(errorResponse);
      })
    })
  }

  updateProduct(productId: string, data: Partial<IProduct>): Observable<{ message: string }> {
    return new Observable((observer) => {
      this.axiosService.put<{ message: string }>(`${this.apiUrl}/update-product/${productId}`, data)
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          const errorResponse: IErrorResponse = {
            message: error.response?.data?.message || 'An unknown error occurred',
            field: error.response?.data?.field || undefined,
          };
          observer.error(errorResponse);
        });
    });
  }

}
