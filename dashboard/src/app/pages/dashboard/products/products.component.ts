import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

interface Price {
  amount: number;
  currency: string;
}

interface Product {
  name: string;
  unique_id: string;
  make: string;
  productModel: string;
  category: string;
  price: Price[];
  _id: string;
}

interface DataFetched {
  products: Product[]
}

@Component({
  selector: 'app-products',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [DatePipe]
})
export class ProductsComponent implements OnInit{

  isPageLoading: boolean = false;
  hasError: boolean = false;

  products: Product[] = []

  filteredProducts: Product[] = [...this.products];

  constructor(
    private productService: ProductService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.loadPageData();
  }

  async loadPageData():Promise<void> {
    this.isPageLoading = true;
    this.hasError = false;

    try {
      await this.fetchProducts();
    } catch (error) {
      console.error('Error loading travel page data:', error);
      this.hasError = true;
      this.isPageLoading = false;
    }
  }

  fetchProducts():Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getProducts().subscribe({
        next: (data: DataFetched) => {
          this.products = data.products;
          this.filteredProducts = [...data.products];
          resolve()
        },
        error: (err: any) => {
          console.error('Error fetching items:', err);
            this.isPageLoading = false;
            reject()
        },
        complete: () => {
          this.isPageLoading = false;
        }
      })
    })
  }

  navigateTo(id:string):void {
    this.router.navigate(['/dashboard/product'], { queryParams: {id: id}}).then(() => {
      window.location.reload()
    })
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredProducts = this.products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.unique_id.toLowerCase().includes(query) ||
        product.make.toLowerCase().includes(query) ||
        product.productModel.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.price.some((price) => price.amount.toString().includes(query))
      );
    });
  }

}
