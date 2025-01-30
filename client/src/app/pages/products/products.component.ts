import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IProduct } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';

interface DataFetched {
  products: IProduct[]
}

@Component({
  selector: 'app-products',
  imports: [
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    FormsModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [DatePipe]
})
export class ProductsComponent implements OnInit {
  menuActive: boolean = true;
  productsLoading: boolean = false;
  products: IProduct[] = []

  constructor(
    private router: Router,
    private productService: ProductService,
    private datePipe: DatePipe,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  async loadPageData():Promise<void> {
    this.productsLoading = true;

    try {
      await this.fetchProducts();
    } catch (error) {
      console.error('Error loading travel page data:', error);
      this.productsLoading = false;
    }
  }


  fetchProducts():Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getProducts().subscribe({
        next: (data: DataFetched) => {
          this.products = data.products;
          resolve()
        },
        error: (err: any) => {
          console.error('Error fetching items:', err);
            this.productsLoading = false;
            reject()
        },
        complete: () => {
          this.productsLoading = false;
        }
      })
    })
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  navigateTo():void {
    this.router.navigate(['/'])
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Invalid Date';

    return this.datePipe.transform(parsedDate, 'd MMMM yyyy', undefined, 'ro') || 'N/A';
  }

  navigateToProduct(id:string):void {
    this.router.navigate(['/produs'], {queryParams: {id: id}})
  }
}
